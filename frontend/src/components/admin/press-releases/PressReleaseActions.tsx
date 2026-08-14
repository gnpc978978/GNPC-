"use client";

import { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import Link from "next/link";
import DeleteModal from "./DeleteModal";
import { authenticatedApiFetch, responseJson } from "@/services/api";


interface Props {

  id:string;

  title:string;

}



export default function PressReleaseActions({

  id,

  title,

}:Props){


  const [open,setOpen] = useState(false);

  const [loading,setLoading] = useState(false);



  const handleDelete = async()=>{


    try{


      setLoading(true);


      const res = await authenticatedApiFetch(
        `/press-releases/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      const data = await responseJson<{ success?: boolean; message?: string }>(res);



      if(data.success){

        window.location.reload();

      }



    }

    catch(error){

      console.log(error);

    }

    finally{

      setLoading(false);

      setOpen(false);

    }


  };




  return(

    <>


      <div className="flex gap-4">


        <Link

          href={`/admin/press-releases/view/${id}`}

          className="text-blue-600"

        >

          <FaEye/>

        </Link>




        <Link

          href={`/admin/press-releases/edit/${id}`}

          className="text-green-600"

        >

          <FaEdit/>

        </Link>




        <button

          onClick={()=>setOpen(true)}

          className="text-red-600"

        >

          <FaTrash/>

        </button>



      </div>




      <DeleteModal

        isOpen={open}

        title={title}

        onClose={()=>setOpen(false)}

        onConfirm={handleDelete}

      />



      {
        loading && (

          <p className="text-sm text-gray-500">
            Deleting...
          </p>

        )
      }



    </>

  );

}
