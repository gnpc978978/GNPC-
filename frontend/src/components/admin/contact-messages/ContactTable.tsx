import Link from "next/link";
import { FaEye, FaTrash } from "react-icons/fa";

import StatusBadge from "./StatusBadge";

import { ContactMessage } from "@/types/contactMessage";


interface Props {

  messages: ContactMessage[];

  onDelete?: (id:string)=>void;

}



export default function ContactTable({
  messages,
  onDelete,
}: Props) {


return (

<div className="bg-white shadow rounded-lg overflow-hidden">


<table className="w-full">


<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">
Name
</th>


<th className="p-3 text-left">
Email
</th>


<th className="p-3 text-left">
Subject
</th>


<th className="p-3 text-left">
Status
</th>


<th className="p-3 text-left">
Date
</th>


<th className="p-3 text-left">
Action
</th>


</tr>

</thead>



<tbody>


{messages.length === 0 ? (

<tr>

<td
colSpan={6}
className="p-6 text-center text-gray-500"
>

No messages found

</td>

</tr>

) : (


messages.map((item)=>{


console.log(
"CONTACT ITEM:",
item
);



return (

<tr

key={item.id}

className="border-b"

>


<td className="p-3">

{item.name}

</td>



<td className="p-3">

{item.email}

</td>



<td className="p-3">

{item.subject}

</td>



<td className="p-3">

<StatusBadge

status={item.status}

/>

</td>



<td className="p-3">

{new Date(
item.createdAt
).toLocaleDateString()}

</td>



<td className="p-3 flex gap-3">


<Link

href={
item.id
?
`/admin/contact-messages/${item.id}`
:
"#"
}

className="text-blue-600"

>

<FaEye />

</Link>



<button

onClick={()=>{

if(item.id){

onDelete?.(item.id);

}

}}

className="text-red-600"

>

<FaTrash />

</button>


</td>


</tr>


);


})

)}


</tbody>


</table>


</div>

);

}