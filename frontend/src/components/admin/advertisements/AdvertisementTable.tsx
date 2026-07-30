"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Advertisement, deleteAdvertisement, getAdvertisements, updateAdvertisement } from "@/services/advertisementService";

export default function AdvertisementTable() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  const loadAdvertisements = async () => setAdvertisements(await getAdvertisements());

  useEffect(() => { loadAdvertisements(); }, []);

  const changeStatus = async (advertisement: Advertisement) => {
    const formData = new FormData();
    formData.append("status", advertisement.status === "Active" ? "Inactive" : "Active");
    await updateAdvertisement(advertisement._id, formData);
    await loadAdvertisements();
  };

  const removeAdvertisement = async (id: string) => {
    if (!window.confirm("Delete this advertisement?")) return;
    await deleteAdvertisement(id);
    await loadAdvertisements();
  };

  return <div className="overflow-hidden rounded-xl bg-white shadow"><table className="w-full"><thead className="bg-gray-100"><tr><th className="p-4 text-left">Title</th><th className="p-4 text-left">Sponsor</th><th className="p-4 text-left">Duration</th><th className="p-4 text-left">Status</th><th className="p-4 text-left">Action</th></tr></thead><tbody>{advertisements.map((advertisement) => <tr key={advertisement._id} className="border-t"><td className="p-4">{advertisement.title}</td><td className="p-4">{advertisement.sponsor}</td><td className="p-4">{new Date(advertisement.startDate).toLocaleDateString()}<br />{new Date(advertisement.endDate).toLocaleDateString()}</td><td className="p-4"><button onClick={() => changeStatus(advertisement)} className="rounded bg-slate-100 px-3 py-1">{advertisement.status}</button></td><td className="flex gap-4 p-4"><Link href={`/admin/advertisements/${advertisement._id}`} className="text-blue-600"><FaEdit /></Link><button onClick={() => removeAdvertisement(advertisement._id)} className="text-red-600"><FaTrash /></button></td></tr>)}</tbody></table></div>;
}
