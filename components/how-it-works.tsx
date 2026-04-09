const steps = [
  {
    number: "01",
    title: "Create your space",
    description: "Set up your profile, customize your landing page, and define your membership tiers. Takes less than 5 minutes."
  },
  {
    number: "02",
    title: "Add your content",
    description: "Upload videos, write posts, share files, or go live. Everything syncs seamlessly and stays organized."
  },
  {
    number: "03",
    title: "Launch & grow",
    description: "Share your page, invite your audience, and watch your community grow. We handle billing, access, and delivery."
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-t border-white/5 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-white/30">
            How it works
          </span>
          <h2 className="mx-auto mt-4 max-w-lg font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            <span className="text-balance">From zero to revenue in three steps</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-8 hidden h-[calc(100%-64px)] w-px bg-white/10 lg:left-1/2 lg:block lg:-translate-x-1/2" />

          <div className="flex flex-col gap-12 lg:gap-0">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`relative flex flex-col gap-6 lg:flex-row lg:items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'}`}>
                  <div className={`inline-flex flex-col ${index % 2 === 0 ? 'lg:items-end' : 'lg:items-start'}`}>
                    <span className="font-mono text-xs text-white/20">{step.number}</span>
                    <h3 className="mt-2 font-serif text-2xl font-medium text-white sm:text-3xl">{step.title}</h3>
                    <p className="mt-3 max-w-md text-white/40">{step.description}</p>
                  </div>
                </div>

                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#01020A]">
                  <span className="font-mono text-lg font-semibold text-white">{step.number}</span>
                </div>

                <div className="hidden flex-1 lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
