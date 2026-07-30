import PressReleaseActions from "./PressReleaseActions";
import StatusBadge from "./StatusBadge";


interface PressRelease {

  _id: string;

  title: string;

  category: string;

  createdBy?: {
    name:string;
  };

  status: string;

  createdAt: string;

}



interface PressReleaseTableProps {

  data: PressRelease[];

}



export default function PressReleaseTable({
  data,
}: PressReleaseTableProps) {


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


          {
            data.length > 0 ? (


              data.map((item)=>(


                <tr
                  key={item._id}
                  className="border-t"
                >


                  <td className="px-6 py-4 font-medium text-gray-900">

                    {item.title}

                  </td>



                  <td className="px-6 py-4 text-gray-600">

                    {item.category}

                  </td>



                  <td className="px-6 py-4 text-gray-600">

                    {item.createdBy?.name || "Admin"}

                  </td>



                  <td className="px-6 py-4">

                    <StatusBadge
                      status={item.status}
                    />

                  </td>



                  <td className="px-6 py-4 text-gray-600">

                    {
                      new Date(
                        item.createdAt
                      ).toLocaleDateString()
                    }

                  </td>



                  <td className="px-6 py-4">


                    <PressReleaseActions

                      id={item._id}

                      title={item.title}

                    />


                  </td>


                </tr>


              ))


            ) : (


              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >

                  No press releases found

                </td>

              </tr>


            )
          }


        </tbody>


      </table>


    </div>

  );

}