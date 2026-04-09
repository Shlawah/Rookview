import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative border-t border-white/5 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          <span className="text-balance">Ready to turn your expertise into income?</span>
        </h2>
        
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/40">
          Join 12,000+ creators who are building sustainable businesses on Rookview. 
          No credit card required to get started.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button 
            size="lg" 
            className="group h-12 gap-2 border border-white bg-white px-8 font-mono text-xs uppercase tracking-wider text-[#01020A] hover:bg-white/90"
          >
            Create your account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 border-white/20 bg-transparent px-8 font-mono text-xs uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
          >
            Talk to sales
          </Button>
        </div>

        <p className="mt-6 font-mono text-xs text-white/30">
          Free forever • No credit card • Cancel anytime
        </p>
      </div>
    </section>
  )
}
