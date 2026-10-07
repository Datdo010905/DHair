import React from 'react';
import type { IconBaseProps, IconType } from 'react-icons';

// TypeScript 4.9 requires JSX components to return an element, while
// react-icons declares ReactNode. The fragment keeps that boundary explicit.
export default function AdminIcon({
  icon,
  ...props
}: IconBaseProps & { icon: IconType }): React.ReactElement {
  return <>{icon(props)}</>;
}
