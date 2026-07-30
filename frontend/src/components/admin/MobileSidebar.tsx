"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  X,
  LogOut,
  LayoutDashboard,
  Newspaper,
  Megaphone,
  CalendarDays,
  Images,
  Users,
  Settings,
  Mail,
  Presentation,
  BadgeDollarSign,
} from "lucide-react";


const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    name: "Press Releases",
    icon: Newspaper,
    href: "/admin/press-releases",
  },
  {
    name: "Announcements",
    icon: Megaphone,
    href: "/admin/announcements",
  },
  {
    name: "Press Conferences",
    icon: Presentation,
    href: "/admin/press-conferences",
  },
  {
    name: "Events",
    icon: CalendarDays,
    href: "/admin/events",
  },
  {
    name: "Gallery",
    icon: Images,
    href: "/admin/gallery",
  },
  {
    name: "Homepage Banners",
    icon: Images,
    href: "/admin/banners",
  },
  {
    name: "Office Bearers",
    icon: Users,
    href: "/admin/members",
  },
  {
    name: "Executive Committee",
    icon: Users,
    href: "/admin/executive-committee",
  },
  {
    name: "Messages",
    icon: Mail,
    href: "/admin/contact-messages",
  },
  {
    name: "Advertisements",
    icon: BadgeDollarSign,
    href: "/admin/advertisements",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
  {
    name: "Admin Management",
    icon: Users,
    href: "/admin/admin-management",
    roles: ["SUPER_ADMIN"],
  },
];


interface MobileSidebarProps {
  open:boolean;
  setOpen:(value:boolean)=>void;
}


export default function MobileSidebar({
  open,
  setOpen,
}:MobileSidebarProps){


const router = useRouter();
const pathname = usePathname();
const { user } = useAuth();


const handleLogout = async()=>{


const confirmLogout = window.confirm(
  "Do you want to logout?"
);


if(!confirmLogout) return;


try{


await fetch(
 `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
 {
  method:"POST",
  credentials:"include",
 }
);


localStorage.removeItem("user");


setOpen(false);


router.replace("/admin/login");
router.refresh();


}catch(error){

console.error(
"Logout Error:",
error
);

}


};



return (

<>

{
open && (

<div
onClick={()=>setOpen(false)}
className="
fixed
inset-0
z-40
bg-black/50
lg:hidden
"
/>

)
}


<aside
className={`
fixed
left-0
top-0
z-50
flex
h-screen
w-72
flex-col
bg-slate-950
p-5
text-white
transition-transform
duration-300
lg:hidden

${
open
?
"translate-x-0"
:
"-translate-x-full"
}

`}
>


<div
className="
mb-8
flex
items-center
justify-between
"
>

<h2
className="
text-xl
font-bold
"
>
GN Press Club
</h2>


<button
onClick={()=>setOpen(false)}
>
<X size={24}/>
</button>


</div>



<nav
className="
flex-1
space-y-2
"
>

{
menu
  .filter((item) => !item.roles || item.roles.includes(user?.role ?? ""))
  .map((item)=>{

const Icon=item.icon;

return (

<Link
key={item.name}
href={item.href}
onClick={()=>setOpen(false)}
className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
>

<Icon size={20}/>

{item.name}

</Link>

);

})
}

</nav>



{/* Logout */}

<div className="pt-5">

<button
onClick={handleLogout}
className="
flex
w-full
items-center
gap-3
rounded-xl
bg-slate-800
px-4
py-3
text-sm
text-slate-300
transition
hover:bg-red-600
hover:text-white
"
>

<LogOut size={20}/>

Logout

</button>


</div>


</aside>


</>

);

}
