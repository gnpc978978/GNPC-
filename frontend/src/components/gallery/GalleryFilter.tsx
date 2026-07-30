"use client";

import { useState } from "react";

const categories = [
  "All",
  "Events",
  "Press Conference",
  "Awards",
  "Meetings",
];

export default function GalleryFilter() {
  const [active, setActive] = useState("All");

  return (
    <section className="bg-slate-50 py-12">

      <div className="mx-auto max-w-7xl px-6">


        <div className="flex flex-wrap justify-center gap-4">


          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setActive(category)}
              className={`
                rounded-full px-7 py-3 text-sm font-semibold
                transition-all duration-300
                ${
                  active === category
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                    : "border border-slate-200 bg-white text-slate-700 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50"
                }
              `}
            >
              {category}
            </button>

          ))}


        </div>


      </div>

    </section>
  );
}