"use client";

import { useEffect, useState } from "react";
import { authenticatedFetch, responseJson } from "@/services/api";


export default function useDashboardStats(){

const [stats,setStats] = useState({
    admins:0,
    pressReleases:0,
    events:0,
    gallery:0
});


const [loading,setLoading] = useState(true);



useEffect(()=>{


const fetchStats = async()=>{

try{

const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, { method: "GET" });
const data = await responseJson<{ success: boolean; stats: typeof stats }>(response);


if(data.success){

setStats(data.stats);

}


}
catch(error){

console.log(
"Dashboard Stats Error",
error
);

}
finally{

setLoading(false);

}

};


fetchStats();


},[]);



return {
stats,
loading
};

}
