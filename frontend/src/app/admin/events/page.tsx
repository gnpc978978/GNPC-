"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";


import EventFilters from "@/components/admin/events/EventFilters";
import EventTable from "@/components/admin/events/EventTable";

import { Event } from "@/types/event";
import { getEvents } from "@/services/eventService";


export default function EventsPage() {


  const [events, setEvents] =
    useState<Event[]>([]);


  const [loading,setLoading] =
    useState(true);



  const fetchEvents = async()=>{

    try{

      const response =
        await getEvents();


      setEvents(
        response.data || []
      );


    }catch(error){

      console.log(
        "Failed to fetch events",
        error
      );

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    fetchEvents();

  },[]);




  const totalEvents =
    events.length;


  const publishedEvents =
    events.filter(
      (event)=>
        event.status==="published"
    ).length;



  const draftEvents =
    events.filter(
      (event)=>
        event.status==="draft"
    ).length;



  return (

    <div className="space-y-6">


      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Events Management
          </h1>


          <p className="mt-2 text-gray-600">
            Manage all press club events from one place.
          </p>


          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">

            <Link
              href="/admin"
              className="hover:text-blue-600"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-800">
              Events
            </span>

          </div>

        </div>




        <Link

          href="/admin/events/create"

          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"

        >

          <FaPlus/>

          Add Event

        </Link>


      </div>





      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">


        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Events
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalEvents}
          </h2>


          <FaCalendarAlt className="mt-3 text-3xl text-blue-600"/>

        </div>





        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Published
          </p>


          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {publishedEvents}
          </h2>


          <FaCheckCircle className="mt-3 text-3xl text-green-600"/>

        </div>






        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Draft
          </p>


          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {draftEvents}
          </h2>


          <FaClock className="mt-3 text-3xl text-yellow-600"/>

        </div>





        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Status
          </p>


          <h2 className="mt-2 text-xl font-bold">
            Active
          </h2>


          <FaCalendarAlt className="mt-3 text-3xl text-gray-700"/>

        </div>



      </div>





      {/* Filters */}

      <EventFilters />





      {/* Table */}

      {
        loading ? (

          <div className="rounded-xl bg-white p-10 text-center">
            Loading events...
          </div>

        ) : (

          <EventTable
            events={events}
          />

        )
      }



    </div>

  );

}