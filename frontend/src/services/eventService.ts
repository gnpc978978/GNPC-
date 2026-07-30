import axios from "axios";
import { Event } from "@/types/event";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL;



const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
};



const config = () => ({
  headers:{
    Authorization:
      `Bearer ${getToken()}`
  }
});



// Get Events
export const getEvents = async () => {

  const response =
    await axios.get(
      `${API_URL}/events`,
      config()
    );

  return response.data;

};




// Create Event
export const createEvent = async (
  formData:FormData
) => {

  const response =
    await axios.post(
      `${API_URL}/events`,
      formData,
      {
        ...config(),
        headers:{
          ...config().headers,
          "Content-Type":
          "multipart/form-data",
        },
      }
    );


  return response.data;

};




// Update Event
export const updateEvent = async (
 id:string,
 formData:FormData
)=>{


 const response =
 await axios.put(
  `${API_URL}/events/${id}`,
  formData,
  {
    ...config(),
    headers:{
      ...config().headers,
      "Content-Type":
      "multipart/form-data",
    },
  }
 );


 return response.data;

};




// Delete Event
export const deleteEvent = async (
 id:string
)=>{


const response =
await axios.delete(
 `${API_URL}/events/${id}`,
 config()
);


return response.data;


};