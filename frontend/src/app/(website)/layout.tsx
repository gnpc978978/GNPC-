import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="pt-16 sm:pt-[76px]">
        <TopBar />
        <main>{children}</main>
      </div>

      <Footer />
    </>
  );
}
