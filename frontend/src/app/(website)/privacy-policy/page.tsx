import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Information about how Greater Noida Press Club handles information submitted through this website."
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Privacy Policy",
          },
        ]}
      />

      <Container>
        <article className="mx-auto max-w-4xl py-14 sm:py-20">
          <div className="space-y-8 text-base leading-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Overview
              </h2>

              <p className="mt-3">
                Greater Noida Press Club respects your privacy. This page explains, at a general level, how information submitted through this website may be used to respond to enquiries, membership requests, event registrations, and other communications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Information you provide
              </h2>

              <p className="mt-3">
                Information such as your name, contact details, message, or documents may be collected when you voluntarily submit a form or contact the organisation through the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                How information is used
              </h2>

              <p className="mt-3">
                Submitted information may be used to process requests, communicate with you, maintain organisational records, and provide services or information requested through the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Third-party services
              </h2>

              <p className="mt-3">
                The website may use infrastructure or service providers for hosting, media storage, analytics, communication, or other technical functions. Such services may process information only as necessary to provide their functions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Contact
              </h2>

              <p className="mt-3">
                If you have a privacy-related question about information submitted through this website, please use the contact page to reach Greater Noida Press Club.
              </p>
            </section>
          </div>
        </article>
      </Container>
    </main>
  );
}
