import { motion } from "motion/react";
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink, MessageSquare, Bus, Navigation } from "lucide-react";
import { LandingNav, LandingFooter } from "./LandingPage";

const C = { red: "#FF4103", navy: "#001621", green: "#21F1A8", gold: "#FFBE0B", purple: "#3C1A47", g2: "#59C749" };

const SYSTEM_ITEMS = [
  { Icon: Globe,  label: "Platform",      value: "Smart Transport Management System", href: undefined },
  { Icon: Mail,   label: "Support Email", value: "smarttransportserv@gmail.com",      href: "mailto:smarttransportserv@gmail.com" },
  { Icon: Phone,  label: "Phone",         value: "+251 96 694 2369",                  href: "tel:+251966942369" },
];

const DEV_ITEMS = [
  { Icon: Mail,     label: "Email",     value: "alemuchamada@gmail.com",          href: "mailto:alemuchamada@gmail.com" },
  { Icon: Phone,    label: "Phone",     value: "+251 95 604 7594",                href: "tel:+251956047594" },
  { Icon: Github,   label: "GitHub",    value: "github.com/Alemu-chamada",        href: "https://github.com/Alemu-chamada" },
  { Icon: Linkedin, label: "LinkedIn",  value: "Alemu Chamada",                   href: "https://linkedin.com/in/alemu-chamada" },
  { Icon: MapPin,   label: "Education", value: "Computer Science & Eng · ASTU",   href: "https://www.astu.edu.et/" },
];

