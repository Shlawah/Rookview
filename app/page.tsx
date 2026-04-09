import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { PondEcosystem } from "@/components/pond-ecosystem"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#01020A] text-white">
      <PondEcosystem />
      <div className="relative z-10">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
