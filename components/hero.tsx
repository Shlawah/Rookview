"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
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

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            className="group h-12 gap-2 border border-white bg-white px-8 font-mono text-xs uppercase tracking-wider text-[#01020A] hover:bg-white/90"
            onClick={() => window.open('https://buy.stripe.com/14A6oH6F08yb7bD6tye7m01', '_blank')}
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">Scroll</span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </section>
  )
}