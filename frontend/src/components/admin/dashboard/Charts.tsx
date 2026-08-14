"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useEffect, useState } from "react";
import { authenticatedApiFetch, responseJson } from "@/services/api";


export default function Charts(){

type ChartPoint = { month: string; pressReleases: number; events: number; gallery: number };
const [data,setData] = useState<ChartPoint[]>([]);



useEffect(()=>{


const fetchCharts = async()=>{

try{

const response = await authenticatedApiFetch("/dashboard/charts", { method: "GET" });
const result = await responseJson<{ success: boolean; data: ChartPoint[] }>(response);


if(result.success){

setData(result.data);

}


}
catch(error){

console.error(
"Chart Error:",
error
);

}

};


fetchCharts();


},[]);



return (

<div
className="
rounded-2xl
bg-white
p-6
shadow-sm
"
>

<h2
className="
text-lg
font-bold
text-slate-900
"
>
Website Analytics
</h2>



<div
className="
mt-6
h-60
"
>


<ResponsiveContainer
width="100%"
height="100%"
>

<LineChart
  data={data}
>

<CartesianGrid
  strokeDasharray="3 3"
/>

<XAxis
  dataKey="month"
/>

<YAxis
/>

<Tooltip />

<Legend />

<Line
  type="monotone"
  dataKey="pressConferences"
  name="Press Conferences"
  strokeWidth={2}
/>

<Line
  type="monotone"
  dataKey="events"
  name="Events"
  strokeWidth={2}
/>

<Line
  type="monotone"
  dataKey="gallery"
  name="Gallery"
  strokeWidth={2}
/>

</LineChart>


</ResponsiveContainer>


</div>


</div>

);

}
