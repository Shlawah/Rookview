import { Code2, Users, DollarSign, Lock, GitBranch, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Code2,
    label: "01",
    title: "Ship like a developer",
    description: "Version control for your content. Track changes, roll back updates, and maintain a clean history of everything you create."
  },
  {
    icon: Users,
    label: "02",
    title: "Build your community",
    description: "Tiered memberships, discussion boards, and private channels. Create a space where your most dedicated fans can connect."
  },
  {
    icon: DollarSign,
    label: "03",
    title: "Get paid instantly",
    description: "No waiting for payouts. Funds hit your account as they come in, with transparent fees and no hidden costs."
  },
  {
    icon: Lock,
    label: "04",
    title: "Content gating",
    description: "Control who sees what with granular access controls. Free previews, member-only content, and exclusive releases."
  },
  {
    icon: GitBranch,
    label: "05",
    title: "Collaborative workflows",
    description: "Bring in co-creators, editors, and team members. Manage permissions and share revenue automatically."
  },
  {
    icon: BarChart3,
    label: "06",
    title: "Deep analytics",
    description: "Understand your audience with detailed insights. Track engagement, revenue trends, and member behavior."
  }
]

export function Features() {
  return (
    <section id="features" className="relative border-t border-white/5 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-white/30">
            Features
          </span>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            Everything you need to build a sustainable business
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div 
              key={feature.label}
              className="group flex flex-col bg-[#01020A] p-8 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-start justify-between">
                <feature.icon className="h-5 w-5 text-white/30 transition-colors group-hover:text-white/60" />
                <span className="font-mono text-xs text-white/20">{feature.label}</span>
              </div>
              <h3 className="mt-6 font-serif text-xl font-medium text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/40">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
