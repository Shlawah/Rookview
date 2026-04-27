import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    label: "forever",
    buttonText: "JOIN FREE",
    buttonStyle: "outline" as const,
    features: [
      "Weekly research digest",
      "3 post unlocks (any category)",
      "Post previews across full library",
      "Community feed access"
    ]
  },
  {
    name: "Starter",
    price: "$24.99",
    label: "per month",
    buttonText: "GET STARTED",
    buttonStyle: "outline" as const,
    features: [
      "Full access to one niche of your choice",
      "Automations OR Stocks OR AI Tools",
      "Downloadable templates & files",
      "Weekly drops in your chosen niche"
    ],
    note: "Does not include: other niches, Discord, implementation"
  },
  {
    name: "Pro",
    price: "$49",
    label: "per month · cancel anytime",
    buttonText: "GET STARTED",
    buttonStyle: "filled" as const,
    badge: "MOST POPULAR",
    featured: true,
    features: [
      "Full access to ALL niches",
      "Every post, tool, and drop",
      "Downloadable files and templates",
      "Private Discord community",
      "AI tools (stock analyzer, automation generator)",
      "Early access to new content"
    ]
  },
  {
    name: "Implementation",
    price: "$299",
    label: "per month · limited spots",
    buttonText: "APPLY NOW",
    buttonStyle: "outline" as const,
    features: [
      "Everything in Pro",
      "Monthly 1-on-1 session with Rookview team",
      "Live screen share implementation",
      "We set up any automation for you",
      "30 day results monitoring",
      "Dedicated support channel"
    ],
    note: "Limited to 10 members at a time"
  },
  {
    name: "Lifetime Pro",
    price: "$499",
    label: "one time payment",
    buttonText: "CLAIM YOUR SPOT",
    buttonStyle: "outline" as const,
    features: [
      "Lifetime access to Pro — all niches forever",
      "Every future drop included forever",
      "Price locked in forever",
      "Founding member status"
    ],
    note: "First 50 members only"
  },
  {
    name: "Lifetime All-In",
    price: "$1,499",
    label: "one time payment",
    buttonText: "CLAIM YOUR SPOT",
    buttonStyle: "filled" as const,
    badge: "BEST VALUE",
    features: [
      "Everything in Lifetime Pro",
      "Unlimited 1-on-1 implementation sessions forever",
      "Priority support forever",
      "Founding member badge",
      "Every future feature included"
    ],
    note: "First 25 members only — strictly limited"
  }
]

const faqs = [
  {
    question: "What's the difference between Starter and Pro?",
    answer: "Starter gives you full access to one niche of your choice — automations, stocks, or AI tools. Pro unlocks all three plus Discord and every AI tool we build."
  },
  {
    question: "What does Implementation actually include?",
    answer: "Every month you get a 1-on-1 session where we screen share and walk you through setting up any automation live. We then monitor the results for 30 days. Limited to 10 members."
  },
  {
    question: "Is Lifetime really lifetime?",
    answer: "Yes. One payment, access forever. All future drops and features included. Price locked in no matter what we charge new members later."
  },
  {
    question: "Can I switch tiers?",
    answer: "Yes. Upgrade or downgrade anytime from your account settings. Cancellations take effect at the end of your billing period."
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-white/5 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-white/30">
            PRICING
          </span>
          <h2 className="mx-auto mt-4 max-w-lg font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            <span className="text-balance">Simple pricing. Real returns.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/40">
            Start free. Upgrade when you see the value. Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col rounded-lg border p-5 ${
                plan.featured 
                  ? 'border-white/40 bg-white/[0.03] shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                  : 'border-white/10 bg-transparent'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${
                    plan.featured 
                      ? 'border border-white bg-white text-[#01020A]'
                      : 'border border-white/30 bg-white/10 text-white'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-4 mt-2">
                <h3 className="font-serif text-lg font-medium text-white">{plan.name}</h3>
              </div>

              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-serif text-3xl font-medium text-white">{plan.price}</span>
              </div>
              <span className="mb-4 font-mono text-[10px] uppercase tracking-wider text-white/40">
                {plan.label}
              </span>

              <ul className="mb-6 flex flex-1 flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-white/70">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-white/40" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.note && (
                <p className="mb-4 font-mono text-[10px] text-white/30">
                  {plan.note}
                </p>
              )}

              <Button 
                className={`mt-auto w-full font-mono text-[10px] uppercase tracking-wider ${
                  plan.buttonStyle === 'filled'
                    ? 'border border-white bg-white text-[#01020A] hover:bg-white/90'
                    : 'border border-white/20 bg-transparent text-white hover:bg-white/5'
                }`}
                size="sm"
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-24 max-w-3xl">
          <h3 className="mb-8 text-center font-serif text-2xl font-medium text-white">
            Frequently asked questions
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-white/10 p-5">
                <h4 className="mb-2 font-medium text-white">{faq.question}</h4>
                <p className="text-sm text-white/50">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom guarantees */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-xs text-white/30">
            All plans include a 7 day money back guarantee.
          </p>
          <div className="flex items-center gap-2 text-white/20">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
            </svg>
            <span className="font-mono text-xs">Payments secured by Stripe</span>
          </div>
        </div>
      </div>
    </section>
  )
}
