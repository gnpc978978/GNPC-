"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";


interface GalleryUploaderProps {
  onChange?: (files: File[]) => void;
}


export default function GalleryUploader({
  onChange,
}: GalleryUploaderProps) {


  const inputRef = useRef<HTMLInputElement>(null);


  const [images, setImages] = useState<string[]>([]);



  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {


    const files = e.target.files;


    if (!files) return;


    const fileArray =
      Array.from(files);



    const previews =
      fileArray.map((file) =>
        URL.createObjectURL(file)
      );



    setImages((prev) => [
      ...prev,
      ...previews,
    ]);



    onChange?.(fileArray);



    if (inputRef.current) {

      inputRef.current.value = "";

    }

  };





  const removeImage = (index:number)=>{


    setImages((prev)=>
      prev.filter(
        (_,i)=>i!==index
      )
    );

  };





  return (

    <div className="space-y-4">


      <label className="block text-sm font-semibold">
        Event Gallery
      </label>




      <div

        onClick={() =>
          inputRef.current?.click()
        }

        className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition hover:border-blue-500 hover:bg-blue-50"

      >


        <FaCloudUploadAlt className="mx-auto mb-3 text-5xl text-blue-600"/>


        <p className="font-semibold text-gray-700">
          Click to upload gallery images
        </p>


        <p className="mt-1 text-sm text-gray-500">
          Select multiple JPG, PNG or WEBP images
        </p>



        <input

          ref={inputRef}

          type="file"

          accept="image/*"

          multiple

          onChange={handleChange}

          className="hidden"

        />


      </div>






      {images.length > 0 && (

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">


          {images.map((image,index)=>(


            <div

              key={index}

              className="relative overflow-hidden rounded-xl border bg-white shadow-sm"

            >


              <Image

                src={image}

                alt={`Gallery ${index+1}`}

                width={400}

                height={300}

                className="h-44 w-full object-cover"

              />



              <button

                type="button"

                onClick={() =>
                  removeImage(index)
                }

                className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow transition hover:bg-red-700"

              >

                <FaTrash size={12}/>

              </button>



            </div>


          ))}


        </div>


      )}



    </div>

  );
}