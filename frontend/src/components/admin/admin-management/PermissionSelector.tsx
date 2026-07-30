"use client";

interface Props {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
}

const permissionList = [
  "News Management",
  "Press Release Management",
  "Announcement Management",
  "Event Management",
  "Gallery Management",
  "Member Management",
  "Contact Management",
];


export default function PermissionSelector({
  permissions,
  setPermissions,
}: Props) {


const handleChange = (permission:string)=>{

if(permissions.includes(permission)){

setPermissions(
permissions.filter(
(item)=>item !== permission
)
);

}else{

setPermissions([
...permissions,
permission
]);

}

};



return (

<div>

<label className="block mb-2 font-medium">
Permissions
</label>


<div className="space-y-2">

{permissionList.map((permission)=>(

<label
key={permission}
className="flex items-center gap-2"
>

<input
type="checkbox"
checked={permissions.includes(permission)}
onChange={()=>handleChange(permission)}
/>


<span>
{permission}
</span>


</label>

))}


</div>


</div>

);

}