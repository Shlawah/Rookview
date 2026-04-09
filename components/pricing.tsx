import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    description: "For creators just getting started",
    price: "0",
    fee: "10%",
    features: [
      "Unlimited members",
      "Basic analytics",
      "Email support",
      "Custom landing page",
      "Stripe integration"
    ]
  },
  {
    name: "Pro",
    description: "For serious creators building a business",
    price: "29",
    fee: "5%",
    featured: true,
    features: [
      "Everything in Starter",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "API access",
      "Team members",
      "Webhooks"
    ]
  },
  {
    name: "Business",
    description: "For teams and enterprises",
    price: "99",
    fee: "2%",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
      "SSO / SAML",
      "White-label options"
    ]
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-white/5 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-white/30">
            Pricing
          </span>
          <h2 className="mx-auto mt-4 max-w-lg font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            <span className="text-balance">Simple pricing, no surprises</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/40">
            Start free, upgrade when you need more. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col rounded-lg border p-8 ${
                plan.featured 
                  ? 'border-white/40 bg-white/[0.03]' 
                  : 'border-white/10 bg-transparent'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-8">
                  <span className="rounded-full border border-white bg-white px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#01020A]">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-serif text-2xl font-medium text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/40">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-serif text-5xl font-medium text-white">${plan.price}</span>
                <span className="text-white/40">/month</span>
              </div>

              <div className="mb-6 rounded border border-white/10 bg-white/[0.02] px-4 py-3">
                <span className="font-mono text-xs text-white/40">+ </span>
                <span className="font-mono text-sm font-medium text-white">{plan.fee}</span>
                <span className="font-mono text-xs text-white/40"> transaction fee</span>
              </div>

              <ul className="mb-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="h-4 w-4 text-white/40" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className={`mt-auto font-mono text-xs uppercase tracking-wider ${
                  plan.featured
                    ? 'border border-white bg-white text-[#01020A] hover:bg-white/90'
                    : 'border border-white/20 bg-transparent text-white hover:bg-white/5'
                }`}
              >
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
