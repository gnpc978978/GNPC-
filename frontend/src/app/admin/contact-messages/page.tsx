"use client";

import { useEffect, useState } from "react";

import ContactTable from "@/components/admin/contact-messages/ContactTable";

import {
  getContactMessages,
  deleteContactMessage,
} from "@/services/contactMessageService";

import { ContactMessage } from "@/types/contactMessage";


export default function ContactMessagesPage() {


  const [messages, setMessages] =
    useState<ContactMessage[]>([]);


  const [loading, setLoading] =
    useState(true);



  const fetchMessages = async () => {

    try {

      const data =
        await getContactMessages();

      setMessages(data);


    } catch(error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };




  useEffect(() => {

    fetchMessages();

  }, []);





  const handleDelete = async (
    id:string
  ) => {


    const confirmDelete =
      confirm(
        "Delete this message?"
      );


    if(!confirmDelete)
      return;



    await deleteContactMessage(id);



    setMessages(
      messages.filter(
        (item)=>item.id !== id
      )
    );

  };





  if(loading){

    return (

      <div className="p-6">
        Loading messages...
      </div>

    );

  }




  return (

    <div className="p-6">


      <div className="mb-6">

        <h1 className="text-2xl font-bold">
          Contact Messages
        </h1>


        <p className="text-gray-500">
          Manage website contact inquiries
        </p>

      </div>




      <ContactTable

        messages={messages}

        onDelete={handleDelete}

      />


    </div>

  );

}