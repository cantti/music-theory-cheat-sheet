import { forwardRef } from 'react';

interface CellProps {
  highlight?: boolean;
  children?: React.ReactNode;
  width: number;
  padding?: boolean;
}

export const Cell = forwardRef(function (
  props: CellProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className={`border-bottom border-end text-center flex-shrink-0 text-nowrap overflow-hidden ${props.highlight ? 'bg-danger-subtle' : ''} ${props.padding ? 'p-2' : ''}`}
      style={{ width: props.width, height: '100%' }}
    >
      {props.children}
    </div>
  );
});
