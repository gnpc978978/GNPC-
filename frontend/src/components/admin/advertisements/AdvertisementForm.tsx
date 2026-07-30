"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createAdvertisement } from "@/services/advertisementService";


export default function AdvertisementForm(){
const router = useRouter();

const [form,setForm] = useState({

title:"",
sponsor:"",
url:"",
startDate:"",
endDate:"",
status:"Active"

});


const [image,setImage] = useState("");
const [banner, setBanner] = useState<File | null>(null);



const handleChange=(e:any)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};



const handleImage=(e:any)=>{

const file=e.target.files[0];

if(file){

setImage(URL.createObjectURL(file));
setBanner(file);

}

};



const saveAdvertisement = async () => {
  if (!banner) {
    alert("Please select a banner image");
    return;
  }

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => formData.append(key, value));
  formData.append("banner", banner);

  const result = await createAdvertisement(formData);
  if (!result.success) {
    alert(result.message || "Failed to add advertisement");
    return;
  }

  router.push("/admin/advertisements");
};



return (

<div className="
bg-white
rounded-xl
shadow
p-6
space-y-5
">


<div>

<label className="font-medium">
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

placeholder="Website Banner Advertisement"

/>

</div>




<div>

<label className="font-medium">
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

placeholder="Company Name"

/>


</div>




<div>

<label>
Banner Image
</label>


<input

type="file"

accept="image/*"

onChange={handleImage}

className="
w-full
border
rounded-lg
p-3
mt-2
"

/>


</div>



{
image &&

<div className="border rounded-lg p-3 w-fit">

<Image

src={image}

alt="banner preview"

width={500}

height={200}

/>

</div>

}




<div>

<label>
Redirect URL
</label>


<input

name="url"

value={form.url}

onChange={handleChange}

className="
w-full
border
rounded-lg
p-3
mt-1
"

placeholder="https://example.com"

/>


</div>




<div className="grid md:grid-cols-2 gap-5">


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

onClick={saveAdvertisement}

className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
hover:bg-blue-700
"

>

Save Advertisement

</button>



</div>

)

}
