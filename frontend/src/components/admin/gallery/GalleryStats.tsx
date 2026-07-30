"use client";

import { FaImages, FaFolderOpen, FaTags } from "react-icons/fa";

interface GalleryStatsProps {
  totalAlbums: number;
  totalImages: number;
  totalCategories: number;
}

export default function GalleryStats({
  totalAlbums,
  totalImages,
  totalCategories,
}: GalleryStatsProps) {
  const stats = [
    {
      title: "Total Albums",
      value: totalAlbums,
      icon: FaFolderOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Images",
      value: totalImages,
      icon: FaImages,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: FaTags,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {stat.value}
              </h2>
            </div>

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${stat.color}`}
            >
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}