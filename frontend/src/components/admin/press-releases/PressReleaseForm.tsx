"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface PressReleaseFormProps {
  initialData?: {
    title?: string;
    content?: string;
    category?: string;
    status?: string;
    image?: string;
  };
}


export default function PressReleaseForm({
  initialData,
}: PressReleaseFormProps) {


  const router = useRouter();


  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState(
    initialData?.image || ""
  );


  const [loading,setLoading] = useState(false);



  const [formData,setFormData] = useState({

    title: initialData?.title || "",

    content: initialData?.content || "",

    category: initialData?.category || "Announcement",

    status: initialData?.status || "DRAFT",

  });




  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  )=>{


    setFormData({

      ...formData,

      [e.target.name]:e.target.value,

    });


  };





  const handleImageChange = (
    e:React.ChangeEvent<HTMLInputElement>
  )=>{


    const file =
      e.target.files?.[0];


    if(file){

      setImage(file);

      setPreview(
        URL.createObjectURL(file)
      );

    }


  };





  const handleSubmit = async(
    e:React.FormEvent
  )=>{


    e.preventDefault();


    if(!formData.title || !formData.content){

      toast.error(
        "Title and content are required"
      );

      return;

    }



    try{


      setLoading(true);



      const token =
        localStorage.getItem("token");



      const data = new FormData();



      data.append(
        "title",
        formData.title
      );



      data.append(
        "slug",
        formData.title
        .toLowerCase()
        .replaceAll(" ","-")
      );



      data.append(
        "content",
        formData.content
      );



      data.append(
        "category",
        formData.category
      );



      data.append(
        "status",
        formData.status
      );



      if(image){

        data.append(
          "image",
          image
        );

      }




      const res = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/press-releases`,

        {

          method:"POST",

          headers:{

            Authorization:
            `Bearer ${token}`

          },

          body:data

        }

      );




      const result =
        await res.json();




      if(result.success){


        toast.success(
          "Press Release created successfully"
        );


        router.push(
          "/admin/press-releases"
        );


      }
      else{


        toast.error(
          result.message ||
          "Something went wrong"
        );


      }



    }
    catch(error){


      toast.error(
        "Server error"
      );


    }
    finally{


      setLoading(false);


    }


  };





  return (

    <form

      onSubmit={handleSubmit}

      className="space-y-6 rounded-xl bg-white p-6 shadow"

    >



      <div>

        <label className="mb-2 block font-medium">
          Title
        </label>


        <input

          name="title"

          value={formData.title}

          onChange={handleChange}

          placeholder="Enter press release title"

          className="w-full rounded-lg border px-4 py-3"

        />


      </div>




      <div>

        <label className="mb-2 block font-medium">
          Content
        </label>


        <textarea

          name="content"

          value={formData.content}

          onChange={handleChange}

          rows={8}

          placeholder="Write press release content..."

          className="w-full rounded-lg border px-4 py-3"

        />


      </div>




      <div>

        <label className="mb-2 block font-medium">
          Category
        </label>


        <select

          name="category"

          value={formData.category}

          onChange={handleChange}

          className="w-full rounded-lg border px-4 py-3"

        >

          <option>
            Announcement
          </option>

          <option>
            Event
          </option>

          <option>
            Notice
          </option>

          <option>
            Achievement
          </option>


        </select>


      </div>




      <div>

        <label className="mb-2 block font-medium">
          Status
        </label>


        <select

          name="status"

          value={formData.status}

          onChange={handleChange}

          className="w-full rounded-lg border px-4 py-3"

        >

          <option value="DRAFT">
            Draft
          </option>


          <option value="PUBLISHED">
            Published
          </option>


        </select>


      </div>




      <div>


        <label className="mb-2 block font-medium">
          Featured Image
        </label>



        <input

          type="file"

          accept="image/*"

          onChange={handleImageChange}

          className="w-full rounded-lg border px-4 py-3"

        />



        {
          preview && (

            <img

              src={preview}

              alt="Preview"

              className="mt-4 h-40 w-40 rounded-lg object-cover"

            />

          )
        }


      </div>





      <button

        type="submit"

        disabled={loading}

        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"

      >

        {
          loading
          ? "Saving..."
          : "Save Press Release"
        }


      </button>




    </form>

  );

}