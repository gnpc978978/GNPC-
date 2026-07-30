interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={
        status === "Active"
          ? "text-green-600 font-medium"
          : "text-red-600 font-medium"
      }
    >
      {status}
    </span>
  );
}