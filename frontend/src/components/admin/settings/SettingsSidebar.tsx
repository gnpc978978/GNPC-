"use client";

import Link from "next/link";
import {
  FaGlobe,
  FaImage,
  FaHome,
  FaPhone,
  FaShareAlt,
  FaFilePdf,
  FaSearch,
  FaInfoCircle
} from "react-icons/fa";

export default function SettingsSidebar(){

const menu = [
{
name:"Site Details",
link:"/admin/settings/site-details",
icon:<FaGlobe/>
},
{
name:"Logo Upload",
link:"/admin/settings/logo",
icon:<FaImage/>
},
{
name:"Hero Section",
link:"/admin/settings/hero",
icon:<FaHome/>
},
{
name:"About Section",
link:"/admin/settings/about",
icon:<FaInfoCircle/>
},
{
name:"Contact Information",
link:"/admin/settings/contact",
icon:<FaPhone/>
},
{
name:"Social Links",
link:"/admin/settings/social-links",
icon:<FaShareAlt/>
},
{
name:"Membership Form",
link:"/admin/settings/membership",
icon:<FaFilePdf/>
},
{
name:"SEO Settings",
link:"/admin/settings/seo",
icon:<FaSearch/>
}

];


return (

<div className="bg-white rounded-xl shadow p-5">

<h2 className="text-xl font-bold mb-5">
Website Settings
</h2>


<div className="space-y-3">

{
menu.map((item,index)=>(

<Link
key={index}
href={item.link}
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-blue-50
text-gray-700
transition
"
>

<span className="text-blue-600">
{item.icon}
</span>

<span>
{item.name}
</span>

</Link>

))
}

</div>


</div>

)

}
