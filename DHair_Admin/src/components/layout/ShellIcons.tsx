import { SVGProps } from 'react';

const icon = (path: string) => (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d={path} />
  </svg>
);

export const FiSearch = icon('M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0');
export const FiX = icon('M6 6l12 12M6 18L18 6');
export const FiArrowUpRight = icon('M7 17L17 7M7 7h10v10');
export const FiCalendar = icon(
  'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2',
);
export const FiPhone = icon(
  'M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 2.7 3',
);
export const FiMail = icon('M3 5h18v14H3zM3 5l9 7 9-7');
export const FiUser = icon('M20 21v-2a7 7 0 0 0-14 0v2M17 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0');
export const FiLogOut = icon('M9 21H3V3h6M9 12h12M16 7l5 5-5 5');
