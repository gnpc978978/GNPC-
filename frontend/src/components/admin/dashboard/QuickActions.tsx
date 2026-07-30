import Link from "next/link";


const actions = [
  {
    title: "Create Press Release",
    href: "/admin/press-releases/create",
  },
  {
    title: "Add Announcement",
    href: "/admin/announcements",
  },
  {
    title: "Upload Gallery",
    href: "/admin/gallery/upload",
  },
  {
    title: "Add Event",
    href: "/admin/events/create",
  },
];


export default function QuickActions(){

return (

<div
className="
rounded-2xl
bg-white
p-6
shadow-sm
"
>


<h2
className="
text-lg
font-bold
text-slate-900
"
>
Quick Actions
</h2>



<div
className="
mt-5
grid
gap-3
"
>

{
actions.map((item)=>(

<Link
key={item.title}
href={item.href}
className="
rounded-xl
bg-slate-100
px-4
py-3
text-sm
font-semibold
text-slate-700
transition
hover:bg-blue-600
hover:text-white
"
>

{item.title}

</Link>

))
}

</div>


</div>

);

}
