import Link from "next/link";
import AdvertisementTable from "@/components/admin/advertisements/AdvertisementTable";


export default function AdvertisementPage(){

return (

<div className="p-6">


<div className="flex justify-between items-center mb-6">


<h1 className="text-3xl font-bold">
Advertisement Management
</h1>


<Link

href="/admin/advertisements/add"

className="
bg-blue-600
text-white
px-5
py-3
rounded-lg
hover:bg-blue-700
"

>

+ Add Advertisement

</Link>


</div>



<AdvertisementTable/>


</div>

)

}