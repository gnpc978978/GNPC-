"use client";

interface Props {
  status: string;
  onChange?: (status:string)=>void;
}

export default function AdvertisementStatus({
  status,
  onChange
}:Props){

const handleChange=(e:any)=>{

const value=e.target.value;

if(onChange){
onChange(value);
}

};


return(

<select

defaultValue={status}

onChange={handleChange}

className={`
px-3
py-2
rounded-lg
border
text-sm
font-medium
${

status==="Active"

?

"bg-green-100 text-green-700 border-green-300"

:

"bg-red-100 text-red-700 border-red-300"

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