-- Chot thoi luong hien tai cho lich cu, chi dien cot dang NULL.
-- Khong suy dien gio den/bat dau/ket thuc thuc te cua du lieu cu.
UPDATE CHITIETLICHHEN ct
JOIN DICHVU dv ON dv.MADV = ct.MADV
SET ct.THOILUONG = dv.THOIGIAN
WHERE ct.THOILUONG IS NULL;
