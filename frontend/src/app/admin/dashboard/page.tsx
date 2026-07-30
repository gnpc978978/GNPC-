"use client";

import {
  Newspaper,
  CalendarDays,
  Images,
  Users,
} from "lucide-react";


import StatsCard from "@/components/admin/dashboard/StatsCard";
import WelcomeBanner from "@/components/admin/dashboard/WelcomeBanner";
import RecentActivities from "@/components/admin/dashboard/RecentActivities";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import Charts from "@/components/admin/dashboard/Charts";

import useDashboardStats from "@/hooks/useDashboardStats";


export default function Dashboard() {
  const {
    stats: dashboardStats,
    loading
  } = useDashboardStats();



  const stats = [

    {
      title: "Total Admins",
      value: dashboardStats.admins,
      icon: Users,
      description: "Registered administrators",
    },


    {
      title: "Press Release",
      value: dashboardStats.pressReleases,
      icon: Newspaper,
      description: "Published press releases",
    },


    {
      title: "Events",
      value: dashboardStats.events,
      icon: CalendarDays,
      description: "Upcoming events",
    },


    {
      title: "Gallery",
      value: dashboardStats.gallery,
      icon: Images,
      description: "Uploaded images",
    },

  ];



  if (loading) {

    return (

      <div className="flex h-64 items-center justify-center text-lg font-medium">

        Loading Dashboard...

      </div>

    );

  }



  return (

    <div className="space-y-6">


      <WelcomeBanner />



      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {
          stats.map((item)=>(
            
            <StatsCard
              key={item.title}
              {...item}
            />

          ))
        }

      </div>



      <div className="grid gap-6 lg:grid-cols-2">


        <RecentActivities />


        <QuickActions />


      </div>



      <Charts />


    </div>

  );

}
