import ContactView from "@/components/admin/contact-messages/ContactView";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactMessageDetailPage({
  params,
}: Props) {

  const { id } = await params;

  return (
    <ContactView
      id={id}
    />
  );
}