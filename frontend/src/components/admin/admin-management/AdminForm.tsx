"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createAdmin,
  getAdminById,
  updateAdmin
} from "@/services/adminService";


interface Props {
  edit?: boolean;
  id?: string;
}


export default function AdminForm({
  edit = false,
  id
}: Props) {


const router = useRouter();


const [name,setName] = useState("");
const [username,setUsername] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");

const [role,setRole] =
useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");


const [status,setStatus] =
useState<"ACTIVE" | "INACTIVE">("ACTIVE");


const [loading,setLoading] =
useState(false);



useEffect(()=>{


if(edit && id){

getAdminById(id)
.then((admin)=>{

setName(admin.name);
setUsername(admin.username || "");
setEmail(admin.email);
setRole(admin.role);
setStatus(admin.status);

});

}


},[edit,id]);





const submitHandler = async(
e:React.FormEvent
)=>{


e.preventDefault();

if (!name.trim() || !email.trim() || (!edit && (password.length < 8 || password !== confirmPassword))) {
  window.alert(edit ? "Name and email are required." : "Use matching passwords with at least 8 characters.");
  return;
}


try{


setLoading(true);



if(edit && id){


await updateAdmin(
id,
{
name,
username,
email,
role,
status
}
);


}
else{


await createAdmin({

name,
username,
email,
password,
role,
status

});


}



router.push(
"/admin/admin-management"
);



}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}


};





return (

<form
onSubmit={submitHandler}
className="w-full max-w-xl space-y-5 rounded-lg bg-white p-4 shadow sm:p-6"
>


<div>

<label className="block mb-2">
Name
</label>

<input
className="border p-3 rounded w-full"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

</div>

<div>
<label className="block mb-2">Username</label>
<input className="border p-3 rounded w-full" value={username} onChange={(e)=>setUsername(e.target.value)} />
</div>



<div>

<label className="block mb-2">
Email
</label>

<input
type="email"
className="border p-3 rounded w-full"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

</div>

{!edit && <div><label className="block mb-2">Confirm Password</label><input type="password" className="border p-3 rounded w-full" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} /></div>}



{
!edit &&

<div>

<label className="block mb-2">
Password
</label>

<input
type="password"
className="border p-3 rounded w-full"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

</div>

}




<div>

<label className="block mb-2">
Role
</label>

<select
className="border p-3 rounded w-full"
value={role}
onChange={(e)=>
setRole(
e.target.value as "ADMIN" | "SUPER_ADMIN"
)
}
>

<option value="ADMIN">
ADMIN
</option>

<option value="SUPER_ADMIN">
SUPER_ADMIN
</option>

</select>

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
e.target.value as "ACTIVE" | "INACTIVE"
)
}
>

<option value="ACTIVE">
ACTIVE
</option>

<option value="INACTIVE">
INACTIVE
</option>

</select>

</div>




<button
disabled={loading}
className="w-full rounded bg-blue-600 px-5 py-3 text-white sm:w-auto"
>

{
loading
?
"Saving..."
:
edit
?
"Update Admin"
:
"Create Admin"
}

</button>


</form>

);

}
