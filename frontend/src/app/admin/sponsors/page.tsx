"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import SponsorTable from "@/components/admin/sponsors/SponsorTable";

import {
  getSponsors,
  deleteSponsor,
  updateSponsorStatus,
} from "@/services/sponsorService";

import { Sponsor } from "@/types/sponsor";


export default function SponsorPage() {


  const [loading,setLoading] =
    useState(true);


  const [sponsors,setSponsors] =
    useState<Sponsor[]>([]);



  const fetchSponsors = async()=>{

    try{

      const data =
        await getSponsors();

      setSponsors(data);

    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    fetchSponsors();

  },[]);




  const handleDelete = async(
    id:string
  )=>{


    const confirmDelete =
      confirm(
        "Are you sure you want to delete this sponsor?"
      );


    if(!confirmDelete) return;



    try{

      await deleteSponsor(id);

      fetchSponsors();

    }
    catch(error){

      console.log(error);

    }


  };





  const handleStatusChange = async(
    id:string,
    status:string
  )=>{


    try{


      await updateSponsorStatus(
        id,
        status
      );


      fetchSponsors();


    }
    catch(error){

      console.log(error);

    }


  };






  if(loading){

    return(

      <div className="p-6">
        Loading Sponsors...
      </div>

    );

  }






  return(

    <div className="p-6">


      <div
        className="
        mb-6
        flex
        items-center
        justify-between
        "
      >


        <h1 className="text-3xl font-bold">
          Sponsor Management
        </h1>




        <Link

          href="/admin/sponsors/add"

          className="
          rounded-lg
          bg-blue-600
          px-5
          py-3
          text-white
          hover:bg-blue-700
          "

        >

          + Add Sponsor

        </Link>


      </div>





      <SponsorTable

        sponsors={sponsors}

        onDelete={handleDelete}

        onStatusChange={handleStatusChange}

      />



    </div>

  );

}