import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the Greater Noida Press Club website.",
};

export default function TermsPage() {
  return (
    <main className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Greater Noida Press Club
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              Please review these terms before using this website.
            </p>
          </div>

          <div className="space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                1. Website Use
              </h2>

              <p className="mt-3">
                This website is provided to share information,
                announcements, events, press activities, and other
                resources related to the Greater Noida Press Club.
                By using this website, you agree to use it lawfully
                and responsibly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                2. Website Content
              </h2>

              <p className="mt-3">
                Information published on this website may include
                news, announcements, event information, photographs,
                documents, and other materials. Reasonable efforts
                are made to keep published information accurate and
                current, but information may change without prior
                notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                3. Intellectual Property
              </h2>

              <p className="mt-3">
                Unless otherwise stated, website content, branding,
                graphics, documents, and other materials are owned by
                or used with permission by the Greater Noida Press
                Club. Content should not be reproduced or
                redistributed without appropriate authorization.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                4. External Links
              </h2>

              <p className="mt-3">
                The website may contain links to external websites or
                services. The Greater Noida Press Club is not
                responsible for the content, availability, or
                policies of third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                5. Changes to These Terms
              </h2>

              <p className="mt-3">
                These terms may be updated when necessary. Any
                changes will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                6. Contact
              </h2>

              <p className="mt-3">
                If you have questions about these terms or the use
                of this website, please contact the Greater Noida
                Press Club through the website contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
