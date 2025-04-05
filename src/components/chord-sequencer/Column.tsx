interface ColumnProps {
  children?: React.ReactNode;
  width: number;
}

export function Column(props: ColumnProps) {
  return (
    <div
      className={`d-flex flex-column border-end flex-shrink-0`}
      style={{
        width: props.width,
      }}
    >
      {props.children}
    </div>
  );
}
