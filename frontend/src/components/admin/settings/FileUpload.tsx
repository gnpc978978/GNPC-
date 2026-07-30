"use client";

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
}

export default function FileUpload({
  label,
  accept,
  onChange,
}: FileUploadProps) {
  return (
    <div className="space-y-2">
      <label className="block font-medium">
        {label}
      </label>

      <input
        type="file"
        accept={accept}
        onChange={(e) =>
          onChange(
            e.target.files?.[0] || null
          )
        }
        className="
          block
          w-full
          rounded-lg
          border
          p-2
        "
      />
    </div>
  );
}