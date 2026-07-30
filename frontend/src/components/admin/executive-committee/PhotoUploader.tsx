"use client";

import { useEffect, useState } from "react";

interface Props {
  photo: File | string | null;
  setPhoto: (photo: File | null) => void;
}

export default function PhotoUploader({
  photo,
  setPhoto,
}: Props) {

  const [preview, setPreview] = useState<string>("");


  useEffect(() => {

    if (!photo) {
      setPreview("");
      return;
    }


    if (typeof photo === "string") {
      setPreview(photo);
      return;
    }


    const url = URL.createObjectURL(photo);

    setPreview(url);


    return () => {
      URL.revokeObjectURL(url);
    };


  }, [photo]);




  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = event.target.files?.[0];


    if (file) {
      setPhoto(file);
    }

  };




  return (

    <div className="space-y-3">

      <label className="block text-sm font-medium text-gray-700">
        Member Photo
      </label>


      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
      />


      {preview && (

        <div className="mt-3">

          <img
            src={preview}
            alt="Member Preview"
            className="h-32 w-32 rounded-lg object-cover"
          />

        </div>

      )}

    </div>

  );

}