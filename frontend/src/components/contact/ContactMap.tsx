export default function ContactMap() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Find Us
          </h2>

          <p className="mt-3 text-slate-600">
            Visit our office or locate us easily using Google Maps.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-lg">
          <iframe
                title="Press Club Location"
                src="https://www.google.com/maps?q=J+267+Beta+Sector+2+Rd+Block+G+Beta+II+Greater+Noida+Uttar+Pradesh+201310&output=embed"
                width="100%"
                height="450"
                loading="lazy"
                className="border-0"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
      </div>
    </section>
  );
}