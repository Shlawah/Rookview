"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function Hero() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showError = isTouched && email.length > 0 && !isValidEmail

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail) {
      setIsSubmitted(true)
      setEmail("")
    }
  }

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
          <span className="text-balance text-white">your idea —</span>
          <br />
          <span className="italic text-white">monetized for you</span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/40 sm:text-xl">
          The membership platform where creators build sustainable income. 
          Ship projects, grow your audience, and monetize your expertise.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md">
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setIsTouched(true)}
              disabled={isSubmitted}
              className={`h-12 flex-1 border bg-transparent px-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none ${
                showError 
                  ? "border-red-500" 
                  : "border-white/20 focus:border-white/40"
              } rounded-l-md border-r-0`}
            />
            <button
              type="submit"
              disabled={!isValidEmail || isSubmitted}
              className={`h-12 border px-6 font-mono text-xs uppercase tracking-wider transition-all ${
                isValidEmail && !isSubmitted
                  ? "border-white bg-white text-[#01020A] hover:bg-white/90"
                  : "cursor-not-allowed border-white/20 bg-white/10 text-white/30"
              } rounded-r-md border-l-0`}
            >
              Access
            </button>
          </div>
          
          <div className="mt-4 space-y-1 font-mono text-xs text-white/40">
            {isSubmitted ? (
              <p className="text-white/60">You&apos;re on the list. We&apos;ll be in touch.</p>
            ) : (
              <>
                <p>No card required. Unsubscribe anytime.</p>
                <p>
                  Already a member?{" "}
                  <a href="#" className="text-white/60 hover:text-white">Sign in</a>
                  {" · "}
                  <a href="#" className="text-white/60 hover:text-white">Go Premium</a>
                </p>
              </>
            )}
          </div>
        </form>

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
