"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";


export default function EditSponsorPage(){


const params = useParams();

const router = useRouter();


const id = params.id as string;

console.log("PARAMS:", params);
console.log("SPONSOR ID:", id);

const [form,setForm]=useState({

name:"",
website:"",
displayOrder:"",
status:"Active"

});


const [logo,setLogo]=useState("");

const [newLogo,setNewLogo]=useState<File | null>(null);


const [loading,setLoading]=useState(true);





useEffect(()=>{


fetchSponsor();


},[]);





const fetchSponsor = async()=>{


try{


const res = await fetch(
`http://localhost:5000/api/sponsors/${id}`
);


const data = await res.json();



if(data.success){


setForm({

name:data.data.name,

website:data.data.website,

displayOrder:data.data.displayOrder,

status:data.data.status

});


setLogo(data.data.logo);


}



}
catch(error){

console.log(error);

}

finally{

setLoading(false);

}



};






const handleChange=(e:any)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};







const handleLogo=(e:any)=>{


const file=e.target.files[0];


if(file){


setNewLogo(file);


setLogo(URL.createObjectURL(file));


}


};







const updateSponsor = async()=>{


try{


const formData = new FormData();



formData.append(
"name",
form.name
);


formData.append(
"website",
form.website
);


formData.append(
"displayOrder",
form.displayOrder
);


formData.append(
"status",
form.status
);



if(newLogo){

formData.append(
"logo",
newLogo
);

}




const res = await fetch(

`http://localhost:5000/api/sponsors/${id}`,

{

method:"PUT",

body:formData

}

);



const data = await res.json();


console.log(data);

if(data.success){

alert(
"Sponsor Updated Successfully"
);

router.push("/admin/sponsors");

router.refresh();

}



}
catch(error){

console.log(error);

}



};






if(loading){

return <div className="p-6">
Loading...
</div>

}







return(

<div className="p-6">


<h1 className="text-3xl font-bold mb-6">
Edit Sponsor
</h1>




<div className="
bg-white
rounded-xl
shadow
p-6
space-y-5
">



<div>

<label className="font-medium">
Sponsor Name
</label>


<input

name="name"

value={form.name}

onChange={handleChange}

className="
w-full
border
rounded-lg
p-3
mt-1
"

/>

</div>





<div>

<label>
Current Logo
</label>


<div className="mt-3">


{logo &&

<Image

src={logo}

alt="Sponsor Logo"

width={150}

height={80}

/>

}


</div>



<input

type="file"

accept="image/*"

onChange={handleLogo}

className="
w-full
border
rounded-lg
p-3
mt-4
"

/>


</div>






<div>

<label>
Website URL
</label>


<input

name="website"

value={form.website}

onChange={handleChange}

className="
w-full
border
rounded-lg
p-3
mt-1
"

/>


</div>






<div>

<label>
Display Order
</label>


<input

type="number"

name="displayOrder"

value={form.displayOrder}

onChange={handleChange}

className="
w-full
border
rounded-lg
p-3
mt-1
"

/>


</div>






<div>

<label>
Status
</label>


<select

name="status"

value={form.status}

onChange={handleChange}

className="
w-full
border
rounded-lg
p-3
mt-1
"

>


<option value="Active">
Active
</option>


<option value="Inactive">
Inactive
</option>


</select>


</div>






<button

onClick={updateSponsor}

className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
hover:bg-blue-700
"

>

Update Sponsor

</button>





</div>


</div>

)


}