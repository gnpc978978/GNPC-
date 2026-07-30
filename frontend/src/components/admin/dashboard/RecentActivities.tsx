const activities = [
  {
    title: "New press release published",
    time: "10 minutes ago",
  },
  {
    title: "Gallery album created",
    time: "1 hour ago",
  },
  {
    title: "New event added",
    time: "Today",
  },
  {
    title: "Website settings updated",
    time: "Yesterday",
  },
];


export default function RecentActivities() {

  return (

    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-sm
      "
    >

      <h2
        className="
          text-lg
          font-bold
          text-slate-900
        "
      >
        Recent Activities
      </h2>


      <div
        className="
          mt-5
          space-y-4
        "
      >

        {
          activities.map((item,index)=>(

            <div
              key={index}
              className="
                flex
                items-start
                justify-between
                border-b
                border-slate-100
                pb-4
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                {item.title}
              </p>


              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                {item.time}
              </span>


            </div>

          ))
        }

      </div>


    </div>

  );

}