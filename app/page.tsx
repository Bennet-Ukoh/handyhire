import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Categories from "@/components/landing/Categories";
import TrustSection from "@/components/landing/TrustSection";
import Testimonials from "@/components/landing/Testimonials";
import WorkerCTA from "@/components/landing/WorkerCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <Categories />
        <TrustSection />
        <Testimonials />
        <WorkerCTA />
      </main>
      <Footer />
    </>
  );
}
