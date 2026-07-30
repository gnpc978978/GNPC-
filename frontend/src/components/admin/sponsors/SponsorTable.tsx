"use client";

import Link from "next/link";

import {
  FaEdit,
  FaTrash
} from "react-icons/fa";

import SponsorStatus from "./SponsorStatus";
import { Sponsor } from "@/types/sponsor";


interface Props {

  sponsors: Sponsor[];

  onDelete?: (id: string) => void;

  onStatusChange?: (
    id: string,
    status: string
  ) => void;

}



export default function SponsorTable({

  sponsors,

  onDelete,

  onStatusChange,

}: Props) {


return(

<div className="
bg-white
rounded-xl
shadow
overflow-hidden
">


<table className="w-full">


<thead className="bg-gray-100">


<tr>


<th className="p-4 text-left">
Sponsor Name
</th>


<th className="p-4 text-left">
Website
</th>


<th className="p-4 text-left">
Display Order
</th>


<th className="p-4 text-left">
Status
</th>


<th className="p-4 text-left">
Action
</th>


</tr>


</thead>




<tbody>


{sponsors.length === 0 ? (

<tr>

<td
colSpan={5}
className="p-6 text-center text-gray-500"
>

No sponsors found.

</td>

</tr>

) : (

sponsors.map((item)=>(


<tr
key={item._id}
className="border-t"
>


<td className="p-4">

{item.name}

</td>




<td className="p-4">

<a

href={item.website}

target="_blank"

rel="noopener noreferrer"

className="text-blue-600 hover:underline"

>

{item.website}

</a>

</td>




<td className="p-4">

{item.displayOrder}

</td>





<td className="p-4">


<SponsorStatus

status={item.status}

onChange={(value)=>{


onStatusChange?.(

item._id!,

value

);


}}

/>


</td>





<td className="p-4 flex gap-4">


<Link

href={`/admin/sponsors/${item._id}`}

className="text-blue-600"

>

<FaEdit/>

</Link>





<button

onClick={() => onDelete?.(item._id!)}

className="text-red-600"

>

<FaTrash />

</button>



</td>


</tr>


))


)}



</tbody>


</table>


</div>

);

}