const testimonials = [
  {
    quote: "Rookview changed how I think about building an audience. The tools feel like they were made by creators, for creators.",
    author: "Sarah Chen",
    role: "Design educator",
    metric: "$8.2k/mo"
  },
  {
    quote: "I was on three different platforms before. Now everything lives in one place and my revenue has doubled.",
    author: "Marcus Williams",
    role: "Developer & writer",
    metric: "$12.4k/mo"
  },
  {
    quote: "The version control for content is genius. I can experiment without worrying about breaking what already works.",
    author: "Elena Rodriguez",
    role: "Course creator",
    metric: "$23.8k/mo"
  }
]

export function Testimonials() {
  return (
    <section className="relative border-t border-white/5 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-white/30">
            Testimonials
          </span>
          <h2 className="mx-auto mt-4 max-w-lg font-serif text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            <span className="text-balance">Trusted by 12,000+ creators</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.author}
              className="flex flex-col justify-between rounded-lg border border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-white/20"
            >
              <blockquote className="font-serif text-lg leading-relaxed text-white/80">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              
              <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
                <div>
                  <div className="font-medium text-white">{testimonial.author}</div>
                  <div className="font-mono text-xs text-white/40">{testimonial.role}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold text-white">{testimonial.metric}</div>
                  <div className="font-mono text-xs text-white/30">MRR</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
