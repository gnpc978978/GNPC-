"use client";

import { useParams } from "next/navigation";

import AdminForm from "@/components/admin/admin-management/AdminForm";


export default function EditAdminPage() {

  const params = useParams();

  const id = params.id as string;


  return (

    <div className="p-0 sm:p-2">

      <h1 className="text-2xl font-bold mb-6">
        Edit Admin
      </h1>


      <AdminForm
        edit={true}
        id={id}
      />

    </div>

  );

}
