import { ContactMessage } from "@/types/contactMessage";
import { responseJson } from "@/services/api";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const authOptions = () => ({
  credentials: "include" as RequestCredentials,
  headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
});




export const getContactMessages =
async (): Promise<ContactMessage[]> => {


  const res = await fetch(
    `${API_URL}/contact-messages`,
    authOptions()
  );


  const data = await responseJson<{ data: any[] }>(res);



  return data.data.map((item:any)=>({

    id: item._id,

    name: item.name,

    email: item.email,

    phone: item.phone,

    subject: item.subject,

    message: item.message,

    status: item.status,

    createdAt: item.createdAt,

    updatedAt: item.updatedAt,

  }));

};






export const getContactMessageById =
async (
  id:string
): Promise<ContactMessage> => {


  const res = await fetch(
    `${API_URL}/contact-messages/${id}`,
    authOptions()
  );


  const data = await responseJson<{ data: any }>(res);



  const item = data.data;



  return {

    id: item._id,

    name: item.name,

    email: item.email,

    phone: item.phone,

    subject: item.subject,

    message: item.message,

    status: item.status,

    createdAt: item.createdAt,

    updatedAt: item.updatedAt,

  };


};






export const updateContactMessageStatus =
async (
  id:string,
  status:
  | "UNREAD"
  | "READ"
  | "REPLIED"
) => {


  const res = await fetch(

    `${API_URL}/contact-messages/${id}/status`,

    {

      method:"PUT",

      headers:{
        "Content-Type":
        "application/json",
        ...authOptions().headers,
      },

      credentials: "include",

      body:JSON.stringify({
        status,
      }),

    }

  );


  return responseJson(res);

};






export const deleteContactMessage =
async (
  id:string
) => {


  const res = await fetch(

    `${API_URL}/contact-messages/${id}`,

    {

      method:"DELETE",
      ...authOptions(),

    }

  );


  return responseJson(res);

};
