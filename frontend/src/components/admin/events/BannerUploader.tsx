"use client";

import Image from "next/image";
import { useRef, useState, ChangeEvent } from "react";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";

interface BannerUploaderProps {
  onChange?: (file: File | null) => void;
}

export default function BannerUploader({
  onChange,
}: BannerUploaderProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] =
    useState<string | null>(null);


  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;


    setPreview(
      URL.createObjectURL(file)
    );


    onChange?.(file);

  };



  const removeImage = () => {

    setPreview(null);

    onChange?.(null);


    if(inputRef.current){
      inputRef.current.value="";
    }

  };



  return (
    <div className="space-y-3">

      <label className="block text-sm font-semibold">
        Event Banner
      </label>


      {!preview ? (

        <div
          onClick={() =>
            inputRef.current?.click()
          }
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 transition hover:border-blue-500 hover:bg-blue-50"
        >

          <FaCloudUploadAlt className="mb-3 text-5xl text-blue-600"/>


          <p className="font-semibold text-gray-700">
            Click to upload banner
          </p>


          <p className="mt-1 text-sm text-gray-500">
            JPG, PNG, WEBP
          </p>


          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

        </div>


      ) : (


        <div className="overflow-hidden rounded-xl border border-gray-200">


          <Image
            src={preview}
            alt="Banner Preview"
            width={1200}
            height={500}
            className="h-72 w-full object-cover"
          />


          <div className="flex justify-end border-t bg-white p-4">


            <button
              type="button"
              onClick={removeImage}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >

              <FaTrash/>
              Remove Banner

            </button>


          </div>


        </div>

      )}

    </div>
  );
}