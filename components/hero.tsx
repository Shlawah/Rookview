import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
      {/* Subtle water surface reflection effect */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 800px 200px at 50% 80%, rgba(255,255,255,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 600px 150px at 30% 60%, rgba(255,255,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 400px 100px at 70% 40%, rgba(255,255,255,0.03) 0%, transparent 50%)
          `
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white/60" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-white/50">
            Now in public beta
          </span>
        </div>

        <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="text-balance text-white">Like GitHub but for</span>
          <br />
          <span className="italic text-white">making money</span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/40 sm:text-xl">
          The membership platform where creators build sustainable income. 
          Ship projects, grow your audience, and monetize your expertise.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button 
            id="start-building-btn"
            size="lg" 
            className="group h-12 gap-2 border border-white bg-white px-8 font-mono text-xs uppercase tracking-wider text-[#01020A] hover:bg-white/90"
          >
            Start building
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 border-white/20 bg-transparent px-8 font-mono text-xs uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
          >
            See how it works
          </Button>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-12 text-white/40">
          <div className="text-center">
            <div className="font-serif text-4xl font-medium text-white sm:text-5xl">12k+</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider">Creators</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center">
            <div className="font-serif text-4xl font-medium text-white sm:text-5xl">$4.2M</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider">Paid out</div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center">
            <div className="font-serif text-4xl font-medium text-white sm:text-5xl">98%</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider">Uptime</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">Scroll</span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </section>
  )
}
