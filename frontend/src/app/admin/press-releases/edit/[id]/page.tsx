"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "next/navigation";

import PressReleaseForm from "@/components/admin/press-releases/PressReleaseForm";


export default function EditPressReleasePage() {


  const params = useParams();

  const id = params.id as string;


  const [pressRelease,setPressRelease] = useState<any>(null);

  const [loading,setLoading] = useState(true);



  useEffect(()=>{


    const fetchPressRelease = async()=>{


      try{


        const token = localStorage.getItem("token");


        const res = await fetch(

          `${process.env.NEXT_PUBLIC_API_URL}/press-releases/${id}`,

          {

            headers:{

              Authorization:`Bearer ${token}`

            }

          }

        );



        const data = await res.json();



        if(data.success){

          setPressRelease(data.data);

        }


      }

      catch(error){

        console.log(error);

      }

      finally{

        setLoading(false);

      }


    };



    fetchPressRelease();


  },[id]);




  if(loading){

    return (

      <div className="p-6">
        Loading...
      </div>

    );

  }




  if(!pressRelease){

    return (

      <div className="rounded-xl bg-white p-8 shadow">

        <h1 className="text-xl font-bold">
          Press Release Not Found
        </h1>

      </div>

    );

  }




  return (

    <div className="space-y-6">


      <div className="flex items-center justify-between">


        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Edit Press Release
          </h1>


          <p className="text-gray-500">
            Update press release details
          </p>

        </div>




        <Link

          href="/admin/press-releases"

          className="flex items-center gap-2 rounded-lg border px-5 py-3 hover:bg-gray-100"

        >

          <FaArrowLeft />

          Back

        </Link>


      </div>




      <PressReleaseForm

        initialData={pressRelease}

      />


    </div>

  );

}