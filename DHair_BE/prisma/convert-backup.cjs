const fs = require('node:fs');
const path = require('node:path');
const input = fs.readFileSync(process.argv[2]);
const source = input.toString(input[0] === 0xff && input[1] === 0xfe ? 'utf16le' : 'utf8').replace(/^\uFEFF/, '');
const schema = fs.readFileSync(path.join(__dirname, 'schema.prisma'), 'utf8');
const models = new Map([...schema.matchAll(/model\s+(\w+)\s*\{([^}]+)\}/g)].map(m => [m[1], m[2]]));
const rows = new Map([...models.keys()].map(k => [k, []]));
const quote = s => "'" + s.replace(/'/g, "''") + "'";
for (const line of source.split(/\r?\n/).filter(l => /^INSERT\s/i.test(l))) {
  const match = /^INSERT \[dbo\]\.\[(\w+)\] \((.*?)\) VALUES \((.*)\)\s*;?$/.exec(line);
  if (!match || !models.has(match[1])) throw Error('Unsupported INSERT structure');
  const [, table, columnText, valueText] = match;
  const columns = [...columnText.matchAll(/\[(\w+)\]/g)].map(m => m[1]);
  const tokens = valueText.match(/CAST\(N?'(?:[^']|'')*' AS \w+\)|N?'(?:[^']|'')*'|NULL|[-+]?\d+(?:\.\d+)?(?:[Ee][-+]?\d+)?/g) || [];
  if (tokens.join(', ') !== valueText || tokens.length !== columns.length) throw Error('Unsupported values in ' + table);
  const values = tokens.map((token, i) => {
    if (token === 'NULL') return null;
    const cast = /^CAST\((N?'(?:[^']|'')*') AS (\w+)\)$/.exec(token);
    if (cast) token = cast[1];
    if (/^N?'/.test(token)) {
      let value = token.replace(/^N?'/, '').slice(0, -1).replace(/''/g, "'");
      if (cast) {
        if (!['DateTime', 'Date', 'Time'].includes(cast[2])) throw Error('Unsupported cast');
        value = value.replace('T', ' ');
        if (/\.\d*[1-9]\d*$/.test(value)) throw Error('Fractional seconds would lose precision');
        value = value.replace(/\.0+$/, '');
      }
      const field = models.get(table).split(/\r?\n/).find(l => new RegExp('^\\s*' + columns[i] + '\\s').test(l));
      if (!field) throw Error('Unknown column ' + columns[i]);
      if (/@db\.Char\(/.test(field)) value = value.trimEnd();
      return value;
    }
    return Number(token);
  });
  rows.get(table).push(Object.fromEntries(columns.map((c, i) => [c, values[i]])));
}
const ordered = [], visiting = new Set();
function visit(table) {
  if (ordered.includes(table)) return;
  if (visiting.has(table)) throw Error('Cyclic relations');
  visiting.add(table);
  const relations = [...models.get(table).matchAll(/\w+\s+(\w+)\??\s+@relation\(fields:\s*\[(\w+)\], references:\s*\[(\w+)\]/g)];
  for (const [, parent, field, ref] of relations) {
    visit(parent);
    const keys = new Set(rows.get(parent).map(r => r[ref]));
    for (const row of rows.get(table)) if (row[field] != null && !keys.has(row[field])) throw Error('Missing foreign key in ' + table + '.' + field);
  }
  const body = models.get(table);
  const constraints = [...body.matchAll(/^\s*(\w+)\s+[^\n]*@(id|unique)\b/gm)].map(m => [m[1]]);
  for (const m of body.matchAll(/@@id\(\[([^\]]+)\]/g)) constraints.push(m[1].split(',').map(s => s.trim()));
  for (const fields of constraints) {
    const seen = new Set();
    for (const row of rows.get(table)) {
      if (fields.some(f => row[f] == null)) continue;
      const key = JSON.stringify(fields.map(f => typeof row[f] === 'string' ? row[f].toLowerCase() : row[f]));
      if (seen.has(key)) throw Error('Duplicate key in ' + table + ': ' + fields.join(','));
      seen.add(key);
    }
  }
  visiting.delete(table);
  ordered.push(table);
}
for (const table of models.keys()) visit(table);
const sql = [
  '-- Data converted from SQL Server backup.sql. Select your MySQL database first.',
  '-- Requires empty tables created from schema.prisma. Run once; no existing rows are deleted.',
  'SET NAMES utf8mb4;',
  'SET @backup_previous_sql_mode = @@SESSION.sql_mode;',
  "SET SESSION sql_mode = CONCAT_WS(',', NULLIF(@@SESSION.sql_mode, ''), 'NO_BACKSLASH_ESCAPES', 'STRICT_ALL_TABLES');",
  'START TRANSACTION;'
];
for (const table of ordered) for (const row of rows.get(table)) {
  sql.push('INSERT INTO `' + table + '` (' + Object.keys(row).map(c => '`' + c + '`').join(', ') + ') VALUES (' + Object.values(row).map(v => v === null ? 'NULL' : typeof v === 'number' ? String(v) : quote(v)).join(', ') + ');');
}
sql.push('COMMIT;', 'SET SESSION sql_mode = @backup_previous_sql_mode;', '');
fs.writeFileSync(path.join(__dirname, 'backup.mysql.data.sql'), sql.join('\n'), 'utf8');
console.log('Validated source values, primary/unique keys and foreign keys.');
console.log(Object.fromEntries([...rows].map(([table, data]) => [table, data.length])));
console.log('Total rows:', [...rows.values()].reduce((n, data) => n + data.length, 0));
