"use client";

import { useState } from "react";
import Image from "next/image";


export default function EditAdvertisementPage(){

const [form,setForm]=useState({

title:"News Portal Banner",
sponsor:"ABC Media",
redirectUrl:"https://example.com",
startDate:"2026-07-01",
endDate:"2026-07-31",
status:"Active"

});


const [banner,setBanner]=useState(
"/images/banner-demo.jpg"
);



const handleChange=(e:any)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};



const handleImage=(e:any)=>{

const file=e.target.files[0];

if(file){

setBanner(URL.createObjectURL(file));

}

};



const updateAdvertisement=()=>{

console.log({

...form,

banner

});


alert("Advertisement Updated Successfully");

};



return(

<div className="p-6">


<h1 className="text-3xl font-bold mb-6">
Edit Advertisement
</h1>



<div className="
bg-white
rounded-xl
shadow
p-6
space-y-5
">


<div>

<label>
Advertisement Title
</label>

<input

name="title"

value={form.title}

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
Sponsor Name
</label>

<input

name="sponsor"

value={form.sponsor}

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
Current Banner
</label>


<div className="mt-3">

<Image

src={banner}

alt="banner"

width={500}

height={200}

/>

</div>


<input

type="file"

accept="image/*"

onChange={handleImage}

className="
mt-4
border
p-3
rounded-lg
w-full
"

/>


</div>




<div>

<label>
Redirect URL
</label>


<input

name="redirectUrl"

value={form.redirectUrl}

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




<div className="
grid
md:grid-cols-2
gap-5
">


<div>

<label>
Start Date
</label>


<input

type="date"

name="startDate"

value={form.startDate}

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
End Date
</label>


<input

type="date"

name="endDate"

value={form.endDate}

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

<option>
Active
</option>

<option>
Inactive
</option>


</select>


</div>




<button

onClick={updateAdvertisement}

className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
"

>

Update Advertisement

</button>



</div>


</div>

)

}