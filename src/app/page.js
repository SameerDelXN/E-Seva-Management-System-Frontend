import Image from "next/image";

import HeroSection from "@/components/landing/HeroSection";
import Services from "@/components/landing/Services";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import PricingSection from "@/components/landing/pricing";
import FAQSection from "@/components/landing/FAQsection";




export default function Home() {
  return (
  <div>
    <HeroSection/>
    <Services/>
    <WhyChooseUs/>
    <HowItWorks/>
    <PricingSection/>
    <Testimonials/>
    <CTA/>
    <FAQSection/>
  </div>
  );
}
