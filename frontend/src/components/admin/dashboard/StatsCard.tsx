import { LucideIcon } from "lucide-react";


interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
}


export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: StatsCardProps) {


  return (

    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {title}
          </p>


          <h2
            className="
              mt-3
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {value}
          </h2>


          <p
            className="
              mt-2
              text-xs
              text-slate-400
            "
          >
            {description}
          </p>

        </div>


        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-blue-100
            text-blue-600
          "
        >

          <Icon size={24}/>

        </div>


      </div>

    </div>

  );

}