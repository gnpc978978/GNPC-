"use client";

import { useState } from "react";
import Image from "next/image";
import { authenticatedApiFetch, responseJson } from "@/services/api";


export default function SponsorForm(){

const [form,setForm]=useState({

name:"",
website:"",
displayOrder:"",
status:"Active"

});


const [logo, setLogo] =
  useState<File | null>(null);

const [preview, setPreview] =
  useState("");



const handleLogo = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const file = e.target.files?.[0];

  if (!file) return;

  setLogo(file);

  setPreview(
    URL.createObjectURL(file)
  );

};

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement
  >
) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const saveSponsor = async (
  e: React.FormEvent
) => {

  e.preventDefault();

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

  if (logo) {

    formData.append(
      "logo",
      logo
    );

  }

  try {

    const res = await authenticatedApiFetch("/sponsors", {
      method: "POST",
      body: formData,
    });

    const data = await responseJson<{ success?: boolean; message?: string }>(res);

    if (!data.success) {

      throw new Error(
        data.message
      );

    }

    alert(
      "Sponsor Added Successfully"
    );

    setForm({

      name: "",
      website: "",
      displayOrder: "",
      status: "ACTIVE",

    });

    setLogo(null);

    setPreview("");

  } catch (error) {

    console.error(error);

    alert(
      "Failed to add sponsor."
    );

  }

};



return(

<form

onSubmit={saveSponsor}

className="
bg-white
rounded-xl
shadow
p-6
space-y-5
"

>


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

placeholder="Company Name"

/>


</div>




<div>

<label className="font-medium">
Sponsor Logo
</label>


<input

type="file"

accept="image/*"

onChange={handleLogo}

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
preview &&

<div className="
border
rounded-lg
p-3
w-fit
">


<Image

src={preview}
alt="Sponsor Logo"

width={150}

height={80}

/>


</div>

}




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

placeholder="https://company.com"

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

placeholder="1"

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


<option value="ACTIVE">
Active
</option>

<option value="INACTIVE">
Inactive
</option>


</select>


</div>




<button

type="submit"

className="
bg-blue-600
text-white
px-6
py-3
rounded-lg
hover:bg-blue-700
"

>

Save Sponsor

</button>



</form>

)

}
