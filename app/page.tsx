"use client";
import Image from "next/image";

export default function Home() {
  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        .nav-link { font-size: 13px; color: rgba(255,255,255,0.4); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .btn-white { background: #fff; color: #000; border: none; padding: 14px 32px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; cursor: pointer; border-radius: 2px; transition: opacity 0.2s; }
        .btn-white:hover { opacity: 0.85; }
        .btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 14px 32px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; cursor: pointer; border-radius: 2px; transition: border-color 0.2s; }
        .btn-outline:hover { border-color: rgba(255,255,255,0.6); }
      `}</style>

      {/* Wave background */}
      <svg style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none", zIndex: 1 }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {[...Array(20)].map((_, i) => (
          <path key={i} d={`M-100,${290 + i * 20} C200,${190 + i * 20} 400,${390 + i * 20} 700,${290 + i * 20} S1100,${190 + i * 20} 1540,${290 + i * 20}`} stroke="white" strokeWidth="0.8" fill="none" />
        ))}
      </svg>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 3rem", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Image src="/LOGO.png" alt="Rookview" width={36} height={36} style={{ objectFit: "contain" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, letterSpacing: "0.06em" }}>ROOKVIEW</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#features" className="nav-link">Automations</a>
          <a href="#features" className="nav-link">Stocks</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="YOUR_STRIPE_LINK_HERE">
            <button className="btn-white">JOIN NOW</button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 5, padding: "6rem 3rem 5rem", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          Automations · Stock Research · AI Tools
        </p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(40px, 6vw, 82px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
          Research that<br />
          <span style={{ color: "rgba(255,255,255,0.25)" }}>actually</span> pays off
        </h1>
        <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto 3rem" }}>
          Premium automation breakdowns, stock research, and AI tools — built for creators and investors who move fast.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="YOUR_STRIPE_LINK_HERE">
            <button className="btn-white">START FOR $15/MO</button>
          </a>
          <a href="#features">
            <button className="btn-outline">SEE WHAT&apos;S INSIDE</button>
          </a>
        </div>
      </section>

      <div style={{ width: "calc(100% - 6rem)", margin: "0 3rem", height: "1px", background: "rgba(255,255,255,0.06)", position: "relative", zIndex: 5 }} />

      {/* Features */}
      <section id="features" style={{ position: "relative", zIndex: 5, padding: "4rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px" }}>
          {[
            { num: "01 / AUTOMATE", title: "Automation Breakdowns", body: "Real workflows that save time and generate income. Built for Make, Zapier, n8n and beyond." },
            { num: "02 / RESEARCH", title: "Stock Research", body: "Fundamentals-first analysis. No noise — clean data, clear reasoning, and actionable insight." },
            { num: "03 / BUILD", title: "AI Tools", body: "Members-only tools — stock analyzers, automation generators, and more." },
          ].map((f) => (
            <div key={f.num} style={{ background: "#000", padding: "2.5rem 2rem" }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", marginBottom: "1.25rem" }}>{f.num}</p>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.75 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ position: "relative", zIndex: 5, padding: "4rem 3rem 6rem", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "0.75rem" }}>Simple pricing</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#fff", marginBottom: "2rem" }}>
          One membership. Full access.
        </h2>
        <div style={{ maxWidth: "420px", margin: "0 auto", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "2.5rem", background: "rgba(255,255,255,0.02)" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "1rem" }}>Rookview Membership</p>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "64px", fontWeight: 800, lineHeight: 1 }}>$15</div>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", marginTop: "0.25rem", marginBottom: "2rem" }}>per month · cancel anytime</p>
          <ul style={{ listStyle: "none", marginBottom: "2rem", textAlign: "left" }}>
            {["Full automation library", "Weekly stock research drops", "Members-only AI tools", "Private Discord community", "Early access to new features"].map((item) => (
              <li key={item} style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#fff", opacity: 0.4, flexShrink: 0, display: "inline-block" }} />
                {item}
              </li>
            ))}
          </ul>
          <a href="YOUR_STRIPE_LINK_HERE" style={{ display: "block" }}>
            <button className="btn-white" style={{ width: "100%", padding: "16px" }}>GET STARTED TODAY</button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 5, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>ROOKVIEW</span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.04em" }}>© 2025 ROOKVIEW · ALL RIGHTS RESERVED</span>
      </footer>

    </main>
  );
}
