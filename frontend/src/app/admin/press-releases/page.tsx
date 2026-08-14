"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import PressReleaseFilters from "@/components/admin/press-releases/PressReleaseFilters";
import PressReleaseTable from "@/components/admin/press-releases/PressReleaseTable";
import { authenticatedApiFetch, responseJson } from "@/services/api";


export default function PressReleasesPage() {


  const [pressReleases, setPressReleases] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [status, setStatus] = useState("");



  const fetchPressReleases = async () => {


    try {


      const res = await authenticatedApiFetch("/press-releases", {
        method: "GET",
      });

      const data = await responseJson<{ data?: any[] }>(res);


      setPressReleases(data.data || []);


    }
    catch(error){

      console.log(
        "Failed to fetch press releases",
        error
      );

    }
    finally{

      setLoading(false);

    }


  };




  useEffect(()=>{

    fetchPressReleases();

  },[]);




  const filteredPressReleases = pressReleases.filter((item)=>{


    const matchSearch =
      item.title
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      );


    const matchCategory =
      category
      ? item.category === category
      : true;



    const matchStatus =
      status
      ? item.status === status
      : true;



    return (
      matchSearch &&
      matchCategory &&
      matchStatus
    );


  });





  if(loading){

    return (

      <div className="p-6">
        Loading Press Releases...
      </div>

    );

  }




  return (

    <div className="space-y-6">



      <div className="flex items-center justify-between">


        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Press Releases
          </h1>


          <p className="text-gray-500">
            Manage all press releases from here
          </p>


        </div>




        <Link

          href="/admin/press-releases/create"

          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"

        >

          <FaPlus />

          Add New

        </Link>


      </div>





      <PressReleaseFilters

        search={search}

        setSearch={setSearch}

        category={category}

        setCategory={setCategory}

        status={status}

        setStatus={setStatus}

      />






      <PressReleaseTable

        data={filteredPressReleases}

      />



    </div>

  );

}
