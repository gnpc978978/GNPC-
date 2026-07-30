type SectionHeadingProps = {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  size = "md",
  className = "",
}: SectionHeadingProps) {
  const alignment = {
    center: "text-center mx-auto",
    left: "text-left",
  };

  const headingSize = {
    sm: "text-2xl sm:text-3xl",
    md: "text-2xl sm:text-4xl lg:text-5xl",
    lg: "text-2xl sm:text-4xl lg:text-5xl xl:text-6xl",
  };

  return (
    <div
      className={`
        max-w-3xl
        mb-9
        sm:mb-12
        lg:mb-14
        ${alignment[align]}
        ${className}
      `}
    >
      {badge && (
        <span
          className="
            inline-flex
            rounded-full
            bg-blue-100
            px-4
            py-1.5
            text-sm
            font-semibold
            text-blue-700
          "
        >
          {badge}
        </span>
      )}

      <h2
        className={`
          mt-5
          font-bold
          tracking-tight
          text-slate-900
          ${headingSize[size]}
        `}
      >
        {title}
      </h2>

      {description && (
        <p
          className="
            mt-4
            text-base
            leading-7
            sm:text-lg
            sm:leading-8
            text-slate-600
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}
