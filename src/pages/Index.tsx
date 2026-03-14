import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import ChaosCalculator from "@/components/landing/ChaosCalculator";
import BeliefBreaking from "@/components/landing/BeliefBreaking";
import SystemIntro from "@/components/landing/SystemIntro";
import InteractiveDemo from "@/components/landing/InteractiveDemo";
import HeroFeature from "@/components/landing/HeroFeature";
import MultiBranch from "@/components/landing/MultiBranch";
import BranchNetworkMap from "@/components/landing/BranchNetworkMap";
import Authority from "@/components/landing/Authority";
import Timeline from "@/components/landing/Timeline";
import ValueStack from "@/components/landing/ValueStack";
import PrimaryCTA from "@/components/landing/PrimaryCTA";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import ScrollProgress from "@/components/landing/ScrollProgress";
import StickyCTA from "@/components/landing/StickyCTA";
import ImplementationOffers from "@/components/landing/ImplementationOffers";
import PatientDropOff from "@/components/landing/PatientDropOff";
import BookingCalendar from "@/components/landing/BookingCalendar";

const scrollToBooking = () => {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
};

const Index = () => (
  <>
    <ScrollProgress />
    <Navbar onBookClick={scrollToBooking} />
    <main>
      <HeroSection onBookClick={scrollToBooking} />
      <ProblemSection />
      <ChaosCalculator onBookClick={scrollToBooking} />
      <PatientDropOff />
      <BeliefBreaking />
      <SystemIntro />
      <InteractiveDemo onBookClick={scrollToBooking} />
      <HeroFeature />
      <BranchNetworkMap />
      <MultiBranch />
      <Authority />
      <Timeline />
      <ImplementationOffers />
      <ValueStack onBookClick={scrollToBooking} />
      <PrimaryCTA onBookClick={scrollToBooking} />
      <BookingCalendar />
      <FAQ />
      <Footer />
    </main>
    <StickyCTA onBookClick={scrollToBooking} />
  </>
);

export default Index;
