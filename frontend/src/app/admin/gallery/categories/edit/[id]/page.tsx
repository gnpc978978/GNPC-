"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function EditCategory(){

const router = useRouter();


const [name,setName] = useState("Events");
const [status,setStatus] = useState("Active");


const updateHandler=(e:React.FormEvent)=>{
e.preventDefault();


console.log({
name,
status
});


router.push("/admin/gallery/categories");

};



return (

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">
Edit Gallery Category
</h1>


<form
onSubmit={updateHandler}
className="bg-white shadow rounded-lg p-6 max-w-xl space-y-5"
>


<div>

<label className="block mb-2">
Category Name
</label>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
className="border p-3 rounded w-full"
/>

</div>



<div>

<label className="block mb-2">
Status
</label>

<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
className="border p-3 rounded w-full"
>

<option>
Active
</option>

<option>
Inactive
</option>

</select>

</div>



<button
className="bg-green-600 text-white px-5 py-2 rounded"
>
Update Category
</button>


</form>


</div>

);

}