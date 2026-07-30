"use client";

import { FaSearch } from "react-icons/fa";


interface Props {

  search:string;

  setSearch:(value:string)=>void;

  category:string;

  setCategory:(value:string)=>void;

  status:string;

  setStatus:(value:string)=>void;

}



export default function PressReleaseFilters({

  search,

  setSearch,

  category,

  setCategory,

  status,

  setStatus,

}:Props){


  return (

    <div className="rounded-xl bg-white p-5 shadow">


      <div className="flex flex-col gap-4 md:flex-row">


        <div className="relative flex-1">


          <FaSearch className="absolute left-3 top-4 text-gray-400" />


          <input

            type="text"

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            placeholder="Search press releases..."

            className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"

          />


        </div>




        <select

          value={category}

          onChange={(e)=>
            setCategory(e.target.value)
          }

          className="rounded-lg border px-4 py-3"

        >

          <option value="">
            All Categories
          </option>


          <option value="Event">
            Event
          </option>


          <option value="Announcement">
            Announcement
          </option>


          <option value="Notice">
            Notice
          </option>


        </select>





        <select

          value={status}

          onChange={(e)=>
            setStatus(e.target.value)
          }

          className="rounded-lg border px-4 py-3"

        >


          <option value="">
            All Status
          </option>


          <option value="PUBLISHED">
            Published
          </option>


          <option value="DRAFT">
            Draft
          </option>


        </select>



      </div>


    </div>

  );

}