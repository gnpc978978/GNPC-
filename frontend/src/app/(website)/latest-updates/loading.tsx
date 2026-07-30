import Container from "@/components/ui/Container";

export default function Loading() {
  return <section className="min-h-screen bg-slate-50 py-14 sm:py-20"><Container><div className="h-64 animate-pulse rounded-[2rem] bg-slate-200" /><div className="mt-8 h-20 animate-pulse rounded-3xl bg-slate-200" /><div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-96 animate-pulse rounded-3xl bg-slate-200" />)}</div></Container></section>;
}
