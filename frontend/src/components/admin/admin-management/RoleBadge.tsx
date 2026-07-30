interface Props {
  role: "SUPER_ADMIN" | "ADMIN";
}

export default function RoleBadge({ role }: Props) {

  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${
        role === "SUPER_ADMIN"
          ? "bg-purple-100 text-purple-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {role}
    </span>
  );

}