export function ContactPage() {
  return (
    <div style={{ backgroundColor: "#FFF9FA" }}>
      <LandingNav active="/contact" />

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: C.red }} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ backgroundColor: C.green }} />
        </div>
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: `${C.red}12`, color: C.red }}>Get In Touch</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-5 leading-tight" style={{ color: C.navy }}>
              Contact{" "}
              <span style={{ background: `linear-gradient(135deg, ${C.red}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Us
              </span>
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: "#6b7280" }}>
              Questions about Smart Transport? Want to report an issue or suggest a feature?<br />
              Reach out — we're happy to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Cards — side-by-side with metro connector ─────────── */}
      <section className="py-8 pb-24">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">

          {/* ── DESKTOP ─────────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-start gap-0" style={{ minHeight: 520 }}>

            {/* System card */}
            <motion.div className="flex-shrink-0" style={{ width: 380 }}
              initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65 }}>
              <SystemCard />
            </motion.div>

            {/* Metro connector — fixed width, stretches between the cards */}
            <div className="flex-1 self-stretch relative" style={{ minWidth: 160 }}>
              <RouteConnector />
            </div>

            {/* Developer card */}
            <motion.div className="flex-shrink-0" style={{ width: 380 }}
              initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.15 }}>
              <DeveloperCard />
            </motion.div>
          </div>

          {/* ── TABLET (md) ─────────────────────────────────────────────── */}
          <div className="hidden md:flex lg:hidden items-start gap-6">
            <motion.div className="flex-1" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <SystemCard />
            </motion.div>
            <div className="flex items-center self-stretch pt-20">
              <div className="w-px h-full" style={{ background: `linear-gradient(to bottom, ${C.red}, ${C.purple})`, minHeight: 200 }} />
            </div>
            <motion.div className="flex-1" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
              <DeveloperCard />
            </motion.div>
          </div>

          {/* ── MOBILE ──────────────────────────────────────────────────── */}
          <div className="md:hidden flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <SystemCard />
            </motion.div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.red}40)` }} />
              <Bus className="h-4 w-4 flex-shrink-0" style={{ color: C.red }} />
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${C.red}40, transparent)` }} />
            </div>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <DeveloperCard />
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: `${C.navy}06` }}>
        <div className="w-full max-w-2xl mx-auto px-6 sm:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 text-center"
            style={{ border: "1px solid rgba(0,22,33,0.07)", boxShadow: "0 8px 40px rgba(0,22,33,0.08)" }}>
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${C.red}12` }}>
              <MessageSquare className="h-8 w-8" style={{ color: C.red }} />
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ color: C.navy }}>Send us a message</h2>
            <p className="mb-8 leading-relaxed" style={{ color: "#6b7280" }}>
              For support, feature requests, or general inquiries — email us directly and we'll respond quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:smarttransportserv@gmail.com"
                className="inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: C.red, boxShadow: `0 4px 16px ${C.red}40` }}>
                <Mail className="h-4 w-4" /> Email the System
              </a>
              <a href="mailto:alemuchamada@gmail.com"
                className="inline-flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-colors"
                style={{ border: `2px solid ${C.purple}30`, color: C.purple }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = `${C.purple}08`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                <Mail className="h-4 w-4" /> Email the Developer
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

/* ─── System Card ────────────────────────────────────────────────────────── */
function SystemCard() {
  return (
    <motion.div whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,22,33,0.14)` }}
      className="bg-white rounded-3xl overflow-hidden transition-all duration-300"
      style={{ border: "1px solid rgba(0,22,33,0.08)", boxShadow: "0 4px 24px rgba(0,22,33,0.08)" }}>
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${C.red}, ${C.gold})` }} />
      <div className="p-7">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.red}, #ff6a35)`, boxShadow: `0 4px 16px ${C.red}40` }}>
            <Bus className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: C.red }}>System</p>
            <h2 className="text-lg font-black leading-tight" style={{ color: C.navy }}>
              Smart Transport<br />Management System
            </h2>
          </div>
        </div>
        <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, ${C.red}30, transparent)` }} />
        <div className="space-y-4">
          {SYSTEM_ITEMS.map(({ Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${C.red}12` }}>
                <Icon className="h-3.5 w-3.5" style={{ color: C.red }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#9ca3af" }}>{label}</p>
                {href
                  ? <a href={href} className="text-sm font-semibold break-all hover:underline" style={{ color: C.navy }}>{value}</a>
                  : <p className="text-sm font-semibold" style={{ color: C.navy }}>{value}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${C.g2}18`, color: C.g2, border: `1px solid ${C.g2}30` }}>
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.g2 }} />
          System Online
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Developer Card ─────────────────────────────────────────────────────── */
function DeveloperCard() {
  return (
    <motion.div whileHover={{ y: -4, boxShadow: `0 20px 48px rgba(0,22,33,0.14)` }}
      className="bg-white rounded-3xl overflow-hidden transition-all duration-300"
      style={{ border: "1px solid rgba(0,22,33,0.08)", boxShadow: "0 4px 24px rgba(0,22,33,0.08)" }}>
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${C.purple}, ${C.green})` }} />
      <div className="p-7">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-shrink-0">
            <div className="h-16 w-16 rounded-full flex items-center justify-center text-white font-black text-xl"
              style={{ background: `linear-gradient(135deg, ${C.purple}, #5a2a6a)`, boxShadow: `0 4px 16px ${C.purple}50` }}>
              AC
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#fff", border: `2px solid ${C.g2}` }}>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: C.g2 }} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: C.purple }}>Developer</p>
            <h2 className="text-lg font-black" style={{ color: C.navy }}>Alemu Chamada</h2>
            <p className="text-xs font-medium" style={{ color: "#9ca3af" }}>Full Stack Developer</p>
          </div>
        </div>
        <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, ${C.purple}30, transparent)` }} />
        <div className="space-y-4">
          {DEV_ITEMS.map(({ Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${C.purple}12` }}>
                <Icon className="h-3.5 w-3.5" style={{ color: C.purple }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#9ca3af" }}>{label}</p>
                {href
                  ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="text-sm font-semibold break-all inline-flex items-center gap-1 hover:underline"
                      style={{ color: C.navy }}>
                      {value}
                      {href.startsWith("http") && <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-40" />}
                    </a>
                  : <p className="text-sm font-semibold" style={{ color: C.navy }}>{value}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Route Connector ────────────────────────────────────────────────────── */
// Sits in a flex-1 container between the two cards.
// Uses a 100%×100% SVG with a path that:
//   - Starts at the LEFT edge of the SVG (= right edge of System card)
//   - Goes horizontally to center, turns 90° downward, turns 90° right to RIGHT edge (= left edge of Dev card)
// viewBox height is fixed at 460 to match approximate card height.
// preserveAspectRatio="none" lets it stretch horizontally.
function RouteConnector() {
  // Path in a 200×460 viewBox (height matches card height ~460px)
  // Start: left center  (0, 140)  — mid-height of System card header area
  // Turn down at x=100 (center of connector)
  // End: right at       (200, 320) — mid-height of Developer card header area
  const W = 200;
  const H = 460;
  const START_Y = 140;
  const END_Y = 320;
  const MID_X = 100;
  // Path: horizontal right → vertical down → horizontal right
  // Sharp-right-then-down route with smooth bezier corners
  const PATH = `M 0 ${START_Y} H ${MID_X - 20} C ${MID_X} ${START_Y} ${MID_X} ${START_Y + 30} ${MID_X} ${START_Y + 60} V ${END_Y - 30} C ${MID_X} ${END_Y} ${MID_X + 20} ${END_Y} ${MID_X + 40} ${END_Y} H ${W}`;

  const nodes = [
    { y: START_Y + 80,                         Icon: MapPin,     label: "Depart"   },
    { y: Math.round((START_Y + END_Y) / 2),    Icon: Bus,        label: "En Route" },
    { y: END_Y - 60,                            Icon: Navigation, label: "Arrive"   },
  ];

  return (
    <div className="absolute inset-0" style={{ minHeight: H }}>
      <svg width="100%" height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        fill="none">
        <defs>
          <linearGradient id="rcg" x1="0" y1="0" x2="1" y2="0.7">
            <stop offset="0%"   stopColor={C.red}    stopOpacity="0.95" />
            <stop offset="50%"  stopColor={C.gold}   stopOpacity="0.9"  />
            <stop offset="100%" stopColor={C.purple} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="rflow" x1="0" y1="0" x2="1" y2="0.7">
            <stop offset="0%"   stopColor="#fff"     stopOpacity="0"   />
            <stop offset="40%"  stopColor={C.red}    stopOpacity="1"   />
            <stop offset="55%"  stopColor="#fff"     stopOpacity="1"   />
            <stop offset="100%" stopColor={C.purple} stopOpacity="0"   />
          </linearGradient>
          <filter id="rglow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="rsglow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Glow halo */}
        <path d={PATH} stroke="url(#rcg)" strokeWidth={14} fill="none"
          strokeLinecap="round" strokeLinejoin="round" opacity={0.1} />

        {/* Dashed track */}
        <path d={PATH} stroke="url(#rcg)" strokeWidth={2} fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="10 7" opacity={0.6} filter="url(#rglow)" />

        {/* Solid line */}
        <path d={PATH} stroke="url(#rcg)" strokeWidth={2.5} fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          opacity={0.9} filter="url(#rglow)" />

        {/* Animated particle */}
        <motion.path d={PATH} stroke="url(#rflow)" strokeWidth={5} fill="none"
          strokeLinecap="round"
          initial={{ pathOffset: 0 }}
          animate={{ pathOffset: [0, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          filter="url(#rsglow)" opacity={0.95} />

        {/* Station nodes along the path */}
        {nodes.map(({ y }, i) => (
          <g key={i}>
            <motion.circle cx={MID_X} cy={y} r={10} fill="none"
              stroke={C.red} strokeWidth={1.2}
              animate={{ r: [7, 18], opacity: [0.65, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.65 }} />
            <circle cx={MID_X} cy={y} r={7} fill="#FFF9FA"
              stroke="url(#rcg)" strokeWidth={1.5} filter="url(#rglow)" />
            <circle cx={MID_X} cy={y} r={3} fill="url(#rcg)" opacity={0.95} />
          </g>
        ))}

        {/* Origin dot — left edge (System card right) */}
        <circle cx={0} cy={START_Y} r={7} fill={C.red} filter="url(#rglow)" />
        <motion.circle cx={0} cy={START_Y} r={7} fill="none" stroke={C.red} strokeWidth={1.5}
          animate={{ r: [7, 18], opacity: [0.85, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }} />

        {/* Destination arrowhead + dot — right edge (Developer card left) */}
        <polygon points={`${W - 12},${END_Y - 7} ${W},${END_Y} ${W - 12},${END_Y + 7}`}
          fill={C.purple} opacity={0.95} />
        <circle cx={W} cy={END_Y} r={7} fill={C.purple} filter="url(#rglow)" />
        <motion.circle cx={W} cy={END_Y} r={7} fill="none" stroke={C.purple} strokeWidth={1.5}
          animate={{ r: [7, 18], opacity: [0.85, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }} />
      </svg>

      {/* Station labels rendered in HTML (inside the connector) */}
      {nodes.map(({ y, Icon, label }, i) => {
        // Convert viewBox y to % of container height for positioning
        const topPct = (y / H) * 100;
        return (
          <div key={i} style={{
            position: "absolute",
            top: `${topPct}%`,
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            pointerEvents: "none",
          }}>
            <div style={{
              marginTop: 28,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, display: "flex",
                alignItems: "center", justifyContent: "center",
                backgroundColor: `${C.red}15`, border: `1px solid ${C.red}28` }}>
                <Icon style={{ width: 10, height: 10, color: C.red }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(0,22,33,0.35)",
                letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Legacy stubs */
function ConnectorSVG() { return null; }
function VerticalConnector() { return null; }
