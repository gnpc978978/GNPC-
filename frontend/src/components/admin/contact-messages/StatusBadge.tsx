interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {

  return (
    <span
      className={
        status === "Read"
          ? "text-green-600 font-medium"
          : "text-orange-600 font-medium"
      }
    >
      {status}
    </span>
  );

}