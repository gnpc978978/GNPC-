import Button from "@/components/ui/Button";

export default function ContactCTA() {
  return (
    <section className="bg-[#0b1f3a] py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to Connect With Us?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">
          Whether you're a journalist, media organization, or interested in
          becoming a member, we'd love to hear from you.
        </p>

        <div className="mt-7 flex justify-center">
          <Button href="/" variant="inverse" size="md">Back to Home</Button>
        </div>
      </div>
    </section>
  );
}
