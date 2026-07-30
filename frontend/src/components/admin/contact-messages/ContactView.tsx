"use client";


import { useEffect, useState } from "react";

import {
  getContactMessageById,
  updateContactMessageStatus,
} from "@/services/contactMessageService";

import { ContactMessage } from "@/types/contactMessage";

import StatusBadge from "./StatusBadge";



interface Props {

  id:string;

}



export default function ContactView({
  id,
}:Props){


const [message,setMessage] =
useState<ContactMessage | null>(null);



const [status,setStatus] =
useState<
"UNREAD" |
"READ" |
"REPLIED"
>("UNREAD");



const fetchMessage = async()=>{


try{

const data =
await getContactMessageById(id);


setMessage(data);

setStatus(data.status);


}
catch(error){

console.log(error);

}


};




useEffect(()=>{

fetchMessage();

},[id]);






const updateStatus = async()=>{


await updateContactMessageStatus(
id,
status
);


fetchMessage();


};






if(!message){

return (

<div>
Loading message...
</div>

);

}





return (

<div className="bg-white shadow rounded-lg p-6 max-w-3xl">


<div className="space-y-4">



<div className="flex justify-between items-center">

<h2 className="text-xl font-bold">
Message Details
</h2>


<StatusBadge
status={message.status}
/>


</div>





<div>

<h2 className="font-semibold">
Name
</h2>

<p>
{message.name}
</p>

</div>





<div>

<h2 className="font-semibold">
Email
</h2>

<p>
{message.email}
</p>

</div>





<div>

<h2 className="font-semibold">
Phone
</h2>

<p>
{message.phone || "N/A"}
</p>

</div>





<div>

<h2 className="font-semibold">
Subject
</h2>

<p>
{message.subject}
</p>

</div>





<div>

<h2 className="font-semibold">
Message
</h2>

<p className="text-gray-600">
{message.message}
</p>

</div>





<div>


<label className="block mb-2 font-semibold">
Message Status
</label>



<select

className="border p-3 rounded w-full"

value={status}

onChange={(e)=>
setStatus(
e.target.value as
"UNREAD" |
"READ" |
"REPLIED"
)
}

>


<option value="UNREAD">
Unread
</option>


<option value="READ">
Read
</option>


<option value="REPLIED">
Replied
</option>


</select>



</div>






<button

onClick={updateStatus}

className="bg-blue-600 text-white px-5 py-2 rounded"

>

Update Status

</button>



</div>


</div>

);

}