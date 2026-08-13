import PageHero from "@/components/ui/PageHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import ContactCTA from "@/components/contact/ContactCTA";

export default function ContactPage() {
  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Contact Us"
        title="Get in Touch with Greater Noida Press Club"
        description="Reach out to us for media enquiries, press conferences, membership information and other official communication."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      <ContactInfo />
      <ContactForm />
      <ContactMap />
      <ContactCTA />
    </main>
  );
}
