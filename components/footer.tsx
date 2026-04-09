import Link from "next/link"

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Guides", href: "#" },
    { label: "Blog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-white/20">
                <span className="font-mono text-sm font-semibold text-white">R</span>
              </div>
              <span className="font-mono text-sm font-medium tracking-tight text-white">rookview</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              The membership platform where creators build sustainable income.
            </p>
            <p className="mt-6 font-mono text-xs text-white/20">
              © 2026 Rookview, Inc.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/30">Product</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/30">Resources</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/30">Company</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-white/30">Legal</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-white/40 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
