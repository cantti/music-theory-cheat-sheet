interface RowProps {
  children?: React.ReactNode;
  height: number;
}

export function SequencerRow(props: RowProps) {
  return (
    <div
      className="d-inline-flex"
      style={{ position: 'relative', height: props.height }}
    >
      {props.children}
    </div>
  );
}
