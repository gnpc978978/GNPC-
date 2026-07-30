"use client";

import Link from "next/link";
import { useState } from "react";

import BannerUploader from "./BannerUploader";
import GalleryUploader from "./GalleryUploader";
import { createEvent, updateEvent } from "@/services/eventService";
import { useRouter } from "next/navigation";


interface EventFormProps {
  initialData?: {
    title: string;
    location: string;
    date: string;
    status: "draft" | "published";
    description: string;
    banner?: string;
    gallery?: string[];
  };

  isEdit?: boolean;
}


export default function EventForm({
  initialData,
  isEdit = false,
}: EventFormProps) {
  const router = useRouter();

const [banner,setBanner] = useState<File | null>(null);
const [gallery,setGallery] = useState<File[]>([]);


  const [title, setTitle] =
    useState(initialData?.title || "");


  const [location, setLocation] =
    useState(initialData?.location || "");


  const [date, setDate] =
    useState(initialData?.date || "");


  const [status, setStatus] =
    useState<"draft" | "published">(
      initialData?.status || "draft"
    );


  const [description, setDescription] =
    useState(
      initialData?.description || ""
    );

const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();


  try {


    const formData = new FormData();


    formData.append(
      "title",
      title
    );


    formData.append(
      "location",
      location
    );


    formData.append(
      "date",
      date
    );


    formData.append(
      "status",
      status
    );


    formData.append(
      "description",
      description
    );



    if(banner){

      formData.append(
        "banner",
        banner
      );

    }



    gallery.forEach(
      (file)=>{

        formData.append(
          "gallery",
          file
        );

      }
    );



    if(isEdit && initialData){

      await updateEvent(
        (initialData as any)._id,
        formData
      );

    }else{

      await createEvent(
        formData
      );

    }



    router.push(
      "/admin/events"
    );


  }catch(error){

    console.log(
      "Event save failed",
      error
    );

  }

};


  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >


      {/* Basic Information */}

      <div className="grid gap-6 md:grid-cols-2">


        <div>

          <label className="mb-2 block text-sm font-semibold">
            Event Title
          </label>


          <input
            type="text"
            value={title}
            onChange={(e)=>
              setTitle(e.target.value)
            }
            placeholder="Enter event title"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

        </div>



        <div>

          <label className="mb-2 block text-sm font-semibold">
            Location
          </label>


          <input
            type="text"
            value={location}
            onChange={(e)=>
              setLocation(e.target.value)
            }
            placeholder="Event location"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

        </div>



        <div>

          <label className="mb-2 block text-sm font-semibold">
            Date
          </label>


          <input
            type="date"
            value={date}
            onChange={(e)=>
              setDate(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
          />

        </div>


      </div>




      {/* Status */}

      <div>

        <label className="mb-2 block text-sm font-semibold">
          Status
        </label>


        <select

          value={status}

          onChange={(e)=>
            setStatus(
              e.target.value as
              "draft" | "published"
            )
          }


          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"

        >

          <option value="draft">
            Draft
          </option>


          <option value="published">
            Published
          </option>


        </select>

      </div>





      {/* Description */}

      <div>


        <label className="mb-2 block text-sm font-semibold">
          Description
        </label>


        <textarea

          rows={5}

          value={description}

          onChange={(e)=>
            setDescription(
              e.target.value
            )
          }


          placeholder="Write event description..."

          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"

        />


      </div>





      {/* Banner */}
<BannerUploader
  onChange={setBanner}
/>

      {/* Gallery */}

      <GalleryUploader
  onChange={setGallery}
/>





      {/* Buttons */}

      <div className="flex justify-end gap-3 pt-4">


        <Link

          href="/admin/events"

          className="rounded-lg border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100"

        >

          Cancel

        </Link>




        <button

          type="submit"

          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"

        >

          {isEdit
            ? "Update Event"
            : "Create Event"}

        </button>


      </div>


    </form>

  );
}