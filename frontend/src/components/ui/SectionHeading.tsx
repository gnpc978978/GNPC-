type SectionHeaderProps = {
  label: string
  title: string
  description?: string
  className?: string
}

export default function SectionHeader({
  label,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mx-auto w-full max-w-5xl text-center ${className}`}>
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="h-[3px] w-10 rounded-full bg-blue-600" />
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
          {label}
        </span>
      </div>

      <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
