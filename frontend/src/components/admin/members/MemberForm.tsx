"use client";

import { useEffect, useState } from "react";

import PhotoUploader from "./MemberPhotoUploader";

import {
  MemberFormData,
} from "@/types/member";


interface Props {
  edit?: boolean;
  initialData?: MemberFormData;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel?: () => void;
}


export default function MemberForm({
  edit = false,
  initialData,
  onSubmit,
  onCancel,
}: Props) {


const [name,setName]=useState(
  initialData?.name || ""
);


const [designation,setDesignation]=useState(
  initialData?.designation || ""
);

const [email,setEmail]=useState(initialData?.email || "");
const [phone,setPhone]=useState(initialData?.phone || "");
const [organization,setOrganization]=useState(initialData?.organization || "");
const [state,setState]=useState(initialData?.state || "");


const [photo,setPhoto]=useState<File | string | null>(
  initialData?.photo || null
);


const [displayOrder,setDisplayOrder]=useState(
  initialData?.displayOrder || 0
);


const [status,setStatus]=useState<
"active" | "inactive"
>(
  initialData?.status || "active"
);



useEffect(()=>{

if(initialData){

setName(initialData.name);
setDesignation(initialData.designation);
setEmail(initialData.email);
setPhone(initialData.phone);
setOrganization(initialData.organization || "");
setState(initialData.state || "");
setPhoto(initialData.photo);
setDisplayOrder(initialData.displayOrder);
setStatus(initialData.status);

}

},[initialData]);




const submitHandler=async(e:React.FormEvent)=>{

e.preventDefault();


const data: MemberFormData = {

name,
designation,
email,
phone,
organization,
state,
photo:
photo instanceof File
?
photo
:
null,
displayOrder,
status,

};


await onSubmit(data);

};




return (

<form
onSubmit={submitHandler}
className="bg-white shadow rounded-lg p-6 max-w-xl space-y-5"
>


<div>

<label className="block mb-2">
Name
</label>

<input
required
className="border p-3 rounded w-full"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

</div>

<div>
<label className="block mb-2">Email</label>
<input required type="email" className="border p-3 rounded w-full" value={email} onChange={(e)=>setEmail(e.target.value)} />
</div>

<div>
<label className="block mb-2">Phone Number</label>
<input required className="border p-3 rounded w-full" value={phone} onChange={(e)=>setPhone(e.target.value)} />
</div>

<div>
<label className="block mb-2">Organization</label>
<input className="border p-3 rounded w-full" value={organization} onChange={(e)=>setOrganization(e.target.value)} />
</div>

<div>
<label className="block mb-2">State</label>
<input className="border p-3 rounded w-full" value={state} onChange={(e)=>setState(e.target.value)} />
</div>




<div>

<label className="block mb-2">
Designation
</label>

<input
required
className="border p-3 rounded w-full"
value={designation}
onChange={(e)=>setDesignation(e.target.value)}
/>

</div>




<PhotoUploader
  photo={photo}
  setPhoto={setPhoto}
/>



<div>

<label className="block mb-2">
Display Order
</label>

<input
type="number"
className="border p-3 rounded w-full"
value={displayOrder}
onChange={(e)=>
setDisplayOrder(Number(e.target.value))
}
/>

</div>





<div>

<label className="block mb-2">
Status
</label>

<select
className="border p-3 rounded w-full"
value={status}
onChange={(e)=>
setStatus(
e.target.value as "active" | "inactive"
)
}
>

<option value="active">
Active
</option>

<option value="inactive">
Inactive
</option>

</select>

</div>





<div className="flex gap-3">

<button
type="submit"
className="bg-blue-600 text-white px-5 py-2 rounded"
>
{
edit
?
"Update GNPC Member"
:
"Save GNPC Member"
}
</button>


{
onCancel && (

<button
type="button"
onClick={onCancel}
className="border px-5 py-2 rounded"
>
Cancel
</button>

)
}


</div>


</form>

);

}
