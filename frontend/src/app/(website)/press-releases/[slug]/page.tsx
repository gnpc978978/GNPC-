import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LegacyPressReleasePage({
  params,
}: Props) {
  const { slug } = await params;

  redirect(`/press-conference/${slug}`);
}
