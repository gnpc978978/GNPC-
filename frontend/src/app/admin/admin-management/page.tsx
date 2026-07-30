import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import AdminTable from "@/components/admin/admin-management/AdminTable";


export default function AdminManagementPage() {

  return (

    <div className="p-0 sm:p-2">


      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


        <div>

          <h1 className="text-2xl font-bold">
            Admin Management
          </h1>


          <p className="text-gray-500">
            Manage admins, roles and permissions
          </p>

        </div>



        <Link

          href="/admin/admin-management/create"

          className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto"

        >

          <FaPlus />

          Add Admin

        </Link>


      </div>



      <AdminTable />


    </div>

  );

}
