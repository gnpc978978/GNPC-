"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";

import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";

import { Admin } from "@/types/admin";
import {
  getAdmins,
  deleteAdmin,
  changeAdminStatus,
  resetAdminPassword,
} from "@/services/adminService";


export default function AdminTable() {

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);



  const fetchAdmins = async () => {

    try {

      const data = await getAdmins();

      setAdmins(
        Array.isArray(data)
          ? data
          : []
      );


    } catch(error) {

      console.log(
        "Failed to fetch admins",
        error
      );

      setAdmins([]);


    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchAdmins();

  }, []);




  const handleDelete = async (
    id:string
  ) => {


    const confirmDelete =
      confirm(
        "Are you sure you want to delete this admin?"
      );


    if(!confirmDelete)
      return;



    try {

      await deleteAdmin(id);

      fetchAdmins();


    } catch(error) {

      console.log(
        "Delete failed",
        error
      );

    }


  };

  const handleReset = async (id: string) => {
    const password = window.prompt("Enter a new password (minimum 8 characters):");
    if (!password) return;
    try { await resetAdminPassword(id, password); await fetchAdmins(); } catch { window.alert("Unable to reset password."); }
  };

  const handleStatus = async (id: string, status: "ACTIVE" | "INACTIVE") => {
    try { await changeAdminStatus(id, status); await fetchAdmins(); } catch { window.alert("Unable to change status."); }
  };




  if(loading){

    return (

      <div className="p-5">

        Loading admins...

      </div>

    );

  }




  return (

    <div className="overflow-x-auto rounded-lg bg-white shadow">


      <table className="w-full min-w-[680px]">


        <thead className="bg-gray-100">


          <tr>


            <th className="p-3 text-left">
              Name
            </th>


            <th className="p-3 text-left">
              Email
            </th>


            <th className="p-3 text-left">
              Role
            </th>


            <th className="p-3 text-left">
              Status
            </th>


            <th className="p-3 text-left">
              Action
            </th>


          </tr>


        </thead>




        <tbody>


          {admins.length === 0 ? (

            <tr>

              <td
                colSpan={5}
                className="p-5 text-center text-gray-500"
              >

                No admins found

              </td>

            </tr>


          ) : (


            admins.map((admin)=>(

              <tr

                key={admin._id}

                className="border-b"


              >


                <td className="p-3">

                  {admin.name}

                </td>



                <td className="p-3">

                  {admin.email}

                </td>




                <td className="p-3">

                  <RoleBadge
                    role={admin.role}
                  />

                </td>




                <td className="p-3">

                  <StatusBadge
                    status={admin.status}
                  />

                </td>




                <td className="flex gap-3 whitespace-nowrap p-3">


                  <Link

                    href={`/admin/admin-management/edit/${admin._id}`}

                    className="text-blue-600"

                  >

                    <FaEdit />

                  </Link>




                  <button

                    onClick={() =>
                      handleDelete(admin._id)
                    }

                    className="text-red-600"

                  >

                    <FaTrash />

                  </button>

                  <button onClick={() => handleReset(admin._id)} className="text-slate-700" aria-label={`Reset password for ${admin.name}`}><FaKey /></button>
                  <button onClick={() => handleStatus(admin._id, admin.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")} className="text-amber-600">{admin.status === "ACTIVE" ? "Deactivate" : "Activate"}</button>



                </td>


              </tr>


            ))

          )}



        </tbody>


      </table>


    </div>

  );

}
