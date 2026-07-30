import Link from "next/link";
import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";


interface PressRelease {
  id:number;
  title:string;
  category:string;
  author:string;
  status:string;
  date:string;
}


interface Props {
  data: PressRelease[];
}


export default function PressReleaseTable({
  data,
}:Props) {

  return (

    <div className="overflow-hidden rounded-xl bg-white shadow">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Title
            </th>

            <th className="px-6 py-4 text-left">
              Category
            </th>

            <th className="px-6 py-4 text-left">
              Author
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-left">
              Date
            </th>

            <th className="px-6 py-4 text-left">
              Actions
            </th>

          </tr>

        </thead>


        <tbody>

        {data.map((item)=>(

          <tr
            key={item.id}
            className="border-t"
          >

            <td className="px-6 py-4 font-medium">
              {item.title}
            </td>


            <td className="px-6 py-4">
              {item.category}
            </td>


            <td className="px-6 py-4">
              {item.author}
            </td>


            <td className="px-6 py-4">
              <StatusBadge status={item.status}/>
            </td>


            <td className="px-6 py-4">
              {item.date}
            </td>


            <td className="px-6 py-4">

              <div className="flex gap-3">

                <Link
                  href={`/admin/press-releases/view/${item.id}`}
                  className="text-blue-600"
                >
                  <FaEye/>
                </Link>


                <Link
                  href={`/admin/press-releases/edit/${item.id}`}
                  className="text-green-600"
                >
                  <FaEdit/>
                </Link>


                <button
                  className="text-red-600"
                >
                  <FaTrash/>
                </button>

              </div>

            </td>


          </tr>

        ))}

        </tbody>

      </table>

    </div>

  );
}