import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Methodology from "@/components/Methodology";
import Platform from "@/components/Platform";
import WhyTrust from "@/components/WhyTrust";
import SuccessStories from "@/components/SuccessStories";
import MeetOurTeam from "@/components/MeetOurTeam";
import FAQ from "@/components/FAQ";
import CTAContact from "@/components/CTAContact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      <Methodology />
      <Platform />
      {/* <WhyTrust /> */}
      <SuccessStories />
      <MeetOurTeam />
      <FAQ />
      <CTAContact />
      <Footer />
    </main>
  );
}