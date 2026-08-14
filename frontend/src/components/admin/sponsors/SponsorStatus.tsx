"use client";

type SponsorStatusValue =
  | "ACTIVE"
  | "INACTIVE";

interface Props {
  status: SponsorStatusValue;
  onChange?: (
    value: SponsorStatusValue
  ) => void;
}

export default function SponsorStatus({
  status,
  onChange,
}: Props) {
  return (
    <select
      value={status}
      onChange={(e) => {
        const value =
          e.target.value as SponsorStatusValue;

        onChange?.(value);
      }}
      className={`
        rounded-lg
        border
        px-3
        py-2
        font-medium
        ${
          status === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
    >
      <option value="ACTIVE">
        Active
      </option>

      <option value="INACTIVE">
        Inactive
      </option>
    </select>
  );
}
