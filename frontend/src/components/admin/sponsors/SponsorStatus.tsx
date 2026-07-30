"use client";


interface Props{

status:string;

onChange?:(value:string)=>void;

}



export default function SponsorStatus({

status,

onChange

}:Props){


return(

<select

defaultValue={status}

onChange={(e)=>{

if(onChange){

onChange(e.target.value)

}

}}

className={`
px-3
py-2
rounded-lg
border
font-medium

${
status==="Active"

?

"bg-green-100 text-green-700"

:

"bg-red-100 text-red-700"

}

`}

>


<option value="Active">
Active
</option>


<option value="Inactive">
Inactive
</option>


</select>

)

}