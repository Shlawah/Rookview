"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#01020A]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xAU6uOar60p61cSeofQh5zrRhUIrBM.png" 
            alt="Rookview logo" 
            className="h-8 w-8 object-contain"
          />
          <span className="font-mono text-lg font-semibold tracking-tight text-white">Rookview</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link 
            href="#features" 
            className="font-mono text-xs uppercase tracking-wider text-white/40 transition-colors hover:text-white"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="font-mono text-xs uppercase tracking-wider text-white/40 transition-colors hover:text-white"
          >
            How it works
          </Link>
          <Link 
            href="#pricing" 
            className="font-mono text-xs uppercase tracking-wider text-white/40 transition-colors hover:text-white"
          >
            Pricing
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Button 
            variant="ghost" 
            className="font-mono text-xs uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-white"
          >
            Sign in
          </Button>
          <Button className="border border-white bg-white font-mono text-xs uppercase tracking-wider text-[#01020A] hover:bg-white/90">
            Get started
          </Button>
        </div>

        <button 
          className="text-white md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-white/5 bg-[#01020A] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link 
              href="#features" 
              className="font-mono text-xs uppercase tracking-wider text-white/40"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="font-mono text-xs uppercase tracking-wider text-white/40"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </Link>
            <Link 
              href="#pricing" 
              className="font-mono text-xs uppercase tracking-wider text-white/40"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
              <Button 
                variant="ghost" 
                className="font-mono text-xs uppercase tracking-wider text-white/60 justify-start hover:bg-white/5"
              >
                Sign in
              </Button>
              <Button className="border border-white bg-white font-mono text-xs uppercase tracking-wider text-[#01020A]">
                Get started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
