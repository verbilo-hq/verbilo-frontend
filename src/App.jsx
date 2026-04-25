import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Stethoscope, GraduationCap, Users, Megaphone,
  Settings, LogOut, Bell, Search, ArrowRight,
  User, Check, Star, Heart, Play,
  ShieldCheck, TrendingUp, Clock, FolderOpen, Download,
  Mail, Eye, Pencil, Plus, Flame,
  Award, BookOpen, Video, Building2,
  Camera, Palette, Handshake, Target, CrosshairIcon,
  ChevronRight, AlertTriangle, FileText, Monitor, Wifi,
  CircleDot, Sparkles, Zap, Send, ClipboardList,
  UserPlus, AtSign, Lock, ExternalLink, Hash,
  Briefcase, CalendarDays, Gift, CreditCard, Brain, Umbrella, Bike,
  HelpCircle, CloudDownload, BookMarked, CheckCircle, Lightbulb,
  Upload, Trash2, MoreVertical, Filter, ChevronDown, XCircle,
  CheckSquare, Clock3, Archive, RefreshCw, Cloud, FilePlus,
  UserCheck, ShieldAlert, BarChart3, Layers,
} from "lucide-react";

/* ─── Design Tokens ─── */
const T = {
  primary: "#006974",
  primaryDim: "#005c66",
  onPrimary: "#ebfcff",
  primaryContainer: "#96f1ff",
  surface: "#f7fafa",
  surfaceLow: "#eff5f5",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#e2e9ea",
  surfaceHighest: "#dbe4e5",
  surfaceContainer: "#e9efef",
  onSurface: "#2b3435",
  onSurfaceVariant: "#586161",
  outlineVariant: "#abb4b4",
  outline: "#737c7d",
  secondary: "#006978",
  secondaryContainer: "#a5eeff",
  tertiaryContainer: "#d4f3fd",
  onTertiaryContainer: "#405d65",
  error: "#a83836",
  errorContainer: "#fa746f",
};

const gradient = `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDim} 100%)`;
const shadow = "0px 12px 32px rgba(43,52,53,0.06)";

/* ─── Icon Component (Lucide React) ─── */
const iconMap = {
  dashboard: LayoutDashboard, clinical: Stethoscope, training: GraduationCap,
  staff: Users, marketing: Megaphone, settings: Settings, logout: LogOut,
  bell: Bell, search: Search, arrow: ArrowRight, person: User,
  check: Check, star: Star, heart: Heart, play: Play,
  shield: ShieldCheck, chart: TrendingUp, clock: Clock, folder: FolderOpen,
  download: Download, mail: Mail, eye: Eye, edit: Pencil, plus: Plus,
  fire: Flame, tooth: Sparkles, award: Award, book: BookOpen,
  video: Video, building: Building2, camera: Camera, palette: Palette,
  handshake: Handshake, target: Target, send: Send, clipboard: ClipboardList,
  userplus: UserPlus, at: AtSign, lock: Lock, external: ExternalLink,
  alert: AlertTriangle, file: FileText, monitor: Monitor, wifi: Wifi,
  dot: CircleDot, zap: Zap, hash: Hash,
  briefcase: Briefcase, calendar: CalendarDays, gift: Gift,
  creditcard: CreditCard, brain: Brain, umbrella: Umbrella, bike: Bike,
  help: HelpCircle, clouddownload: CloudDownload, bookmark: BookMarked,
  checkcircle: CheckCircle, lightbulb: Lightbulb,
  upload: Upload, trash: Trash2, more: MoreVertical, filter: Filter,
  chevrondown: ChevronDown, xcircle: XCircle, checksquare: CheckSquare,
  clock3: Clock3, archive: Archive, refresh: RefreshCw, cloud: Cloud,
  fileplus: FilePlus, usercheck: UserCheck, shieldalert: ShieldAlert,
  barchart: BarChart3, layers: Layers,
};

const I = ({ name, size = 18, strokeWidth = 1.75, color }) => {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return <CircleDot size={size} strokeWidth={strokeWidth} />;
  return <LucideIcon size={size} strokeWidth={strokeWidth} style={color ? { color } : undefined} />;
};

/* ─── Shared Components ─── */
const Pill = ({ children, bg = T.tertiaryContainer, color = T.onTertiaryContainer, small }) => (
  <span style={{
    background: bg, color, padding: small ? "2px 8px" : "4px 12px",
    borderRadius: 9999, fontSize: small ? 10 : 11, fontWeight: 700,
    letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
  }}>{children}</span>
);

const Card = ({ children, style, onClick, hover = true }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.surfaceLowest, borderRadius: 12, boxShadow: shadow,
        transition: "all 0.25s ease",
        transform: hovered && hover ? "translateY(-2px)" : "none",
        cursor: onClick ? "pointer" : "default", ...style,
      }}
    >{children}</div>
  );
};

const BtnPrimary = ({ children, onClick, style }) => (
  <button onClick={onClick} style={{
    background: gradient, color: T.onPrimary, border: "none", borderRadius: 9999,
    padding: "14px 28px", fontFamily: "Manrope, sans-serif", fontWeight: 700,
    fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center",
    gap: 8, letterSpacing: "0.02em", transition: "filter 0.2s",
    ...style,
  }}
    onMouseEnter={e => e.target.style.filter = "brightness(1.08)"}
    onMouseLeave={e => e.target.style.filter = "none"}
  >{children}</button>
);

const BtnSecondary = ({ children, onClick, style }) => (
  <button onClick={onClick} style={{
    background: T.surfaceHighest, color: T.onSurface, border: "none", borderRadius: 9999,
    padding: "12px 24px", fontFamily: "Manrope, sans-serif", fontWeight: 700,
    fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center",
    gap: 8, transition: "all 0.2s", ...style,
  }}>{children}</button>
);

const BtnOutline = ({ children, onClick, style }) => (
  <button onClick={onClick} style={{
    background: "transparent", color: T.primary, border: `2px solid ${T.primary}`,
    borderRadius: 9999, padding: "12px 24px", fontFamily: "Manrope, sans-serif",
    fontWeight: 700, fontSize: 14, cursor: "pointer", display: "inline-flex",
    alignItems: "center", gap: 8, transition: "all 0.2s", ...style,
  }}>{children}</button>
);

const Input = ({ label, type = "text", placeholder, icon }) => (
  <div style={{ marginBottom: 20 }}>
    {label && <label style={{
      display: "block", fontSize: 11, fontWeight: 700, color: T.onSurfaceVariant,
      letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2,
    }}>{label}</label>}
    <div style={{ position: "relative" }}>
      <input type={type} placeholder={placeholder} style={{
        width: "100%", padding: "14px 16px", paddingRight: icon ? 44 : 16,
        background: T.surfaceLowest, border: `1px solid ${T.outlineVariant}33`,
        borderRadius: 12, outline: "none", fontSize: 14, color: T.onSurface,
        fontFamily: "Inter, sans-serif", transition: "border 0.2s",
        boxSizing: "border-box",
      }}
        onFocus={e => e.target.style.borderColor = T.primary}
        onBlur={e => e.target.style.borderColor = `${T.outlineVariant}33`}
      />
      {icon && <span style={{
        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
        color: T.outlineVariant, fontSize: 16,
      }}>{icon}</span>}
    </div>
  </div>
);

const SearchBar = ({ placeholder }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 12, background: T.surfaceContainer,
      borderRadius: 14, padding: "14px 20px", maxWidth: 600,
    }}>
      <I name="search" size={18} />
      <input placeholder={placeholder} style={{
        border: "none", outline: "none", background: "transparent", flex: 1,
        fontSize: 14, color: T.onSurface, fontFamily: "Inter",
      }} />
    </div>
  </div>
);

const Avatar = ({ name, size = 40, bg = T.primary, color = T.onPrimary, src }) => {
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontSize: size * 0.38, fontWeight: 700, fontFamily: "Manrope, sans-serif",
      flexShrink: 0,
    }}>{initials}</div>
  );
};

const ProgressBar = ({ pct, color = T.primary, bg = T.surfaceHigh, h = 6 }) => (
  <div style={{ background: bg, borderRadius: 99, height: h, width: "100%", overflow: "hidden" }}>
    <div style={{
      width: `${pct}%`, height: "100%", background: color, borderRadius: 99,
      transition: "width 0.6s ease",
    }} />
  </div>
);

/* ─── Sidebar ─── */
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "clinical", label: "Clinical Resources", icon: "clinical" },
  { id: "staff", label: "Staff Directory", icon: "staff" },
  { id: "marketing", label: "Marketing Hub", icon: "marketing" },
  { id: "hr", label: "HR Hub", icon: "building" },
  { id: "training", label: "Training Hub", icon: "training" },
  { id: "admin", label: "Document Upload Centre", icon: "upload" },
];

const Sidebar = ({ current, onNav }) => (
  <aside style={{
    width: 240, minHeight: "100vh", background: T.surfaceLow,
    display: "flex", flexDirection: "column", padding: "32px 0",
    position: "fixed", left: 0, top: 0, zIndex: 50,
  }}>
    <div style={{ padding: "0 28px", marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <I name="tooth" size={20} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#00838F", fontFamily: "Manrope" }}>Inspire Dental Group</div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: T.onSurface, opacity: 0.5, fontWeight: 600 }}>Clinical Sanctuary</div>
        </div>
      </div>
    </div>
    <nav style={{ flex: 1 }}>
      {navItems.map(item => {
        const active = current === item.id;
        return (
          <a key={item.id} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "12px 28px",
            marginLeft: active ? 16 : 0, paddingLeft: active ? 20 : 28,
            background: active ? T.surfaceLowest : "transparent",
            borderRadius: active ? "9999px 0 0 9999px" : 0,
            color: active ? "#00838F" : T.onSurface,
            opacity: active ? 1 : 0.7, fontWeight: active ? 700 : 500,
            fontFamily: "Manrope, sans-serif", fontSize: 13, cursor: "pointer",
            transition: "all 0.2s", letterSpacing: "0.02em",
            textDecoration: "none",
          }}>
            <I name={item.icon} size={18} />
            {item.label}
          </a>
        );
      })}
    </nav>
    <div style={{ padding: "0 28px" }}>
      <a onClick={() => {}} style={{
        display: "flex", alignItems: "center", gap: 14, padding: "10px 0",
        color: T.onSurface, opacity: 0.6, fontFamily: "Manrope", fontSize: 13,
        cursor: "pointer", textDecoration: "none",
      }}><I name="settings" size={16} /> Settings</a>
      <a onClick={() => onNav("login")} style={{
        display: "flex", alignItems: "center", gap: 14, padding: "10px 0",
        color: T.onSurface, opacity: 0.6, fontFamily: "Manrope", fontSize: 13,
        cursor: "pointer", textDecoration: "none",
      }}><I name="logout" size={16} /> Logout</a>
      <p style={{
        fontSize: 9, color: T.onSurface, opacity: 0.35, marginTop: 20,
        lineHeight: 1.4, fontFamily: "Inter", textAlign: "center",
      }}>© 2026 BrainPower Technologies Ltd. All rights reserved.</p>
    </div>
  </aside>
);

/* ─── Top Bar ─── */
const TopBar = ({ title, subtitle }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 32,
  }}>
    <div>
      <h1 style={{ fontFamily: "Manrope", fontSize: 28, fontWeight: 800, color: T.onSurface, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ color: T.onSurfaceVariant, fontSize: 14, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, background: T.surfaceContainer,
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }}><I name="bell" size={18} /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope" }}>Dr. Alexander Chen</div>
          <div style={{ fontSize: 10, color: T.primary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Lead Dentist</div>
        </div>
        <Avatar name="Alexander Chen" size={40} />
      </div>
    </div>
  </div>
);

/* ─── LOGIN PAGE ─── */
const LoginPage = ({ onNav }) => (
  <div style={{
    minHeight: "100vh", background: T.surface, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: 24, position: "relative",
    overflow: "hidden", fontFamily: "Inter, sans-serif",
  }}>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    {/* Atmospheric blurs */}
    <div style={{
      position: "absolute", top: -200, right: -200, width: 600, height: 600,
      background: `${T.secondaryContainer}30`, borderRadius: "50%", filter: "blur(120px)",
    }} />
    <div style={{
      position: "absolute", bottom: -150, left: -150, width: 400, height: 400,
      background: `${T.tertiaryContainer}20`, borderRadius: "50%", filter: "blur(100px)",
    }} />

    <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(0,105,116,0.2)",
        }}>
          <I name="tooth" size={32} color={T.onPrimary} />
        </div>
        <h1 style={{ fontFamily: "Manrope", fontSize: 24, fontWeight: 300, color: T.onSurface, letterSpacing: "-0.01em" }}>
          <span style={{ fontWeight: 700 }}>Inspire</span> Dental Group
        </h1>
        <p style={{ fontFamily: "Manrope", fontSize: 15, color: T.onSurfaceVariant, marginTop: 4, fontWeight: 600 }}>The Clinical Sanctuary</p>
        <div style={{ width: 48, height: 3, background: `${T.primary}30`, borderRadius: 99, margin: "12px auto 0" }} />
      </div>

      {/* Login Card */}
      <Card style={{ padding: "40px 36px" }} hover={false}>
        <Input label="Email" type="email" placeholder="dr.smith@dentalhub.co.uk" icon="@" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.onSurfaceVariant, letterSpacing: "0.08em", textTransform: "uppercase" }}>Password</label>
          <a style={{ fontSize: 12, color: T.primary, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>Forgot Password?</a>
        </div>
        <Input type="password" placeholder="••••••••••••" icon={<I name="eye" size={14} />} />

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}>
          <input type="checkbox" style={{ accentColor: T.primary }} />
          <span style={{ fontSize: 13, color: T.onSurfaceVariant }}>Remember my session</span>
        </label>

        <BtnPrimary onClick={() => onNav("dashboard")} style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 15 }}>
          Sign In <I name="arrow" size={16} />
        </BtnPrimary>

        <div style={{ textAlign: "center", marginTop: 28, paddingTop: 24, borderTop: `1px solid ${T.outlineVariant}18` }}>
          <p style={{ fontSize: 11, color: T.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14 }}>New to the Hub?</p>
          <BtnOutline onClick={() => onNav("register")} style={{ width: "100%", justifyContent: "center", padding: "14px 28px" }}>
            Register <I name="person" size={16} />
          </BtnOutline>
        </div>
      </Card>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <p style={{ fontSize: 12, color: T.onSurfaceVariant, opacity: 0.7 }}>Authorised Personnel Only</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 }}>
          <div style={{ display: "flex" }}>
            <Avatar name="A" size={24} /><Avatar name="B" size={24} bg={T.secondary} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.onSurfaceVariant }}>Join 120+ staff on duty</span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16,
          background: T.surfaceContainer, padding: "6px 16px", borderRadius: 99,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF50" }} />
          <span style={{ fontSize: 12, color: T.onSurfaceVariant }}>System Status: Fully Operational</span>
        </div>
      </div>
    </div>
  </div>
);

/* ─── DASHBOARD ─── */
const DashboardPage = () => {
  const [shoutText, setShoutText] = useState("");
  const [shoutouts, setShoutouts] = useState([
    { from: "Dr. Maya Patel", to: "Nurse Clara", msg: "Incredible support during that complex root canal today. We couldn't have done it without your speed and precision!", time: "2h ago", fives: 12 },
    { from: "James Thompson", to: "Front Desk Team", msg: "Handling the compressor outage so smoothly while keeping the patients calm was masterclass service!", time: "Yesterday", fives: 8 },
  ]);

  const stats = [
    { label: "Patient Satisfaction", value: "98", unit: "%", sub: "↗ +2.4% from last month" },
    { label: "Daily Focus", value: "Medical history updates", icon: "target" },
    { label: "Compliance Health", value: "100%", sub: "Status: Optimal" },
  ];

  const huddle = [
    { tag: "Clinic Ops", text: "Compressor at Bristol service booked for 2 PM. Avoid surgery 3 during this window.", color: T.primary },
    { tag: "Staffing", text: "Nurse Sarah on emergency leave. Nurse James covering Surgery 2 today.", color: "#FF9800" },
    { tag: "Equipment", text: "X-ray sensors calibrated. Ready for high volume day.", color: T.onTertiaryContainer },
  ];

  const newsFeed = [
    { tag: "Group Update", title: "Expansion: New Specialist Wing opening in Bristol next month.", desc: "Learn about the new referral pathways and clinical opportunities available at the South West hub.", pinned: true },
    { tag: "Industry", title: "CQC launches new Single Assessment Framework for dental practices", desc: "34 Quality Statements replace the old KLOEs. All practices should review the updated guidance.", pinned: false },
    { tag: "Clinical", title: "FGDP updates antimicrobial prescribing guidelines", desc: "New recommendations on antibiotic use in dental infections — training module updated in the Training Hub.", pinned: false },
  ];

  return (
    <div>
      <SearchBar placeholder="Search announcements, protocols, or staff..." />
      <TopBar title="Good morning, Dr. Chen" subtitle="London Central Clinic • Tuesday, 24 Oct" />

      {/* Hero News Banner — manageable from admin */}
      <div style={{
        background: gradient, borderRadius: 16, padding: "44px 36px", marginBottom: 24,
        position: "relative", overflow: "hidden", color: T.onPrimary,
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: "50%", height: "100%",
          background: `linear-gradient(90deg, ${T.primaryDim}, transparent)`, opacity: 0.3,
        }} />
        <div style={{ position: "absolute", top: -40, right: -40, opacity: 0.05 }}>
          <I name="tooth" size={200} color="white" />
        </div>
        <Pill bg="rgba(255,255,255,0.2)" color="white" small>{newsFeed[0].tag}</Pill>
        <h2 style={{ fontFamily: "Manrope", fontSize: 26, fontWeight: 800, margin: "14px 0 8px", maxWidth: 500, lineHeight: 1.2, position: "relative" }}>
          {newsFeed[0].title}
        </h2>
        <p style={{ opacity: 0.85, fontSize: 13, maxWidth: 440, lineHeight: 1.6, position: "relative" }}>
          {newsFeed[0].desc}
        </p>
        <BtnSecondary onClick={() => {}} style={{ marginTop: 18, background: "rgba(255,255,255,0.95)", color: T.primary, padding: "10px 20px", fontSize: 13 }}>
          Read Full Story
        </BtnSecondary>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
            {stats.map((s, i) => (
              <Card key={i} style={{ padding: 22, textAlign: i === 1 ? "center" : "left" }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.onSurfaceVariant, marginBottom: 10 }}>{s.label}</p>
                {s.icon ? (
                  <p style={{ fontFamily: "Manrope", fontSize: 15, fontWeight: 700, color: T.primary }}>{s.value}</p>
                ) : (
                  <p style={{ fontFamily: "Manrope", fontSize: 34, fontWeight: 800, color: T.primary, lineHeight: 1 }}>
                    {s.value}<span style={{ fontSize: 16, fontWeight: 600 }}>{s.unit}</span>
                  </p>
                )}
                {s.sub && <p style={{ fontSize: 11, color: T.primary, marginTop: 6 }}>{s.sub}</p>}
              </Card>
            ))}
          </div>

          {/* News & Industry Feed */}
          <Card style={{ padding: 22, marginBottom: 22 }} hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Manrope", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <I name="zap" size={16} color={T.primary} /> News & Updates
              </h3>
              <a style={{ fontSize: 12, color: T.primary, fontWeight: 600, cursor: "pointer" }}>View All</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {newsFeed.slice(1).map((n, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, padding: "14px 16px", background: T.surfaceLow,
                  borderRadius: 12, cursor: "pointer", transition: "background 0.15s",
                  alignItems: "flex-start",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${T.primaryContainer}20`}
                  onMouseLeave={e => e.currentTarget.style.background = T.surfaceLow}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, background: `${T.primaryContainer}40`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
                  }}>
                    <I name={n.tag === "Industry" ? "external" : "clinical"} size={16} color={T.primary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Pill bg={n.tag === "Industry" ? `#FF980012` : `${T.primary}12`} color={n.tag === "Industry" ? "#FF9800" : T.primary} small>{n.tag}</Pill>
                    </div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope", lineHeight: 1.3, marginBottom: 4 }}>{n.title}</h4>
                    <p style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.5 }}>{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Shout-Out Wall */}
          <Card style={{ padding: 22, marginBottom: 22 }} hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: "Manrope", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <I name="award" size={16} color={T.primary} /> Kudos Wall
              </h3>
              <a style={{ fontSize: 12, color: T.primary, fontWeight: 600, cursor: "pointer" }}>View All Shoutouts</a>
            </div>
            {/* Post input */}
            <div style={{
              display: "flex", gap: 10, padding: "10px 14px", background: T.surfaceLow,
              borderRadius: 12, marginBottom: 14, alignItems: "center",
            }}>
              <Avatar name="Alexander Chen" size={30} />
              <input value={shoutText} onChange={e => setShoutText(e.target.value)}
                placeholder="Give someone a shout-out..."
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 12, fontFamily: "Inter", color: T.onSurface }}
              />
              <BtnPrimary onClick={() => {
                if (shoutText.trim()) {
                  setShoutouts([{ from: "Dr. Alexander Chen", to: "Team", msg: shoutText, time: "Just now", fives: 0 }, ...shoutouts]);
                  setShoutText("");
                }
              }} style={{ padding: "6px 12px", fontSize: 10 }}>
                <I name="send" size={11} /> Post
              </BtnPrimary>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {shoutouts.map((k, i) => (
                <div key={i} style={{ padding: 16, background: T.surfaceLow, borderRadius: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Avatar name={k.from} size={32} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "Manrope" }}>{k.from}</div>
                      <div style={{ fontSize: 10, color: T.onSurfaceVariant }}>To: {k.to}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.6, fontStyle: "italic" }}>"{k.msg}"</p>
                  <div style={{ marginTop: 10 }}>
                    <span onClick={() => {
                      const updated = [...shoutouts];
                      updated[i] = { ...updated[i], fives: updated[i].fives + 1 };
                      setShoutouts(updated);
                    }} style={{ cursor: "pointer" }}>
                      <Pill bg={`${T.primary}10`} color={T.primary}><I name="heart" size={10} /> High Five ({k.fives})</Pill>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Suggestion Box */}
          <Card style={{ padding: 22, background: gradient, color: T.onPrimary }} hover={false}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <I name="lightbulb" size={20} color={T.onPrimary} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "Manrope", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Suggestion Box</h3>
                <p style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5, marginBottom: 12 }}>
                  Got an idea to improve the practice? All submissions are anonymous and reviewed weekly by the management team.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <textarea rows={2} placeholder="Share your suggestion..." style={{
                    flex: 1, padding: "10px 14px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)",
                    fontSize: 12, fontFamily: "Inter", outline: "none", resize: "none",
                    color: T.onPrimary, boxSizing: "border-box",
                  }} />
                  <BtnSecondary style={{
                    background: "rgba(255,255,255,0.92)", color: T.primary,
                    padding: "10px 18px", fontSize: 12, alignSelf: "flex-end",
                  }}>Submit</BtnSecondary>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ═══ RIGHT SIDEBAR ═══ */}
        <div>
          {/* Daily Huddle */}
          <Card style={{ padding: 20, marginBottom: 14 }} hover={false}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <I name="clipboard" size={15} /> Daily Huddle
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {huddle.map((h, i) => (
                <div key={i} style={{
                  padding: 12, background: T.surfaceLow, borderRadius: 10,
                  borderLeft: `3px solid ${h.color}`,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: h.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h.tag}</span>
                  <p style={{ fontSize: 11, color: T.onSurface, marginTop: 4, lineHeight: 1.5 }}>{h.text}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Celebrations */}
          <Card style={{ padding: 22 }} hover={false}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <I name="star" size={15} color={T.primary} /> Celebrations
            </h3>
            {/* Employee of the Month */}
            <div style={{
              padding: 18, background: gradient, borderRadius: 12, color: T.onPrimary,
              textAlign: "center", marginBottom: 16,
            }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.7, marginBottom: 8 }}>Employee of the Month</p>
              <Avatar name="Elena Rossi" size={52} />
              <p style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginTop: 8 }}>Elena Rossi</p>
              <p style={{ fontSize: 10, opacity: 0.7, marginBottom: 8 }}>Senior Hygienist</p>
              <p style={{ fontSize: 11, opacity: 0.75, fontStyle: "italic", lineHeight: 1.5 }}>
                "Outstanding patient care and consistently positive feedback from every appointment."
              </p>
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.onSurfaceVariant, marginBottom: 10 }}>Upcoming Milestones</p>
            {[
              { name: "Mark Thompson", event: "5 Year Work Anniversary", when: "This week", emoji: "🎉" },
              { name: "Jessica Wu", event: "Birthday", when: "Friday", emoji: "🎂" },
              { name: "Dr. Maya Patel", event: "100th Implant Case", when: "Today", emoji: "🏆" },
              { name: "James Thompson", event: "1 Year Anniversary", when: "Next Mon", emoji: "⭐" },
              { name: "Nurse Clara", event: "Birthday", when: "Nov 2", emoji: "🎂" },
            ].map((m, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                borderTop: `1px solid ${T.outlineVariant}10`,
              }}>
                <Avatar name={m.name} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: T.onSurfaceVariant }}>{m.event}</div>
                </div>
                <span style={{ fontSize: 14 }}>{m.emoji}</span>
                <span style={{ fontSize: 9, color: T.outline, minWidth: 50, textAlign: "right" }}>{m.when}</span>
              </div>
            ))}

            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.onSurfaceVariant, marginTop: 16, marginBottom: 10 }}>Recent Achievements</p>
            {[
              { name: "Dr. Alexander Chen", achievement: "Completed Advanced Implant Certification" },
              { name: "Elena Rossi", achievement: "200 consecutive 5-star patient reviews" },
            ].map((a, i) => (
              <div key={i} style={{
                padding: "10px 12px", background: `${T.primaryContainer}15`, borderRadius: 10,
                marginBottom: 8, display: "flex", alignItems: "center", gap: 10,
              }}>
                <Avatar name={a.name} size={24} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: T.onSurfaceVariant }}>{a.achievement}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─── CLINICAL RESOURCES ─── */
const ClinicalPage = () => {
  const [activeKloe, setActiveKloe] = useState(null);
  const [activeReferral, setActiveReferral] = useState(null);

  const kloe = [
    { label: "Safe", icon: "shield" },
    { label: "Effective", icon: "check" },
    { label: "Caring", icon: "heart" },
    { label: "Responsive", icon: "zap" },
    { label: "Well-Led", icon: "star" },
  ];

  const kloeDocuments = {
    Safe: [
      { name: "Infection Prevention & Control Policy", type: "PDF", size: "1.8 MB", updated: "Jan 2024", status: "Current", author: "Compliance Team" },
      { name: "Sharps & Clinical Waste Protocol", type: "PDF", size: "920 KB", updated: "Nov 2023", status: "Current", author: "H&S Lead" },
      { name: "Radiography Safety & IRMER Compliance", type: "PDF", size: "2.1 MB", updated: "Dec 2023", status: "Current", author: "Dr. Maya Patel" },
      { name: "Medical Emergency Drugs Checklist", type: "DOCX", size: "340 KB", updated: "Feb 2024", status: "Updated", author: "Dr. Alexander Chen" },
      { name: "Lone Worker Risk Assessment", type: "PDF", size: "560 KB", updated: "Sep 2023", status: "Review Due", author: "Mark Thompson" },
    ],
    Effective: [
      { name: "Clinical Audit Cycle Framework", type: "PDF", size: "1.4 MB", updated: "Jan 2024", status: "Current", author: "Dr. Sarah Jenkins" },
      { name: "Evidence-Based Prescribing Guidelines", type: "PDF", size: "2.3 MB", updated: "Oct 2023", status: "Current", author: "Dr. Alexander Chen" },
      { name: "Restorative Outcomes Tracker Template", type: "XLSX", size: "780 KB", updated: "Dec 2023", status: "Current", author: "Clinical Governance" },
      { name: "Referral Pathway Effectiveness Review", type: "PDF", size: "1.1 MB", updated: "Nov 2023", status: "Current", author: "Dr. Maya Patel" },
    ],
    Caring: [
      { name: "Patient Communication Standards", type: "PDF", size: "1.2 MB", updated: "Feb 2024", status: "Updated", author: "Patient Experience Lead" },
      { name: "Consent & Capacity Policy", type: "PDF", size: "1.9 MB", updated: "Jan 2024", status: "Current", author: "Legal & Compliance" },
      { name: "Vulnerable Patient Pathway Guide", type: "PDF", size: "850 KB", updated: "Dec 2023", status: "Current", author: "Safeguarding Lead" },
      { name: "Patient Feedback Response Framework", type: "DOCX", size: "420 KB", updated: "Nov 2023", status: "Current", author: "Mark Thompson" },
    ],
    Responsive: [
      { name: "Complaints Handling Procedure", type: "PDF", size: "1.5 MB", updated: "Jan 2024", status: "Current", author: "Practice Manager" },
      { name: "Emergency Access & Triage Protocol", type: "PDF", size: "980 KB", updated: "Feb 2024", status: "Updated", author: "Dr. Alexander Chen" },
      { name: "Appointment Availability Standards", type: "PDF", size: "640 KB", updated: "Oct 2023", status: "Current", author: "Operations Team" },
      { name: "Special Needs & Accessibility Guide", type: "PDF", size: "1.1 MB", updated: "Dec 2023", status: "Current", author: "Patient Experience Lead" },
    ],
    "Well-Led": [
      { name: "Clinical Governance Framework 2024", type: "PDF", size: "3.2 MB", updated: "Jan 2024", status: "Current", author: "Dr. Sarah Jenkins" },
      { name: "Staff Appraisal & CPD Policy", type: "PDF", size: "1.4 MB", updated: "Nov 2023", status: "Current", author: "HR Team" },
      { name: "Risk Register & Mitigation Plan", type: "XLSX", size: "2.8 MB", updated: "Feb 2024", status: "Updated", author: "Compliance Team" },
      { name: "Whistleblowing & Duty of Candour Policy", type: "PDF", size: "720 KB", updated: "Sep 2023", status: "Review Due", author: "Legal & Compliance" },
      { name: "Business Continuity Plan", type: "PDF", size: "1.6 MB", updated: "Dec 2023", status: "Current", author: "Mark Thompson" },
    ],
  };

  const statusColors = { Current: "#4CAF50", Updated: T.primary, "Review Due": "#FF9800" };

  const referralPathways = [
    { label: "Oral Surgery", icon: "clinical" },
    { label: "Orthodontics", icon: "star" },
    { label: "Endo Specialists", icon: "tooth" },
  ];

  const referralDocuments = {
    "Oral Surgery": [
      { name: "Oral Surgery Referral Form", type: "PDF", size: "420 KB", updated: "Feb 2024", status: "Current", author: "Dr. Maya Patel" },
      { name: "Surgical Extraction Pathway Guide", type: "PDF", size: "1.3 MB", updated: "Jan 2024", status: "Current", author: "Oral Surgery Dept" },
      { name: "Impacted Third Molar Referral Criteria", type: "PDF", size: "680 KB", updated: "Nov 2023", status: "Current", author: "Dr. Alexander Chen" },
      { name: "Post-Surgical Complications Protocol", type: "PDF", size: "950 KB", updated: "Dec 2023", status: "Updated", author: "Clinical Governance" },
      { name: "Biopsy & Lesion Referral Pathway", type: "DOCX", size: "310 KB", updated: "Oct 2023", status: "Review Due", author: "Oral Medicine Lead" },
    ],
    "Orthodontics": [
      { name: "Orthodontic Referral Form (Adults)", type: "PDF", size: "380 KB", updated: "Feb 2024", status: "Current", author: "Dr. Sarah Jenkins" },
      { name: "Orthodontic Referral Form (Under 18s)", type: "PDF", size: "400 KB", updated: "Feb 2024", status: "Current", author: "Dr. Sarah Jenkins" },
      { name: "Invisalign Clinical Pathway", type: "PDF", size: "2.1 MB", updated: "Jan 2024", status: "Updated", author: "Orthodontic Dept" },
      { name: "Complex Case Discussion Request Form", type: "DOCX", size: "290 KB", updated: "Dec 2023", status: "Current", author: "MDT Coordinator" },
      { name: "Orthodontic Emergency Triage Guide", type: "PDF", size: "540 KB", updated: "Nov 2023", status: "Current", author: "Dr. Sarah Jenkins" },
      { name: "Retention Protocol & Follow-Up Pathway", type: "PDF", size: "720 KB", updated: "Oct 2023", status: "Review Due", author: "Clinical Standards" },
    ],
    "Endo Specialists": [
      { name: "Endodontic Specialist Referral Form", type: "PDF", size: "350 KB", updated: "Jan 2024", status: "Current", author: "Endo Dept" },
      { name: "Root Canal Retreatment Pathway", type: "PDF", size: "1.1 MB", updated: "Feb 2024", status: "Updated", author: "Dr. Leo Vance" },
      { name: "Apicectomy Referral Criteria", type: "PDF", size: "480 KB", updated: "Dec 2023", status: "Current", author: "Endo Specialists" },
      { name: "CBCT Imaging Request for Endo Cases", type: "DOCX", size: "260 KB", updated: "Nov 2023", status: "Current", author: "Radiology Lead" },
      { name: "Internal Resorption Management Guide", type: "PDF", size: "890 KB", updated: "Sep 2023", status: "Review Due", author: "Dr. Leo Vance" },
    ],
  };

  const protocols = [
    { name: "Emergency Drugs", desc: "Dosage and administration guide for medical emergencies." },
    { name: "Sedation Care", desc: "Pre and post-operative monitoring standards." },
    { name: "Endodontics", desc: "Aseptic technique and irrigation sequences." },
  ];
  const audits = [
    { name: "Infection Control", status: "98% PASS", color: "#4CAF50" },
    { name: "Radiography Audits", status: "IN PROGRESS", color: T.primary },
    { name: "Clinical Notes", status: "100% PASS", color: "#4CAF50" },
  ];

  return (
    <div>
      <SearchBar placeholder="Search clinical protocols, CQC evidence, or referral guides..." />

      <TopBar title="Clinical Resources Hub" subtitle="Centralized evidence-based guidelines, compliance frameworks, and digital workflows for Inspire Dental Group clinicians." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <div>
          {/* CQC KLOE Library */}
          <Card style={{ padding: 32, marginBottom: 24 }} hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 700, color: T.primary, marginBottom: 8 }}>CQC KLOE Library</h3>
                <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.6 }}>Quality evidence and documentation mapped to the Key Lines of Enquiry.</p>
              </div>
              <I name="check" size={22} color={T.primary} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
              {kloe.map((k, i) => {
                const isActive = activeKloe === k.label;
                return (
                  <div key={i} onClick={() => setActiveKloe(isActive ? null : k.label)} style={{
                    flex: 1, textAlign: "center", padding: "20px 8px",
                    background: isActive ? `${T.primaryContainer}60` : T.surfaceLow,
                    borderRadius: 12, cursor: "pointer", transition: "all 0.25s",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    border: isActive ? `2px solid ${T.primary}` : "2px solid transparent",
                    transform: isActive ? "translateY(-2px)" : "none",
                    boxShadow: isActive ? `0 6px 20px ${T.primary}15` : "none",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: isActive ? T.primary : `${T.primaryContainer}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.25s",
                    }}>
                      <I name={k.icon} size={20} color={isActive ? T.onPrimary : T.primary} />
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, marginTop: 10, textTransform: "uppercase", letterSpacing: "0.04em", color: isActive ? T.primary : T.onSurface }}>{k.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Inline Document List */}
            {activeKloe && (
              <div style={{
                marginTop: 20, padding: 20, background: T.surfaceLow, borderRadius: 14,
                animation: "fadeSlideIn 0.3s ease",
              }}>
                <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <I name={kloe.find(k => k.label === activeKloe)?.icon} size={16} color={T.primary} />
                    <h4 style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, color: T.primary }}>
                      {activeKloe} — {kloeDocuments[activeKloe]?.length} Documents
                    </h4>
                  </div>
                  <span onClick={() => setActiveKloe(null)} style={{ cursor: "pointer", fontSize: 12, color: T.outline, fontWeight: 600 }}>
                    Close ✕
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {kloeDocuments[activeKloe]?.map((doc, di) => (
                    <div key={di} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                      background: T.surfaceLowest, borderRadius: 10,
                      transition: "all 0.2s", cursor: "pointer",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${T.primaryContainer}30`; e.currentTarget.style.transform = "translateX(4px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceLowest; e.currentTarget.style.transform = "none"; }}
                    >
                      {/* File icon */}
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: doc.type === "PDF" ? `${T.error}10` : doc.type === "XLSX" ? `#4CAF5010` : `${T.primary}10`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <I name="file" size={16} color={doc.type === "PDF" ? T.error : doc.type === "XLSX" ? "#4CAF50" : T.primary} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.onSurface, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
                        <div style={{ fontSize: 11, color: T.onSurfaceVariant, marginTop: 2, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span>{doc.type} • {doc.size}</span>
                          <span>Updated {doc.updated}</span>
                          <span>by {doc.author}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <Pill bg={`${statusColors[doc.status]}15`} color={statusColors[doc.status]} small>{doc.status}</Pill>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <div title="Preview" style={{
                          width: 32, height: 32, borderRadius: 8, background: `${T.primary}08`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "background 0.15s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = `${T.primary}18`}
                          onMouseLeave={e => e.currentTarget.style.background = `${T.primary}08`}
                        >
                          <I name="eye" size={14} color={T.primary} />
                        </div>
                        <div title="Download" style={{
                          width: 32, height: 32, borderRadius: 8, background: `${T.primary}08`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "background 0.15s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = `${T.primary}18`}
                          onMouseLeave={e => e.currentTarget.style.background = `${T.primary}08`}
                        >
                          <I name="download" size={14} color={T.primary} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p style={{ fontSize: 11, color: T.outlineVariant, marginTop: 20, display: "flex", alignItems: "center", gap: 6 }}><I name="dot" size={12} /> Last updated 12 hours ago by Compliance Team</p>
          </Card>

          {/* Bottom row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Clinical Protocols */}
            <Card style={{ padding: 28 }} hover={false}>
              <h3 style={{ fontFamily: "Manrope", fontSize: 17, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <I name="book" size={18} /> Clinical Protocols
              </h3>
              {protocols.map((p, i) => (
                <div key={i} style={{
                  padding: "14px 0", borderLeft: `3px solid ${T.error}`, paddingLeft: 14,
                  marginBottom: 14,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Manrope" }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: T.onSurfaceVariant, marginTop: 4 }}>{p.desc}</div>
                </div>
              ))}
            </Card>

            {/* Quality Audit Center */}
            <Card style={{ padding: 28 }} hover={false}>
              <h3 style={{ fontFamily: "Manrope", fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Quality Audit Center</h3>
              {audits.map((a, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                }}>
                  <span style={{ fontSize: 13, color: T.onSurface }}>{a.name}</span>
                  <Pill bg={`${a.color}18`} color={a.color} small>{a.status}</Pill>
                </div>
              ))}
              <BtnSecondary style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
                <I name="plus" size={14} /> Submit New Audit
              </BtnSecondary>
            </Card>
          </div>
        </div>

        {/* Referral Pathways */}
        <div>
          <div style={{
            background: gradient, borderRadius: 14, padding: 28, color: T.onPrimary, marginBottom: 20,
          }}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Referral Pathways</h3>
            <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5, marginBottom: 20 }}>
              Direct links to specialist secondary care and in-house consultants.
            </p>
            {referralPathways.map((s, i) => {
              const isActive = activeReferral === s.label;
              return (
                <div key={i}>
                  <div onClick={() => setActiveReferral(isActive ? null : s.label)} style={{
                    padding: "14px 18px",
                    background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
                    borderRadius: 10, marginBottom: isActive ? 0 : 10,
                    borderBottomLeftRadius: isActive ? 0 : 10,
                    borderBottomRightRadius: isActive ? 0 : 10,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.2s",
                    border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                    borderBottom: isActive ? "none" : "1px solid transparent",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <I name={s.icon} size={16} color={T.onPrimary} /> {s.label}
                    </div>
                    <span style={{
                      fontSize: 11, opacity: 0.7,
                      transform: isActive ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s", display: "inline-block",
                    }}>▾</span>
                  </div>

                  {/* Inline document list */}
                  {isActive && (
                    <div style={{
                      background: "rgba(255,255,255,0.1)", borderRadius: "0 0 10px 10px",
                      padding: "12px 14px", marginBottom: 10,
                      border: "1px solid rgba(255,255,255,0.3)", borderTop: "none",
                      animation: "fadeSlideIn 0.25s ease",
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.6, marginBottom: 10 }}>
                        {referralDocuments[s.label]?.length} Documents
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {referralDocuments[s.label]?.map((doc, di) => (
                          <div key={di} style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                            background: "rgba(255,255,255,0.08)", borderRadius: 8,
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                          >
                            <div style={{
                              width: 30, height: 30, borderRadius: 7,
                              background: doc.type === "PDF" ? "rgba(168,56,54,0.2)" : "rgba(0,105,116,0.2)",
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <I name="file" size={13} color={doc.type === "PDF" ? "#fa746f" : T.primaryContainer} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
                              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 1 }}>{doc.type} • {doc.size} • {doc.updated}</div>
                            </div>
                            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                              <div title="Preview" style={{
                                width: 26, height: 26, borderRadius: 6,
                                background: "rgba(255,255,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "background 0.15s",
                              }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                              >
                                <I name="eye" size={12} color={T.onPrimary} />
                              </div>
                              <div title="Download" style={{
                                width: 26, height: 26, borderRadius: 6,
                                background: "rgba(255,255,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", transition: "background 0.15s",
                              }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                              >
                                <I name="download" size={12} color={T.onPrimary} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <BtnSecondary style={{ width: "100%", justifyContent: "center", marginTop: 16, background: "rgba(255,255,255,0.95)", color: T.primary }}>
              New Specialist Referral
            </BtnSecondary>
          </div>

          {/* Lab & Digital Hub */}
          <Card style={{
            padding: 28, background: T.primary, color: T.onPrimary,
          }} hover={false}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Lab & Digital Hub</h3>
            <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.5, marginBottom: 16 }}>Scanning protocols & digital laboratory dockets.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <BtnSecondary style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 12 }}>Digital Dockets</BtnSecondary>
              <BtnSecondary style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 12 }}>iTero Guides</BtnSecondary>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─── TRAINING HUB ─── */
const TrainingPage = () => {
  const [activeRole, setActiveRole] = useState("all");
  const [expandedModule, setExpandedModule] = useState(null);
  const [showAllModules, setShowAllModules] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Lesson & quiz content per module (keyed by module id)
  const moduleContent = {
    // ═══ PRACTICE MANAGERS — All 10 modules with researched UK content ═══
    m1: {
      lessons: [
        { title: "The CQC's Role in Dental Regulation", dur: "20 min", type: "video", desc: "The Care Quality Commission was established under the Health and Social Care Act 2008. All dental practices providing regulated activities must register with the CQC. Inspections assess whether practices meet the Fundamental Standards set out in the 2014 regulations (updated 2015). Around 10% of dental practices are inspected each year." },
        { title: "The 5 Key Questions & Quality Statements", dur: "25 min", type: "video", desc: "Since 2024, the CQC uses a Single Assessment Framework with 34 Quality Statements replacing the old KLOEs. The five key questions remain: Safe, Effective, Caring, Responsive, and Well-Led. Each is rated Outstanding, Good, Requires Improvement, or Inadequate. The 'Well-Led' requirement was introduced following the Francis Report into Mid Staffordshire NHS Foundation Trust." },
        { title: "Evidence Categories & What Inspectors Review", dur: "22 min", type: "video", desc: "Inspectors gather evidence from six categories: people's experiences (patient feedback, surveys), staff feedback and interviews, partner feedback (commissioners, GDC), onsite inspection observations, internal processes (incident management, record-keeping), and outcome data. They will review training records, risk assessments, audits, complaints logs, and staff personnel files." },
        { title: "Preparing Your Practice: The Compliance Portfolio", dur: "30 min", type: "interactive", desc: "Building an inspection-ready evidence portfolio: organising policies by KLOE, maintaining audit trails, documenting staff training matrices, collecting patient feedback systematically, and keeping equipment maintenance logs. Inspections are usually announced 2 weeks in advance, but can be unannounced in response to concerns or complaints from staff or patients." },
        { title: "Mock Inspection Walkthrough", dur: "35 min", type: "interactive", desc: "Simulated CQC inspection day: presenting your practice's self-assessment at the start, managing inspector access to clinical areas, preparing staff for open-ended questions about patient outcomes, handling document requests, and understanding the inspector's assessment methodology. Inspectors speak to all team members including receptionists, nurses, and associates." },
        { title: "Post-Inspection: Action Plans & Enforcement", dur: "15 min", type: "reading", desc: "Understanding inspection reports, responding to recommendations, creating SMART action plans, and the enforcement escalation pathway (requirement notices, warning notices, conditions, suspension, cancellation). Practices rated 'Requires Improvement' or 'Inadequate' face re-inspection. All ratings are published publicly on the CQC website." },
      ],
      quiz: [
        { q: "Under the CQC's Single Assessment Framework (2024), how many Quality Statements replaced the old KLOEs?", options: ["15", "24", "34", "42"], correct: 2 },
        { q: "Which report led to the introduction of the 'Well-Led' key question?", options: ["The Shipman Inquiry", "The Francis Report (Mid Staffordshire)", "The Morecambe Bay Investigation", "The Kennedy Report"], correct: 1 },
        { q: "How much advance notice does the CQC typically give for a routine comprehensive inspection?", options: ["24 hours", "1 week", "2 weeks", "1 month"], correct: 2 },
        { q: "What percentage of dental practices does the CQC aim to inspect each year?", options: ["5%", "10%", "25%", "50%"], correct: 1 },
      ],
    },
    m2: {
      lessons: [
        { title: "Dental Practice Revenue Streams", dur: "22 min", type: "video", desc: "Understanding NHS contract income (UDA values, band 1/2/3 charges), private fee structures, plan income (Denplan, Practice Plan), hygiene revenue, and ancillary income. Analysing the mix between NHS and private and its impact on practice viability." },
        { title: "Budgeting & Financial Planning", dur: "25 min", type: "video", desc: "Creating annual budgets, forecasting revenue against costs, managing laboratory fees, materials costs, staff costs (typically 50-60% of turnover), premises costs, and equipment depreciation. Understanding profit and loss statements and balance sheets for dental practices." },
        { title: "NHS UDA Performance Monitoring", dur: "20 min", type: "video", desc: "Tracking UDA delivery against contract targets, understanding clawback mechanisms (where practices fail to deliver contracted UDAs), managing the year-end reconciliation process, and strategies for maintaining consistent UDA delivery throughout the contract year." },
        { title: "Cost Control & Efficiency", dur: "18 min", type: "interactive", desc: "Stock management and ordering optimisation, negotiating laboratory and supplier contracts, managing associate fee splits (typically 40-50% of gross), controlling consumables wastage, and energy efficiency measures." },
        { title: "Financial Reporting & KPIs", dur: "15 min", type: "reading", desc: "Key financial metrics for dental practices: revenue per surgery hour, cost per UDA, average patient value, hygiene hourly rate, lab cost percentages, and benchmarking against industry averages. Using software reports (Dentally, SOE, R4) for financial analysis." },
      ],
      quiz: [
        { q: "What percentage of practice turnover do staff costs typically represent?", options: ["20-30%", "35-45%", "50-60%", "65-75%"], correct: 2 },
        { q: "What happens when an NHS dental practice fails to deliver its contracted UDAs?", options: ["No consequence", "Clawback of funding", "Automatic contract renewal", "CQC investigation"], correct: 1 },
        { q: "What is the typical associate fee split range in UK dental practice?", options: ["20-30% of gross", "40-50% of gross", "60-70% of gross", "80-90% of gross"], correct: 1 },
      ],
    },
    m3: {
      lessons: [
        { title: "Employment Contracts & Legal Framework", dur: "22 min", type: "video", desc: "Under the Employment Rights Act 1996, employees must receive a written statement of employment particulars from day one (updated from 2 months by the Employment Rights (Employment Particulars and Paid Annual Leave) (Amendment) Regulations 2018). Covering contract types: permanent, fixed-term, zero-hours, and associate (self-employed) agreements in dentistry." },
        { title: "ACAS Code & Disciplinary Procedures", dur: "25 min", type: "video", desc: "The ACAS Code of Practice on disciplinary and grievance procedures provides the framework all employers should follow. Steps: investigation, notification, hearing with right to be accompanied, decision, and right of appeal. Employment Tribunals can increase awards by up to 25% where the ACAS Code has not been followed." },
        { title: "Staff Appraisals & Performance Management", dur: "20 min", type: "video", desc: "Conducting effective annual appraisals and mid-year reviews, setting SMART objectives, documenting performance concerns, implementing performance improvement plans (PIPs), and managing capability procedures. CQC inspectors specifically check staff appraisal records." },
        { title: "Equality Act 2010 & Protected Characteristics", dur: "18 min", type: "video", desc: "The nine protected characteristics (age, disability, gender reassignment, marriage/civil partnership, pregnancy/maternity, race, religion/belief, sex, sexual orientation). Understanding direct and indirect discrimination, harassment, victimisation, and the duty to make reasonable adjustments for disabled employees." },
        { title: "Practical HR Scenarios", dur: "30 min", type: "interactive", desc: "Case studies: managing long-term sickness absence, handling flexible working requests (Employment Relations (Flexible Working) Act 2023 — employees can request from day one), maternity/paternity rights, redundancy procedures, and managing associate/self-employment status for HMRC purposes." },
      ],
      quiz: [
        { q: "From what point must an employee receive a written statement of employment particulars?", options: ["Within 1 month", "Within 2 months", "From day one of employment", "After probation"], correct: 2 },
        { q: "How many protected characteristics are covered by the Equality Act 2010?", options: ["5", "7", "9", "11"], correct: 2 },
        { q: "By how much can an Employment Tribunal increase an award if the ACAS Code of Practice was not followed?", options: ["10%", "15%", "25%", "50%"], correct: 2 },
        { q: "Under the 2023 Flexible Working Act, when can employees first request flexible working?", options: ["After 6 months", "After 1 year", "After 2 years", "From day one"], correct: 3 },
      ],
    },
    m4: {
      lessons: [
        { title: "Health & Safety at Work Act 1974", dur: "18 min", type: "video", desc: "The primary legislation governing workplace safety. Employer duties under Section 2 (duty to employees), Section 3 (duty to non-employees including patients), and Section 7 (employee duties). Practices with 5+ employees must have a written health and safety policy." },
        { title: "COSHH Regulations 2002", dur: "22 min", type: "video", desc: "Control of Substances Hazardous to Health in dental practice: assessing risks from chemicals (impression materials, disinfectants, bleaching agents, amalgam), mercury hygiene, glutaraldehyde exposure, and maintaining COSHH assessment files with Safety Data Sheets. Employers must prevent or adequately control exposure and provide training under Regulation 12." },
        { title: "RIDDOR 2013 — Reporting Requirements", dur: "15 min", type: "video", desc: "Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013. Reportable events include: fatalities, specified injuries (fractures, amputations, loss of sight), over-7-day incapacitation injuries, occupational diseases (including hepatitis from sharps injuries), and dangerous occurrences. Reports must be made to HSE's online system without delay." },
        { title: "Fire Safety (Regulatory Reform Order 2005)", dur: "20 min", type: "video", desc: "The 'Responsible Person' (usually the practice manager/owner) must carry out a fire risk assessment, maintain fire detection and warning systems, ensure clear escape routes, provide fire safety training to all staff, and keep records. Fire drills should be conducted at least twice yearly. Fire extinguishers must be serviced annually." },
        { title: "Risk Assessment in Practice", dur: "20 min", type: "interactive", desc: "Conducting workplace risk assessments: identifying hazards, evaluating who might be harmed and how, implementing control measures, recording findings, and reviewing regularly. Covering manual handling, DSE assessments, lone working, sharps safety (Health and Safety (Sharp Instruments in Healthcare) Regulations 2013), and slips/trips." },
        { title: "Compliance Documentation & Audit", dur: "12 min", type: "reading", desc: "Maintaining compliance records: accident book (must be GDPR-compliant), COSHH files, risk assessment register, fire log book, equipment maintenance records, and training records. CQC inspectors review these documents during inspections." },
      ],
      quiz: [
        { q: "At what number of employees must a practice have a written health and safety policy?", options: ["1 or more", "3 or more", "5 or more", "10 or more"], correct: 2 },
        { q: "Under RIDDOR 2013, an over-incapacitation injury must be reported if the employee is unable to work for more than how many days?", options: ["3 consecutive days", "5 consecutive days", "7 consecutive days", "14 consecutive days"], correct: 2 },
        { q: "How often should fire drills be conducted in a dental practice?", options: ["Monthly", "Quarterly", "At least twice a year", "Annually"], correct: 2 },
        { q: "Which regulation specifically covers sharps injuries in healthcare settings?", options: ["COSHH 2002", "RIDDOR 2013", "Health and Safety (Sharp Instruments in Healthcare) Regulations 2013", "PUWER 1998"], correct: 2 },
      ],
    },
    m5: {
      lessons: [
        { title: "UK GDPR & Data Protection Act 2018", dur: "22 min", type: "video", desc: "The seven data protection principles (lawfulness/fairness/transparency, purpose limitation, data minimisation, accuracy, storage limitation, integrity/confidentiality, accountability). Dental practices process both personal data and special category health data, requiring explicit consent or legitimate medical basis under Article 9." },
        { title: "Lawful Bases for Processing Patient Data", dur: "18 min", type: "video", desc: "The six lawful bases (consent, contract, legal obligation, vital interests, public task, legitimate interests). For health data in dental practice, the typical basis is 'provision of healthcare' under Schedule 1, Part 1, Paragraph 2 of the DPA 2018. Understanding when consent is and isn't required." },
        { title: "Subject Access Requests (SARs)", dur: "20 min", type: "video", desc: "Patients have the right to access their records under Article 15 of UK GDPR. Practices must respond within one calendar month (extendable by two months for complex requests). Requests are free of charge. You cannot refuse a SAR because it's inconvenient — only if it's manifestly unfounded or excessive." },
        { title: "Data Breaches & the ICO", dur: "15 min", type: "video", desc: "Reportable breaches must be notified to the Information Commissioner's Office within 72 hours. A breach is reportable if it poses a risk to individuals' rights and freedoms. Recording all breaches (reportable or not) in a breach register. Maximum fine under UK GDPR: £17.5 million or 4% of annual turnover." },
        { title: "Caldicott Principles & Dental Records", dur: "18 min", type: "interactive", desc: "The eight Caldicott Principles for handling patient-identifiable information. Appointing a Caldicott Guardian (or equivalent in primary care). Records retention: NHS dental records must be retained for 10 years after treatment (or until age 25 for children, whichever is longer). Secure storage, encryption, and disposal requirements." },
      ],
      quiz: [
        { q: "Within what timeframe must a Subject Access Request be fulfilled under UK GDPR?", options: ["7 days", "14 days", "1 calendar month", "3 months"], correct: 2 },
        { q: "Within how many hours must a reportable data breach be notified to the ICO?", options: ["24 hours", "48 hours", "72 hours", "7 days"], correct: 2 },
        { q: "How long must NHS dental records be retained after treatment?", options: ["5 years", "7 years", "10 years", "25 years"], correct: 2 },
        { q: "How many data protection principles are there under UK GDPR?", options: ["5", "6", "7", "8"], correct: 2 },
      ],
    },
    m6: {
      lessons: [
        { title: "NHS Complaints Framework", dur: "20 min", type: "video", desc: "The NHS complaints procedure (Local Authority Social Services and NHS Complaints Regulations 2009) requires all practices to have a designated complaints handler. Complaints must be acknowledged within 3 working days. The practice must investigate and provide a written response, typically within 6 months." },
        { title: "Handling Complaints Effectively", dur: "22 min", type: "video", desc: "The six-step process: acknowledge, investigate, respond, learn, implement, and monitor. Using the LEARN framework (Listen, Empathise, Apologise, React, Notify). Duty of Candour (Regulation 20) requires practices to be open and transparent when things go wrong, including offering an apology." },
        { title: "Escalation & the Dental Complaints Service", dur: "15 min", type: "video", desc: "If patients are dissatisfied with the practice response, they can escalate to: the NHS Dental Complaints Service (for private treatment), the Parliamentary and Health Service Ombudsman (for NHS treatment), or the GDC (for fitness to practise concerns). Understanding when complaints may become clinical negligence claims." },
        { title: "Root Cause Analysis & Learning", dur: "18 min", type: "interactive", desc: "Using root cause analysis (RCA) tools: fishbone diagrams, 5 Whys technique, and significant event analysis (SEA). Documenting lessons learned, sharing anonymised learning with the team, and implementing system changes to prevent recurrence." },
        { title: "Patient Feedback & Experience", dur: "12 min", type: "reading", desc: "Proactively gathering patient feedback through surveys (Friends and Family Test), online reviews management, patient participation groups, and using feedback data to demonstrate 'Responsive' and 'Caring' to CQC inspectors." },
      ],
      quiz: [
        { q: "Within how many working days must an NHS complaint be acknowledged?", options: ["1 working day", "3 working days", "5 working days", "10 working days"], correct: 1 },
        { q: "Which regulation imposes the Duty of Candour on healthcare providers?", options: ["Regulation 10", "Regulation 15", "Regulation 20", "Regulation 25"], correct: 2 },
        { q: "Where should a patient escalate an unresolved complaint about private dental treatment?", options: ["CQC", "NHS England", "The Dental Complaints Service", "The GMC"], correct: 2 },
      ],
    },
    m7: {
      lessons: [
        { title: "Skill-Mix Planning in Dental Practice", dur: "18 min", type: "video", desc: "Understanding the roles and scope of practice for each team member (GDC Scope of Practice 2013): dentists, hygienists, therapists, dental nurses, orthodontic therapists, and clinical dental technicians. Optimising skill-mix to maximise productivity — e.g., using therapists for routine NHS work and hygienists for prevention programmes." },
        { title: "Rota Management & Scheduling", dur: "20 min", type: "video", desc: "Working Time Regulations 1998: maximum 48-hour working week (opt-out available), minimum 11 consecutive hours rest in 24 hours, minimum 20-minute break after 6 hours. Calculating annual leave entitlement (5.6 weeks including bank holidays). Managing part-time, flexible working, and multi-site rotas." },
        { title: "Locum & Temporary Staff Management", dur: "15 min", type: "video", desc: "Sourcing locums (agencies, direct contracts), conducting pre-employment checks (GDC registration, indemnity, DBS, right to work), ensuring locums are familiar with practice protocols, and managing the IR35 implications of engaging self-employed associates and locums." },
        { title: "Staff-to-Patient Ratios & Capacity Planning", dur: "15 min", type: "interactive", desc: "Calculating surgery utilisation rates, optimal appointment book structures, managing DNA rates, and planning for peak demand periods. Using practice management software data to forecast staffing needs." },
      ],
      quiz: [
        { q: "Under the Working Time Regulations 1998, what is the maximum average working week?", options: ["35 hours", "40 hours", "48 hours", "60 hours"], correct: 2 },
        { q: "What is the statutory minimum annual leave entitlement (including bank holidays)?", options: ["4 weeks", "4.8 weeks", "5.6 weeks", "6 weeks"], correct: 2 },
        { q: "After how many continuous hours of work must an employee receive a rest break?", options: ["4 hours", "5 hours", "6 hours", "8 hours"], correct: 2 },
      ],
    },
    m8: {
      lessons: [
        { title: "NHS Dental Contract Types", dur: "22 min", type: "video", desc: "Understanding GDS (General Dental Services) and PDS (Personal Dental Services) contracts. The UDA (Unit of Dental Activity) system: Band 1 (examination, diagnosis, prevention — 1 UDA), Band 2 (includes fillings, extractions, root canal — 3 UDAs), Band 3 (includes crowns, dentures, bridges — 12 UDAs). Contract values vary by region." },
        { title: "UDA Performance Monitoring", dur: "20 min", type: "video", desc: "Tracking UDA delivery against annual contract targets using BSA Compass data. Understanding tolerance levels (typically 96% minimum delivery). Managing the reconciliation process at year-end. Strategies for consistent UDA delivery: appointment book management, recall optimisation, and reducing failed attendance." },
        { title: "Clawback Prevention & Contract Negotiation", dur: "18 min", type: "video", desc: "Clawback occurs when practices under-deliver against their UDA target — the NHS reclaims funding proportionally. Strategies to avoid clawback: monitoring monthly run-rates, managing associate leave carefully, and having contingency plans. Understanding contract variations, hand-backs, and the process for renegotiating contract values." },
        { title: "NHS Dental Charges & Patient Exemptions", dur: "15 min", type: "reading", desc: "Current NHS dental charge bands, patient exemption categories (under 18, pregnant/12 months post-birth, income-based benefits, NHS Low Income Scheme). Managing FP17 form submission, charge verification, and the consequences of incorrect exemption claims." },
      ],
      quiz: [
        { q: "How many UDAs does a Band 2 course of treatment generate?", options: ["1 UDA", "2 UDAs", "3 UDAs", "5 UDAs"], correct: 2 },
        { q: "What is the typical minimum UDA delivery threshold before clawback applies?", options: ["80%", "90%", "96%", "100%"], correct: 2 },
        { q: "Which system does NHS BSA use for contract monitoring?", options: ["Dental Dashboard", "Compass", "NHSBSA Portal", "FP17 Tracker"], correct: 1 },
      ],
    },
    m9: {
      lessons: [
        { title: "Digital Marketing for Dental Practices", dur: "20 min", type: "video", desc: "Building and maintaining a professional website (GDC requirements for advertising — Standards for the Dental Team 9.1). SEO for dental practices, Google Business Profile optimisation, managing online reviews (Google, NHS Choices). Understanding ASA and GDC advertising regulations — you cannot use the word 'specialist' unless GDC-registered as one." },
        { title: "Social Media Strategy", dur: "18 min", type: "video", desc: "Platform selection (Instagram for before/after, Facebook for community engagement, LinkedIn for recruitment). Content planning, patient consent for photography (GDPR-compliant consent forms), managing negative comments, and the GDC's guidance on social media use by dental professionals." },
        { title: "Patient Referral & Retention Programmes", dur: "15 min", type: "video", desc: "Building internal referral networks, patient loyalty programmes, membership/plan conversions (Denplan, Practice Plan, DPAS), and recall optimisation strategies. Understanding the lifetime value of a dental patient and the cost of patient acquisition." },
        { title: "Brand Consistency & Local Marketing", dur: "15 min", type: "interactive", desc: "Developing a consistent brand identity across all touchpoints, local community engagement, practice open days, school visits, and corporate partnerships. Measuring marketing ROI and tracking new patient sources." },
      ],
      quiz: [
        { q: "Under GDC rules, when can a dentist use the title 'specialist' in marketing?", options: ["After 5 years' experience", "After completing a masters degree", "Only when registered on the GDC Specialist List", "When recommended by colleagues"], correct: 2 },
        { q: "Which organisation regulates dental advertising claims in the UK?", options: ["CQC", "ASA (Advertising Standards Authority)", "NHS England", "BDA"], correct: 1 },
        { q: "What consent is required before using patient photos in marketing materials?", options: ["Verbal consent only", "Written GDPR-compliant consent", "No consent needed if anonymised", "GDC approval"], correct: 1 },
      ],
    },
    m10: {
      lessons: [
        { title: "Leadership Styles in Healthcare", dur: "20 min", type: "video", desc: "Understanding transformational, transactional, and situational leadership models applied to dental practice. The NHS Leadership Academy's Healthcare Leadership Model and its nine leadership dimensions. Moving from 'managing' to 'leading' — the difference between compliance and engagement." },
        { title: "Effective Communication & Team Dynamics", dur: "22 min", type: "video", desc: "Communication models for clinical teams, running effective team meetings and daily huddles, giving constructive feedback (SBI model — Situation, Behaviour, Impact), and managing multidisciplinary team dynamics between clinicians, nurses, and administrative staff." },
        { title: "Conflict Resolution", dur: "18 min", type: "video", desc: "Thomas-Kilmann Conflict Mode Instrument (competing, collaborating, compromising, avoiding, accommodating). De-escalation techniques, mediation approaches, and knowing when to escalate to formal HR procedures. Managing inter-associate disputes and clinician-nurse relationship challenges." },
        { title: "Change Management", dur: "20 min", type: "interactive", desc: "Kotter's 8-step change model applied to dental practice: creating urgency, building a coalition, forming a vision, communicating the change, empowering action, creating quick wins, building on change, and anchoring in culture. Common changes in dental practice: new software systems, clinical protocols, or NHS contract changes." },
        { title: "Building a Culture of Clinical Excellence", dur: "15 min", type: "reading", desc: "Embedding a learning culture, encouraging significant event analysis, supporting CPD and professional development, creating psychological safety for reporting near-misses, and using team-based approaches to quality improvement. The link between leadership quality and CQC 'Well-Led' ratings." },
      ],
      quiz: [
        { q: "How many dimensions does the NHS Healthcare Leadership Model include?", options: ["5", "7", "9", "12"], correct: 2 },
        { q: "In the SBI feedback model, what does 'B' stand for?", options: ["Benchmark", "Behaviour", "Business", "Belief"], correct: 1 },
        { q: "How many steps are in Kotter's change management model?", options: ["5", "6", "8", "10"], correct: 2 },
        { q: "Which CQC key question is most directly linked to leadership quality?", options: ["Safe", "Effective", "Caring", "Well-Led"], correct: 3 },
      ],
    },
    // ═══ EXISTING CLINICAL CONTENT (kept) ═══
    d1: {
      lessons: [
        { title: "Medical Emergency Recognition", dur: "15 min", type: "video", desc: "Recognising signs and symptoms of common medical emergencies in the dental setting including anaphylaxis, cardiac arrest, and syncope." },
        { title: "Basic Life Support & AED", dur: "20 min", type: "video", desc: "Adult and child BLS algorithms, chest compression technique, rescue breaths, and automated external defibrillator operation." },
        { title: "Emergency Drug Kit", dur: "18 min", type: "video", desc: "Required emergency drugs, dosages, routes of administration, and drug expiry management." },
        { title: "Oxygen Administration", dur: "12 min", type: "video", desc: "Oxygen delivery devices, flow rates for different emergencies, and pulse oximetry monitoring." },
        { title: "Scenario-Based Practice", dur: "30 min", type: "interactive", desc: "Interactive emergency scenarios: anaphylaxis during LA, vasovagal syncope, asthma attack, and hypoglycaemia." },
        { title: "Emergency Equipment Audit", dur: "10 min", type: "reading", desc: "Monthly equipment checklist, drug storage requirements, and record-keeping obligations." },
      ],
      quiz: [
        { q: "What is the correct adult chest compression rate per minute?", options: ["60-80", "80-100", "100-120", "120-140"], correct: 2 },
        { q: "Which drug is the first-line treatment for anaphylaxis?", options: ["Hydrocortisone", "Chlorphenamine", "Adrenaline 1:1000", "Salbutamol"], correct: 2 },
        { q: "At what ratio should chest compressions to rescue breaths be delivered in adult BLS?", options: ["15:2", "30:2", "15:1", "30:1"], correct: 1 },
        { q: "Where should adrenaline be administered during anaphylaxis?", options: ["Intravenously", "Intramuscularly (anterolateral thigh)", "Subcutaneously", "Sublingually"], correct: 1 },
      ],
    },
    d2: {
      lessons: [
        { title: "IRMER Regulations Overview", dur: "20 min", type: "video", desc: "The Ionising Radiation (Medical Exposure) Regulations 2017, roles of referrer, practitioner, and operator." },
        { title: "Justification & Optimisation", dur: "18 min", type: "video", desc: "Clinical justification for each exposure, selection criteria guidelines, and the ALARA principle." },
        { title: "Image Quality & Grading", dur: "22 min", type: "video", desc: "Radiograph quality assessment, grading systems, reject analysis, and quality assurance programmes." },
        { title: "Radiation Dose & Protection", dur: "15 min", type: "video", desc: "Patient dose reduction, thyroid collars, rectangular collimation, and pregnancy considerations." },
        { title: "Digital Radiography Systems", dur: "20 min", type: "video", desc: "Sensor types, phosphor plates, image processing, and digital workflow optimisation." },
      ],
      quiz: [
        { q: "Under IRMER 2017, who is responsible for justifying a radiographic exposure?", options: ["The operator", "The practitioner", "The referrer", "The patient"], correct: 1 },
        { q: "What does ALARA stand for?", options: ["As Low As Readily Available", "As Low As Reasonably Achievable", "Always Limit All Radiation Application", "As Limited As Reasonably Allowed"], correct: 1 },
        { q: "What is the recommended grading system for dental radiograph quality?", options: ["Pass/Fail", "Grade 1-3", "A-D", "Excellent/Acceptable/Unacceptable"], correct: 1 },
      ],
    },
    n1: {
      lessons: [
        { title: "GDC Standards for Dental Nurses", dur: "15 min", type: "video", desc: "GDC Scope of Practice, Standards for the Dental Team, and professional responsibilities of registered dental nurses." },
        { title: "Radiography for Dental Nurses", dur: "22 min", type: "video", desc: "Taking radiographs under prescription, positioning techniques, infection control during radiography, and image quality." },
        { title: "Fluoride Varnish Application", dur: "18 min", type: "video", desc: "Delivering Better Oral Health guidelines, application technique, patient selection, and consent requirements." },
        { title: "Oral Health Education Delivery", dur: "20 min", type: "video", desc: "Chairside OHE techniques, tailoring advice to patient needs, dietary counselling, and interdental cleaning instruction." },
        { title: "Extended Duties Framework", dur: "12 min", type: "reading", desc: "Overview of additional skills dental nurses can develop, competency requirements, and indemnity considerations." },
      ],
      quiz: [
        { q: "How often must dental nurses renew their GDC registration?", options: ["Every year", "Every 2 years", "Every 3 years", "Every 5 years"], correct: 0 },
        { q: "What concentration of sodium fluoride varnish is typically used in dental practice?", options: ["0.1%", "1%", "2.26%", "5%"], correct: 2 },
        { q: "Under whose prescription can a dental nurse take radiographs?", options: ["Any dentist", "An IRMER practitioner", "A senior nurse", "The practice manager"], correct: 1 },
      ],
    },
    h1: {
      lessons: [
        { title: "BSP Classification of Periodontal Disease", dur: "25 min", type: "video", desc: "2017 World Workshop classification, staging and grading, and clinical application in treatment planning." },
        { title: "BPE Screening & Full Charting", dur: "20 min", type: "video", desc: "Basic Periodontal Examination technique, when to escalate to full charting, probing depth measurement, and bleeding on probing." },
        { title: "Risk Assessment & Patient Factors", dur: "18 min", type: "video", desc: "Smoking, diabetes, genetics, stress — assessing patient risk profiles and modifying treatment plans accordingly." },
        { title: "Treatment Planning & S&RP Protocols", dur: "22 min", type: "video", desc: "Non-surgical periodontal therapy phases, scaling and root planing technique, re-evaluation timelines, and referral criteria." },
        { title: "Outcome Evaluation & Maintenance", dur: "15 min", type: "video", desc: "Measuring treatment success, supportive periodontal therapy intervals, and long-term monitoring strategies." },
      ],
      quiz: [
        { q: "In the 2017 classification, what does Stage III periodontitis indicate?", options: ["Initial periodontitis", "Moderate periodontitis", "Severe periodontitis with potential tooth loss", "Advanced periodontitis requiring surgery"], correct: 2 },
        { q: "A BPE score of 4 indicates what?", options: ["Healthy", "Bleeding on probing", "Pocket 4-5mm", "Pocket 6mm or more"], correct: 3 },
        { q: "How long after completion of non-surgical therapy should re-evaluation typically occur?", options: ["2 weeks", "4-6 weeks", "8-12 weeks", "6 months"], correct: 2 },
      ],
    },
  };

  // Generate default content for modules without specific content
  const getModuleContent = (m) => {
    if (moduleContent[m.id]) return moduleContent[m.id];
    return {
      lessons: [
        { title: "Introduction & Learning Objectives", dur: "10 min", type: "video", desc: `Overview of ${m.title} — key topics, learning outcomes, and how this module contributes to your CPD.` },
        { title: "Core Theory & Principles", dur: "20 min", type: "video", desc: `Essential knowledge and evidence base underpinning ${m.cat.toLowerCase()} practice in the dental setting.` },
        { title: "Practical Application", dur: "25 min", type: "interactive", desc: `Hands-on scenarios and case studies applying ${m.title.toLowerCase()} concepts to real clinical situations.` },
        { title: "Guidelines & Standards", dur: "15 min", type: "reading", desc: `Relevant GDC, CQC, and professional body standards that relate to ${m.cat.toLowerCase()}.` },
        { title: "Reflection & Action Planning", dur: "10 min", type: "reading", desc: "Reflective practice exercise and personal action plan to embed learning into your daily practice." },
      ],
      quiz: [
        { q: `What is the primary learning objective of ${m.title}?`, options: ["Compliance only", "Clinical skill development", "Both compliance and clinical development", "Administrative efficiency"], correct: 2 },
        { q: "How should you apply the learning from this module?", options: ["Only during inspections", "In daily practice", "Only when supervised", "Only for new patients"], correct: 1 },
        { q: "How often should this training be refreshed?", options: ["Never", "Every 5 years", "As per GDC/CQC guidance", "Only if requested"], correct: 2 },
      ],
    };
  };

  const roles = [
    { id: "all", label: "All Roles", icon: "staff" },
    { id: "manager", label: "Practice Managers", icon: "briefcase" },
    { id: "dentist", label: "Dentists", icon: "clinical" },
    { id: "nurse", label: "Dental Nurses", icon: "heart" },
    { id: "hygienist", label: "Hygienists", icon: "star" },
  ];

  const modules = [
    // PRACTICE MANAGERS
    { id: "m1", role: "manager", cat: "Compliance", title: "CQC Inspection Preparation & Self-Assessment", desc: "Complete guide to preparing for CQC inspections including mock audit walkthroughs, evidence gathering, and the 5 Key Lines of Enquiry.", cpd: 6, dur: "6 hrs", type: "Course", status: "mandatory", pct: 0 },
    { id: "m2", role: "manager", cat: "Finance", title: "Practice Financial Management & Budgeting", desc: "Revenue forecasting, cost control, NHS UDA tracking, private fee-setting, and P&L analysis for dental practices.", cpd: 4, dur: "4 hrs", type: "Workshop", status: "recommended", pct: 0 },
    { id: "m3", role: "manager", cat: "HR & Law", title: "Employment Law & HR Procedures", desc: "Contracts, disciplinary processes, grievance handling, staff appraisals, and Equality Act compliance.", cpd: 5, dur: "5 hrs", type: "Course", status: "mandatory", pct: 45 },
    { id: "m4", role: "manager", cat: "Compliance", title: "Health & Safety (COSHH, RIDDOR, Fire)", desc: "Risk assessments, COSHH regulations, RIDDOR reporting, fire safety protocols, and workplace safety audits.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
    { id: "m5", role: "manager", cat: "Data", title: "Information Governance & GDPR", desc: "Data protection principles, Subject Access Requests, breach reporting, data retention, and Caldicott Guardian responsibilities.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 80 },
    { id: "m6", role: "manager", cat: "Operations", title: "Complaints Handling & Patient Experience", desc: "NHS complaint procedures, response timeframes, root cause analysis, and turning feedback into service improvement.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 0 },
    { id: "m7", role: "manager", cat: "Operations", title: "Workforce Planning & Rota Management", desc: "Skill-mix optimisation, holiday management, locum procurement, and staff-to-patient ratio planning.", cpd: 2, dur: "2 hrs", type: "Webinar", status: "optional", pct: 0 },
    { id: "m8", role: "manager", cat: "Finance", title: "NHS Contract Management & UDA Tracking", desc: "Understanding NHS dental contract types, UDA performance monitoring, clawback prevention, and contract negotiation.", cpd: 3, dur: "3 hrs", type: "Course", status: "recommended", pct: 0 },
    { id: "m9", role: "manager", cat: "Growth", title: "Practice Marketing & Patient Acquisition", desc: "Digital marketing, Google Business profile, patient referral programmes, social media strategy, and brand consistency.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "optional", pct: 30 },
    { id: "m10", role: "manager", cat: "Leadership", title: "Leadership & Team Development", desc: "Communication skills, conflict resolution, team motivation, change management, and clinical leadership principles.", cpd: 4, dur: "4 hrs", type: "Course", status: "recommended", pct: 0 },
    // DENTISTS
    { id: "d1", role: "dentist", cat: "Emergency", title: "Medical Emergencies & CPR (Annual)", desc: "BLS/AED refresher, anaphylaxis management, drug dosages, oxygen administration, and emergency equipment checks.", cpd: 3, dur: "3 hrs", type: "Practical", status: "mandatory", pct: 0 },
    { id: "d2", role: "dentist", cat: "Radiology", title: "Radiography & IRMER Regulations", desc: "Justification, optimisation, dose limitation, quality assurance, and IRMER practitioner/operator responsibilities.", cpd: 5, dur: "5 hrs", type: "E-Learning", status: "mandatory", pct: 60 },
    { id: "d3", role: "dentist", cat: "Infection Control", title: "Infection Prevention & Decontamination", desc: "HTM 01-05 compliance, instrument reprocessing, hand hygiene audit, PPE protocols, and water line management.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
    { id: "d4", role: "dentist", cat: "Safeguarding", title: "Safeguarding Children & Vulnerable Adults", desc: "Recognising signs of abuse, referral pathways, Mental Capacity Act, Deprivation of Liberty, and professional responsibilities.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
    { id: "d5", role: "dentist", cat: "Legal", title: "Consent, Record-Keeping & Ethics", desc: "Montgomery principles, valid consent processes, clinical note standards, GDC ethical framework, and fitness to practise.", cpd: 3, dur: "3 hrs", type: "Course", status: "mandatory", pct: 40 },
    { id: "d6", role: "dentist", cat: "Oral Medicine", title: "Oral Cancer Recognition & Referral", desc: "Two-week wait referral criteria, clinical examination techniques, risk factor assessment, and photographic documentation.", cpd: 2, dur: "2 hrs", type: "Masterclass", status: "recommended", pct: 0 },
    { id: "d7", role: "dentist", cat: "Sedation", title: "Conscious Sedation Updates", desc: "IACSD standards, patient assessment, monitoring protocols, recovery procedures, and emergency management during sedation.", cpd: 6, dur: "6 hrs", type: "Course", status: "recommended", pct: 0 },
    { id: "d8", role: "dentist", cat: "Restorative", title: "Advanced Restorative Techniques", desc: "New composite systems, ceramic bonding protocols, rubber dam mastery, and minimally invasive dentistry principles.", cpd: 4, dur: "4 hrs", type: "Masterclass", status: "recommended", pct: 0 },
    { id: "d9", role: "dentist", cat: "Digital", title: "Digital Dentistry (CAD/CAM, CBCT, Scanning)", desc: "iTero/3Shape workflows, CBCT interpretation, digital smile design, and same-day crown fabrication.", cpd: 6, dur: "6 hrs", type: "Practical", status: "recommended", pct: 25 },
    { id: "d10", role: "dentist", cat: "Implants", title: "Implantology Case Planning", desc: "Patient selection, radiographic assessment, surgical guide design, prosthetic planning, and managing complications.", cpd: 8, dur: "8 hrs", type: "Course", status: "optional", pct: 0 },
    { id: "d11", role: "dentist", cat: "Endodontics", title: "Endodontic Advances & Retreatment", desc: "Rotary NiTi systems, apex locators, obturation techniques, retreatment protocols, and managing procedural errors.", cpd: 4, dur: "4 hrs", type: "Masterclass", status: "recommended", pct: 0 },
    { id: "d12", role: "dentist", cat: "Prescribing", title: "Prescribing & Antimicrobial Stewardship", desc: "FGDP prescribing guidelines, antibiotic resistance awareness, appropriate prescribing for dental infections, and drug interactions.", cpd: 2, dur: "2 hrs", type: "E-Learning", status: "mandatory", pct: 0 },
    // DENTAL NURSES
    { id: "n1", role: "nurse", cat: "Core CPD", title: "Dental Nursing Core CPD", desc: "Radiography for dental nurses, fluoride varnish application, oral health education delivery, and extended duties framework.", cpd: 5, dur: "5 hrs", type: "E-Learning", status: "mandatory", pct: 70 },
    { id: "n2", role: "nurse", cat: "Emergency", title: "Medical Emergencies & BLS", desc: "Basic Life Support, AED operation, anaphylaxis protocol, managing fainting and seizures, and oxygen administration.", cpd: 3, dur: "3 hrs", type: "Practical", status: "mandatory", pct: 0 },
    { id: "n3", role: "nurse", cat: "Infection Control", title: "Cross-Infection Control & Decontamination", desc: "Instrument decontamination cycles, autoclave validation, hand hygiene auditing, PPE donning/doffing, and waste segregation.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
    { id: "n4", role: "nurse", cat: "Materials", title: "Dental Materials Handling & Mixing", desc: "Impression materials, composite handling, cement mixing ratios, temporary crown fabrication, and material storage.", cpd: 2, dur: "2 hrs", type: "Practical", status: "recommended", pct: 0 },
    { id: "n5", role: "nurse", cat: "Safeguarding", title: "Safeguarding & Mental Capacity", desc: "Recognising abuse indicators, referral procedures, Mental Capacity Act basics, Gillick competence, and Fraser guidelines.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
    { id: "n6", role: "nurse", cat: "Patient Care", title: "Oral Health Education Delivery", desc: "Tailoring OHI for patients, motivational interviewing basics, dietary advice, interdental cleaning instruction, and child OHE.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 50 },
    { id: "n7", role: "nurse", cat: "Clinical Skills", title: "Dental Photography & Impressions", desc: "Intraoral photography techniques, shade matching, alginate impression best practice, and digital impression support.", cpd: 2, dur: "2 hrs", type: "Practical", status: "optional", pct: 0 },
    { id: "n8", role: "nurse", cat: "Operations", title: "Stock Control & Equipment Maintenance", desc: "Inventory management, expiry date tracking, equipment daily checks, handpiece maintenance, and ordering procedures.", cpd: 1, dur: "1 hr", type: "E-Learning", status: "recommended", pct: 0 },
    { id: "n9", role: "nurse", cat: "Patient Care", title: "Supporting Anxious & Phobic Patients", desc: "Anxiety management techniques, communication strategies, distraction methods, and supporting sedation procedures.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 0 },
    { id: "n10", role: "nurse", cat: "Extended Duties", title: "Extended Duties Training", desc: "Impression taking, fluoride varnish application, placing rubber dam, and taking radiographs under prescription.", cpd: 6, dur: "6 hrs", type: "Course", status: "optional", pct: 0 },
    // HYGIENISTS
    { id: "h1", role: "hygienist", cat: "Periodontics", title: "Periodontal Assessment & Treatment Planning", desc: "BSP guidelines implementation, BPE screening, full periodontal charting, risk assessment, and treatment outcome evaluation.", cpd: 5, dur: "5 hrs", type: "Course", status: "mandatory", pct: 40 },
    { id: "h2", role: "hygienist", cat: "Clinical Skills", title: "Scaling & Root Surface Debridement", desc: "Ultrasonic and hand scaling techniques, subgingival instrumentation, sharpening protocols, and ergonomic positioning.", cpd: 4, dur: "4 hrs", type: "Practical", status: "mandatory", pct: 100 },
    { id: "h3", role: "hygienist", cat: "Patient Care", title: "Behaviour Change & Motivational Interviewing", desc: "Stages of change model, OARS techniques, shared decision-making, and sustained oral hygiene behaviour modification.", cpd: 3, dur: "3 hrs", type: "Workshop", status: "recommended", pct: 0 },
    { id: "h4", role: "hygienist", cat: "Emergency", title: "Medical Emergencies & BLS", desc: "Basic Life Support refresher, anaphylaxis management, drug dosages, and emergency kit checks.", cpd: 3, dur: "3 hrs", type: "Practical", status: "mandatory", pct: 0 },
    { id: "h5", role: "hygienist", cat: "Safeguarding", title: "Safeguarding & Vulnerable Patients", desc: "Safeguarding adults and children, domestic abuse recognition, referral pathways, and professional duty to report.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
    { id: "h6", role: "hygienist", cat: "Implants", title: "Peri-Implant Disease Management", desc: "Peri-mucositis vs peri-implantitis, risk factors, non-surgical management, maintenance protocols, and implant-specific instrumentation.", cpd: 3, dur: "3 hrs", type: "Masterclass", status: "recommended", pct: 0 },
    { id: "h7", role: "hygienist", cat: "Prevention", title: "Fluoride Varnish & Fissure Sealants", desc: "Evidence-based fluoride application, Delivering Better Oral Health toolkit, sealant placement technique, and recall intervals.", cpd: 2, dur: "2 hrs", type: "E-Learning", status: "mandatory", pct: 80 },
    { id: "h8", role: "hygienist", cat: "Patient Care", title: "Smoking Cessation Counselling", desc: "Very Brief Advice model, NHS stop smoking referral, nicotine replacement options, and motivational strategies.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 0 },
    { id: "h9", role: "hygienist", cat: "Anaesthesia", title: "Local Anaesthesia Updates", desc: "Technique refinements, inferior dental block alternatives, articaine evidence, and managing complications.", cpd: 3, dur: "3 hrs", type: "Practical", status: "recommended", pct: 0 },
    { id: "h10", role: "hygienist", cat: "Restorative", title: "Direct Restorations (Therapists)", desc: "Class I-V composite restorations, ART technique, pulp protection decisions, and paediatric restorations.", cpd: 6, dur: "6 hrs", type: "Course", status: "optional", pct: 0 },
  ];

  const filteredModules = activeRole === "all" ? modules : modules.filter(m => m.role === activeRole);
  const mandatory = filteredModules.filter(m => m.status === "mandatory");
  const expiring = mandatory.filter(m => m.pct === 0);
  const inProgress = mandatory.filter(m => m.pct > 0 && m.pct < 100);
  const completed = mandatory.filter(m => m.pct === 100);

  const statusColors = { mandatory: T.error, recommended: T.primary, optional: T.outline };
  const typeColors = { Course: T.primary, "E-Learning": "#4CAF50", Workshop: "#FF9800", Masterclass: "#9C27B0", Practical: "#E91E63", Webinar: T.secondary };

  const totalCpd = filteredModules.reduce((sum, m) => sum + m.cpd, 0);
  const earnedCpd = filteredModules.reduce((sum, m) => sum + Math.round(m.cpd * m.pct / 100), 0);

  // Pick 3 featured courses for the visual cards
  const featured = filteredModules.filter(m => m.status !== "mandatory" && m.pct < 100).slice(0, 3);

  /* ─── Full-Screen Module Viewer ─── */
  if (activeModule) {
    const content = getModuleContent(activeModule);
    const lesson = content.lessons[activeLesson];
    const totalLessons = content.lessons.length;
    const lessonPct = Math.round(((activeLesson + 1) / totalLessons) * 100);
    const typeIcons = { video: "play", interactive: "monitor", reading: "book" };

    return (
      <div>
        {/* Top Nav */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.outlineVariant}15`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div onClick={() => setActiveModule(null)} style={{
              width: 38, height: 38, borderRadius: 10, background: T.surfaceLow,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}><I name="arrow" size={16} color={T.onSurface} /></div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.primary }}>{activeModule.cat} • {activeModule.type}</p>
              <h2 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 800, color: T.onSurface }}>{activeModule.title}</h2>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 11, color: T.onSurfaceVariant }}>Progress</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                <div style={{ width: 100 }}><ProgressBar pct={quizSubmitted ? 100 : lessonPct} h={4} color={T.primary} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.primary }}>{quizSubmitted ? 100 : lessonPct}%</span>
              </div>
            </div>
            <Pill bg={`${T.primary}12`} color={T.primary}>{activeModule.cpd} CPD hrs</Pill>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
          {/* Main Content Area */}
          <div>
            {!quizMode ? (
              <>
                {/* Video Player Placeholder */}
                <div style={{
                  height: 320, borderRadius: 16, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden", marginBottom: 24,
                }}>
                  {/* Decorative elements */}
                  <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,105,116,0.1)" }} />
                  <div style={{ position: "absolute", bottom: -20, left: -20, width: 150, height: 150, borderRadius: "50%", background: "rgba(0,105,116,0.08)" }} />

                  {/* Play button */}
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", border: "2px solid rgba(255,255,255,0.25)", transition: "all 0.3s",
                    marginBottom: 16,
                  }}>
                    <I name={typeIcons[lesson.type] || "play"} size={28} color="white" />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.9)", fontFamily: "Manrope", fontSize: 14, fontWeight: 600 }}>
                    {lesson.type === "video" ? "Click to play video" : lesson.type === "interactive" ? "Interactive Exercise" : "Reading Material"}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 6 }}>{lesson.dur}</span>

                  {/* Progress bar at bottom */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.1)" }}>
                    <div style={{ height: "100%", width: "35%", background: T.primaryContainer, borderRadius: 2 }} />
                  </div>
                </div>

                {/* Current Lesson Info */}
                <Card style={{ padding: 24, marginBottom: 20 }} hover={false}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <Pill bg={`${T.primary}12`} color={T.primary} small>Lesson {activeLesson + 1} of {totalLessons}</Pill>
                      <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, marginTop: 10 }}>{lesson.title}</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.onSurfaceVariant }}>
                      <I name="clock" size={14} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{lesson.dur}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.7 }}>{lesson.desc}</p>
                </Card>

                {/* Lesson Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <BtnSecondary
                    onClick={() => activeLesson > 0 && setActiveLesson(activeLesson - 1)}
                    style={{ opacity: activeLesson === 0 ? 0.4 : 1, padding: "10px 20px", fontSize: 12 }}
                  >← Previous Lesson</BtnSecondary>

                  {activeLesson < totalLessons - 1 ? (
                    <BtnPrimary onClick={() => setActiveLesson(activeLesson + 1)} style={{ padding: "10px 20px", fontSize: 12 }}>
                      Next Lesson <I name="arrow" size={14} />
                    </BtnPrimary>
                  ) : (
                    <BtnPrimary onClick={() => { setQuizMode(true); setQuizAnswers({}); setQuizSubmitted(false); }} style={{ padding: "10px 20px", fontSize: 12 }}>
                      Take Assessment <I name="award" size={14} />
                    </BtnPrimary>
                  )}
                </div>
              </>
            ) : (
              /* ─── Quiz Mode ─── */
              <Card style={{ padding: 32 }} hover={false}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, background: `${T.primaryContainer}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}><I name="award" size={22} color={T.primary} /></div>
                  <div>
                    <h3 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 800 }}>Knowledge Assessment</h3>
                    <p style={{ fontSize: 12, color: T.onSurfaceVariant }}>{content.quiz.length} questions • Pass mark: 100%</p>
                  </div>
                </div>

                {content.quiz.map((question, qi) => {
                  const answered = quizAnswers[qi] !== undefined;
                  const isCorrect = quizAnswers[qi] === question.correct;
                  return (
                    <div key={qi} style={{
                      marginBottom: 24, padding: 20, background: T.surfaceLow, borderRadius: 14,
                      border: quizSubmitted ? (isCorrect ? "2px solid #4CAF50" : `2px solid ${T.error}`) : "2px solid transparent",
                    }}>
                      <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "Manrope", marginBottom: 14 }}>
                        {qi + 1}. {question.q}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {question.options.map((opt, oi) => {
                          const selected = quizAnswers[qi] === oi;
                          const showCorrect = quizSubmitted && oi === question.correct;
                          const showWrong = quizSubmitted && selected && !isCorrect;
                          return (
                            <div key={oi}
                              onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                              style={{
                                padding: "12px 16px", borderRadius: 10, cursor: quizSubmitted ? "default" : "pointer",
                                background: showCorrect ? "#4CAF5012" : showWrong ? `${T.error}08` : selected ? `${T.primary}12` : T.surfaceLowest,
                                border: showCorrect ? "1.5px solid #4CAF50" : showWrong ? `1.5px solid ${T.error}` : selected ? `1.5px solid ${T.primary}` : `1.5px solid ${T.outlineVariant}20`,
                                display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s",
                              }}
                            >
                              <div style={{
                                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                                border: selected || showCorrect ? "none" : `2px solid ${T.outlineVariant}40`,
                                background: showCorrect ? "#4CAF50" : showWrong ? T.error : selected ? T.primary : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                {(selected || showCorrect) && <I name={showCorrect ? "check" : showWrong ? "xcircle" : "check"} size={12} color="white" />}
                              </div>
                              <span style={{ fontSize: 13, color: T.onSurface }}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {!quizSubmitted ? (
                  <BtnPrimary
                    onClick={() => Object.keys(quizAnswers).length === content.quiz.length && setQuizSubmitted(true)}
                    style={{
                      width: "100%", justifyContent: "center", padding: "14px 24px",
                      opacity: Object.keys(quizAnswers).length === content.quiz.length ? 1 : 0.5,
                    }}
                  >
                    Submit Assessment ({Object.keys(quizAnswers).length}/{content.quiz.length} answered)
                  </BtnPrimary>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    {content.quiz.every((q, i) => quizAnswers[i] === q.correct) ? (
                      <div>
                        <div style={{
                          width: 80, height: 80, borderRadius: "50%", background: "#4CAF5012",
                          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                        }}><I name="checkcircle" size={36} color="#4CAF50" /></div>
                        <h4 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 800, color: "#4CAF50" }}>Assessment Passed!</h4>
                        <p style={{ fontSize: 13, color: T.onSurfaceVariant, marginTop: 6 }}>
                          {activeModule.cpd} CPD hours have been logged to your record.
                        </p>
                        <BtnPrimary onClick={() => setActiveModule(null)} style={{ marginTop: 16 }}>
                          Return to Training Hub <I name="arrow" size={14} />
                        </BtnPrimary>
                      </div>
                    ) : (
                      <div>
                        <div style={{
                          width: 80, height: 80, borderRadius: "50%", background: `${T.error}08`,
                          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                        }}><I name="xcircle" size={36} color={T.error} /></div>
                        <h4 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 800, color: T.error }}>Not Quite — Review & Retry</h4>
                        <p style={{ fontSize: 13, color: T.onSurfaceVariant, marginTop: 6 }}>
                          Review the correct answers above, then try again.
                        </p>
                        <BtnPrimary onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} style={{ marginTop: 16 }}>
                          Retry Assessment
                        </BtnPrimary>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Sidebar - Lesson Outline */}
          <div>
            <Card style={{ padding: 20, marginBottom: 16 }} hover={false}>
              <h4 style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Lesson Outline</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {content.lessons.map((l, li) => {
                  const isCurrent = li === activeLesson && !quizMode;
                  const isCompleted = li < activeLesson || quizMode;
                  return (
                    <div key={li}
                      onClick={() => { setActiveLesson(li); setQuizMode(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                        borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                        background: isCurrent ? `${T.primary}10` : "transparent",
                        border: isCurrent ? `1.5px solid ${T.primary}30` : "1.5px solid transparent",
                      }}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                        background: isCompleted ? "#4CAF50" : isCurrent ? T.primary : T.surfaceHigh,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isCompleted ? <I name="check" size={12} color="white" /> :
                          <span style={{ fontSize: 10, fontWeight: 700, color: isCurrent ? "white" : T.outline }}>{li + 1}</span>}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 12, fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? T.primary : T.onSurface,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{l.title}</div>
                        <div style={{ fontSize: 10, color: T.outline, marginTop: 1 }}>{l.dur} • {l.type}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Quiz entry in outline */}
                <div
                  onClick={() => setQuizMode(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                    borderRadius: 10, cursor: "pointer", marginTop: 4,
                    background: quizMode ? `${T.primary}10` : "transparent",
                    border: quizMode ? `1.5px solid ${T.primary}30` : `1.5px solid ${T.outlineVariant}15`,
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: quizSubmitted ? "#4CAF50" : quizMode ? T.primary : T.surfaceHigh,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {quizSubmitted ? <I name="check" size={12} color="white" /> :
                      <I name="award" size={12} color={quizMode ? "white" : T.outline} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: quizMode ? 700 : 500, color: quizMode ? T.primary : T.onSurface }}>Assessment</div>
                    <div style={{ fontSize: 10, color: T.outline }}>{content.quiz.length} questions</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Module Info */}
            <Card style={{ padding: 20, marginBottom: 16 }} hover={false}>
              <h4 style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Module Info</h4>
              {[
                { label: "CPD Hours", value: `${activeModule.cpd} verifiable hours`, icon: "award" },
                { label: "Duration", value: activeModule.dur, icon: "clock" },
                { label: "Type", value: activeModule.type, icon: "play" },
                { label: "Category", value: activeModule.cat, icon: "folder" },
                { label: "Priority", value: activeModule.status, icon: "shield" },
              ].map((info, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                  borderTop: i > 0 ? `1px solid ${T.outlineVariant}10` : "none",
                }}>
                  <I name={info.icon} size={14} color={T.outline} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.outline }}>{info.label}</span>
                    <div style={{ fontSize: 12, color: T.onSurface, marginTop: 1 }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </Card>

            {/* Quick Actions */}
            <BtnSecondary onClick={() => {}} style={{ width: "100%", justifyContent: "center", marginBottom: 8, fontSize: 12 }}>
              <I name="download" size={14} /> Download Resources
            </BtnSecondary>
            <BtnSecondary onClick={() => {}} style={{ width: "100%", justifyContent: "center", fontSize: 12 }}>
              <I name="bookmark" size={14} /> Save for Later
            </BtnSecondary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SearchBar placeholder="Search courses, compliance modules, or CPD records..." />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.primary, marginBottom: 4 }}>Educational Excellence</p>
          <h1 style={{ fontFamily: "Manrope", fontSize: 30, fontWeight: 800, color: T.onSurface, margin: 0 }}>Training Hub</h1>
          <p style={{ color: T.onSurfaceVariant, fontSize: 14, marginTop: 6, maxWidth: 500, lineHeight: 1.5 }}>
            Role-specific training, mandatory compliance, and clinical CPD — all mapped to GDC and CQC requirements.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name="Sarah Jenkins" size={36} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope" }}>Dr. Sarah Jenkins</div>
            <div style={{ fontSize: 11, color: T.onSurfaceVariant }}>Lead Clinician</div>
          </div>
        </div>
      </div>

      {/* Role Tabs */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 24, padding: 6,
        background: gradient, borderRadius: 14,
      }}>
        {roles.map(r => {
          const active = activeRole === r.id;
          const count = r.id === "all" ? modules.length : modules.filter(m => m.role === r.id).length;
          return (
            <button key={r.id} onClick={() => { setActiveRole(r.id); setExpandedModule(null); setShowAllModules(false); }} style={{
              flex: 1, padding: "12px 8px", borderRadius: 10, border: "none",
              cursor: "pointer", fontFamily: "Manrope", fontSize: 12, fontWeight: 700,
              background: active ? "rgba(255,255,255,0.95)" : "transparent",
              color: active ? T.primary : "rgba(255,255,255,0.8)",
              boxShadow: active ? "0 4px 12px rgba(0,0,0,0.15)" : "none", transition: "all 0.2s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <I name={r.icon} size={18} color={active ? T.primary : "rgba(255,255,255,0.7)"} />
              <span>{r.label}</span>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 99,
                background: active ? `${T.primary}12` : "rgba(255,255,255,0.15)",
                color: active ? T.primary : "rgba(255,255,255,0.9)",
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        <div>
          {/* Mandatory Compliance Tracker */}
          <Card style={{ padding: 28, marginBottom: 28 }} hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "Manrope", fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <I name="shield" size={18} /> Mandatory Compliance Tracker
              </h3>
              <Pill bg={`${T.error}15`} color={T.error}>{expiring.length} Actions Required</Pill>
            </div>
            {mandatory.slice(0, 5).map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 16px", background: T.surfaceLow, borderRadius: 12, marginBottom: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: c.pct === 100 ? "#4CAF5012" : c.pct > 0 ? "#FF980012" : `${T.primaryContainer}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {c.pct === 100 ? <I name="checkcircle" size={16} color="#4CAF50" /> :
                     c.pct > 0 ? <I name="clock" size={16} color="#FF9800" /> :
                     <I name="alert" size={16} color={T.error} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope" }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: T.onSurfaceVariant, marginTop: 2 }}>{c.cpd} CPD hrs • {c.type}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {c.pct > 0 && c.pct < 100 && <div style={{ width: 50 }}><ProgressBar pct={c.pct} color="#FF9800" h={4} /></div>}
                  <Pill bg={c.pct === 100 ? "#4CAF5015" : c.pct > 0 ? "#FF980015" : `${T.error}15`}
                    color={c.pct === 100 ? "#4CAF50" : c.pct > 0 ? "#FF9800" : T.error} small>
                    {c.pct === 100 ? "Compliant" : c.pct > 0 ? "In Progress" : "Due"}
                  </Pill>
                  <BtnSecondary onClick={() => { if (c.pct < 100) { setActiveModule(c); setActiveLesson(0); setQuizMode(false); setQuizAnswers({}); setQuizSubmitted(false); } }} style={{ padding: "6px 14px", fontSize: 11 }}>
                    {c.pct === 100 ? "Certificate" : c.pct > 0 ? "Continue" : "Start"}
                  </BtnSecondary>
                </div>
              </div>
            ))}
          </Card>

          {/* Clinical Skills Academy - Visual Course Cards */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Manrope", fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <I name="play" size={18} /> Clinical Skills Academy
              </h3>
              <a onClick={() => { setShowAllModules(true); setTimeout(() => document.getElementById("all-modules")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ fontSize: 13, color: T.primary, fontWeight: 600, cursor: "pointer" }}>View all {filteredModules.length} modules →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {featured.map((c, i) => {
                const gradients = [
                  "linear-gradient(135deg, #006974 0%, #004d55 100%)",
                  "linear-gradient(135deg, #005c66 0%, #003d44 100%)",
                  "linear-gradient(135deg, #007a88 0%, #005c66 100%)",
                ];
                return (
                  <Card key={i} style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => { setActiveModule(c); setActiveLesson(0); setQuizMode(false); setQuizAnswers({}); setQuizSubmitted(false); }}>
                    <div style={{
                      height: 130, background: gradients[i % 3], position: "relative",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <I name="tooth" size={40} color="rgba(255,255,255,0.15)" />
                      <div style={{
                        position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.5)",
                        color: "white", fontSize: 10, padding: "3px 8px", borderRadius: 6,
                      }}>{c.dur}</div>
                      <div style={{ position: "absolute", top: 10, left: 10 }}>
                        <Pill bg={`${typeColors[c.type] || T.primary}90`} color="white" small>{c.type}</Pill>
                      </div>
                    </div>
                    <div style={{ padding: 16 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.primary, marginBottom: 5 }}>{c.cat}</p>
                      <h4 style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginBottom: 5, lineHeight: 1.3 }}>{c.title}</h4>
                      <p style={{ fontSize: 11, color: T.onSurfaceVariant, lineHeight: 1.5 }}>{c.desc.slice(0, 80)}...</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                        <I name="award" size={12} color={T.primary} />
                        <span style={{ fontSize: 11, color: T.primary, fontWeight: 600 }}>{c.cpd} CPD Hours</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Full Module List (expandable) */}
          <Card id="all-modules" style={{ padding: 24, marginBottom: 28 }} hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "Manrope", fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <I name="book" size={18} /> All Training Modules
                <span style={{ fontSize: 12, fontWeight: 600, color: T.onSurfaceVariant, marginLeft: 4 }}>({filteredModules.length})</span>
              </h3>
              {filteredModules.length > 5 && (
                <a onClick={() => setShowAllModules(!showAllModules)} style={{
                  fontSize: 12, color: T.primary, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {showAllModules ? "Show less" : `Show all ${filteredModules.length}`}
                  <span style={{
                    display: "inline-block", transition: "transform 0.2s",
                    transform: showAllModules ? "rotate(180deg)" : "none", fontSize: 10,
                  }}>▾</span>
                </a>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(showAllModules ? filteredModules : filteredModules.slice(0, 5)).map(m => {
                const isExpanded = expandedModule === m.id;
                return (
                  <div key={m.id} style={{
                    background: T.surfaceLow, borderRadius: 12, overflow: "hidden",
                    border: isExpanded ? `1px solid ${T.primary}20` : "1px solid transparent",
                    transition: "all 0.2s",
                  }}>
                    <div onClick={() => setExpandedModule(isExpanded ? null : m.id)} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                      cursor: "pointer",
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: m.pct === 100 ? "#4CAF5012" : m.pct > 0 ? "#FF980012" : `${T.primary}08`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {m.pct === 100 ? <I name="checkcircle" size={15} color="#4CAF50" /> :
                         m.pct > 0 ? <span style={{ fontSize: 10, fontWeight: 800, color: "#FF9800" }}>{m.pct}%</span> :
                         <I name="play" size={14} color={T.outline} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.title}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
                          <Pill bg={`${statusColors[m.status]}12`} color={statusColors[m.status]} small>{m.status}</Pill>
                          <Pill bg={`${typeColors[m.type] || T.primary}12`} color={typeColors[m.type] || T.primary} small>{m.type}</Pill>
                          <span style={{ fontSize: 10, color: T.outline }}>{m.dur} • {m.cpd} CPD</span>
                        </div>
                      </div>
                      {m.pct > 0 && m.pct < 100 && <div style={{ width: 60 }}><ProgressBar pct={m.pct} h={3} color="#FF9800" /></div>}
                      <span style={{
                        fontSize: 11, color: T.outline, transition: "transform 0.2s",
                        transform: isExpanded ? "rotate(180deg)" : "none", display: "inline-block",
                      }}>▾</span>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${T.outlineVariant}10`, animation: "fadeSlideIn 0.25s ease" }}>
                        <p style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.7, margin: "14px 0" }}>{m.desc}</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          {m.pct === 100 ? (
                            <BtnSecondary style={{ padding: "8px 16px", fontSize: 11 }}><I name="file" size={13} /> View Certificate</BtnSecondary>
                          ) : (
                            <BtnPrimary onClick={(e) => { e.stopPropagation(); setActiveModule(m); setActiveLesson(0); setQuizMode(false); setQuizAnswers({}); setQuizSubmitted(false); }} style={{ padding: "8px 16px", fontSize: 11 }}><I name="play" size={13} /> {m.pct > 0 ? "Continue" : "Start Module"}</BtnPrimary>
                          )}
                          <BtnSecondary style={{ padding: "8px 14px", fontSize: 11 }}><I name="download" size={13} /> Resources</BtnSecondary>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!showAllModules && filteredModules.length > 5 && (
              <div onClick={() => { setShowAllModules(true); }} style={{
                marginTop: 12, padding: "14px 0", textAlign: "center", cursor: "pointer",
                borderTop: `1px solid ${T.outlineVariant}12`,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: T.primary, fontFamily: "Manrope",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  Show all {filteredModules.length} modules <I name="arrow" size={14} color={T.primary} />
                </span>
                <p style={{ fontSize: 11, color: T.onSurfaceVariant, marginTop: 4 }}>
                  {filteredModules.length - 5} more modules not shown
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* CPD Cycle Snapshot */}
          <div style={{
            background: gradient, borderRadius: 14, padding: 28, color: T.onPrimary, marginBottom: 20,
          }}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>CPD Cycle Snapshot</h3>
            <p style={{ fontSize: 12, opacity: 0.8 }}>Current cycle progress</p>
            <div style={{ margin: "20px 0" }}>
              <span style={{ fontFamily: "Manrope", fontSize: 48, fontWeight: 800 }}>{earnedCpd}</span>
              <span style={{ fontSize: 18, opacity: 0.7 }}> / {totalCpd} hrs</span>
            </div>
            <ProgressBar pct={totalCpd > 0 ? Math.round(earnedCpd / totalCpd * 100) : 0} color={T.primaryContainer} bg="rgba(255,255,255,0.2)" h={8} />
            <div style={{ marginTop: 20 }}>
              {[
                { label: "Completed", val: `${filteredModules.filter(m => m.pct === 100).length} modules` },
                { label: "In Progress", val: `${filteredModules.filter(m => m.pct > 0 && m.pct < 100).length} modules` },
                { label: "Not Started", val: `${filteredModules.filter(m => m.pct === 0).length} modules` },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{r.val}</span>
                </div>
              ))}
            </div>
            <BtnSecondary style={{ width: "100%", justifyContent: "center", marginTop: 20, background: "rgba(255,255,255,0.15)", color: "white" }}>Update Log</BtnSecondary>
          </div>

          {/* Compliance Summary */}
          <Card style={{ padding: 20, marginBottom: 16 }} hover={false}>
            <h4 style={{ fontFamily: "Manrope", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Compliance Summary</h4>
            {[
              { label: "Compliant", count: completed.length, color: "#4CAF50", icon: "checkcircle" },
              { label: "In Progress", count: inProgress.length, color: "#FF9800", icon: "clock" },
              { label: "Action Required", count: expiring.length, color: T.error, icon: "alert" },
            ].map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0", borderTop: i > 0 ? `1px solid ${T.outlineVariant}10` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <I name={s.icon} size={14} color={s.color} />
                  <span style={{ fontSize: 12, color: T.onSurfaceVariant }}>{s.label}</span>
                </div>
                <span style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 800, color: s.color }}>{s.count}</span>
              </div>
            ))}
          </Card>

          {/* Quick Actions */}
          {[
            { icon: "award", label: "View Certificates" },
            { icon: "download", label: "Export CPD Log" },
            { icon: "calendar", label: "Book Workshop" },
          ].map((a, i) => (
            <Card key={i} style={{ padding: "14px 18px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, background: `${T.primaryContainer}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><I name={a.icon} size={15} color={T.primary} /></div>
              <span style={{ fontFamily: "Manrope", fontSize: 12, fontWeight: 700 }}>{a.label}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── STAFF DIRECTORY ─── */
const StaffPage = () => {
  const [tab, setTab] = useState("All Staff");
  const [search, setSearch] = useState("");

  const featured = { name: "Dr. Sarah Jenkins", role: "Lead Orthodontist", qual: "MSc Orthodontics, GDC: 123456", bio: "Specializing in advanced Invisalign and digital dental transformations. Leading the clinical excellence program at our London flagship practice." };
  const staff = [
    { name: "Mark Thompson", role: "Practice Manager" },
    { name: "Elena Rossi", role: "Senior Hygienist" },
    { name: "Leo Vance", role: "Dental Surgeon", online: true },
    { name: "Jessica Wu", role: "Pediatric Dentist" },
  ];

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, background: T.surfaceContainer,
          borderRadius: 14, padding: "14px 20px", maxWidth: 600,
        }}>
          <I name="search" size={18} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search staff by name, role, or specialty..."
            style={{
              border: "none", outline: "none", background: "transparent", flex: 1,
              fontSize: 14, color: T.onSurface, fontFamily: "Inter",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontFamily: "Manrope", fontSize: 30, fontWeight: 800, color: T.onSurface, margin: 0 }}>Staff Directory</h1>
          <p style={{ color: T.onSurfaceVariant, fontSize: 14, marginTop: 4 }}>Connect with the Inspire Dental Group specialist team.</p>
        </div>
        <BtnSecondary><I name="settings" size={14} /> Advanced</BtnSecondary>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 24, marginBottom: 28, borderBottom: `2px solid ${T.surfaceHigh}` }}>
        {["All Staff", "By Practice", "By Role"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "12px 4px", background: "none", border: "none",
            borderBottom: tab === t ? `3px solid ${T.primary}` : "3px solid transparent",
            color: tab === t ? T.primary : T.onSurfaceVariant,
            fontFamily: "Manrope", fontSize: 14, fontWeight: tab === t ? 700 : 500,
            cursor: "pointer", marginBottom: -2,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div>
          {/* Featured */}
          <Card style={{ padding: 32, marginBottom: 28, display: "flex", gap: 32 }} hover={false}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 180, height: 220, borderRadius: 14, background: T.onSurface,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
              }}>
                <Avatar name={featured.name} size={100} />
              </div>
              <div style={{
                position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
                background: T.surfaceHighest, padding: "4px 14px", borderRadius: 99,
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Lead Orthodontist</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "Manrope", fontSize: 26, fontWeight: 800, margin: "0 0 4px" }}>{featured.name}</h2>
              <p style={{ fontSize: 13, fontWeight: 600, color: T.primary, marginBottom: 14 }}>{featured.qual}</p>
              <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.7, marginBottom: 20 }}>{featured.bio}</p>
              <div style={{ display: "flex", gap: 12 }}>
                <BtnSecondary><I name="mail" size={14} /> Message</BtnSecondary>
                <BtnSecondary><I name="person" size={14} /> View Profile</BtnSecondary>
              </div>
            </div>
          </Card>

          {/* Staff Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {filtered.map((s, i) => (
              <Card key={i} style={{ padding: 20, textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Avatar name={s.name} size={64} />
                  {s.online && <div style={{
                    position: "absolute", bottom: 2, right: 2, width: 12, height: 12,
                    borderRadius: "50%", background: "#4CAF50", border: `2px solid ${T.surfaceLowest}`,
                  }} />}
                </div>
                <h4 style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginTop: 12, marginBottom: 2 }}>{s.name}</h4>
                <p style={{ fontSize: 11, color: T.primary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 14 }}>{s.role}</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <BtnSecondary style={{ padding: "6px 14px", fontSize: 11 }}>Message</BtnSecondary>
                  <BtnSecondary style={{ padding: "6px 14px", fontSize: 11 }}>Profile</BtnSecondary>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* On Shift Today */}
        <div>
          <div style={{
            background: gradient, borderRadius: 14, padding: 28, color: T.onPrimary,
          }}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>On Shift Today</h3>
            <div style={{ display: "flex", marginBottom: 20 }}>
              {["SJ", "MT", "ER"].map((init, i) => (
                <Avatar key={i} name={init} size={32} bg="rgba(255,255,255,0.2)" />
              ))}
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
              }}>+12</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "18px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50" }} />
                <span style={{ fontSize: 12, opacity: 0.8 }}>Active Specialists</span>
              </div>
              <span style={{ fontFamily: "Manrope", fontSize: 28, fontWeight: 800 }}>24</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "18px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.primaryContainer }} />
                <span style={{ fontSize: 12, opacity: 0.8 }}>Available Rooms</span>
              </div>
              <span style={{ fontFamily: "Manrope", fontSize: 28, fontWeight: 800 }}>08</span>
            </div>
          </div>

          {/* Location */}
          <Card style={{ padding: 24, marginTop: 16, display: "flex", alignItems: "center", gap: 16 }} hover={false}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: T.surfaceLow,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><I name="building" size={22} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Manrope", fontSize: 15, fontWeight: 700 }}>London Flagship</div>
              <div style={{ fontSize: 12, color: T.onSurfaceVariant }}>42 Harley Street, Marylebone</div>
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            {[
              { val: "18", label: "Clinicians" },
              { val: "06", label: "Support Staff" },
              { val: "02", label: "Open Roles", highlight: true },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "14px 8px", borderRadius: 10,
                background: s.highlight ? `${T.primaryContainer}30` : T.surfaceLowest,
                border: s.highlight ? `2px solid ${T.primary}` : "none",
                boxShadow: s.highlight ? "none" : shadow,
              }}>
                <div style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800, color: s.highlight ? T.primary : T.onSurface }}>{s.val}</div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: T.onSurfaceVariant, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── MARKETING HUB ─── */
const MarketingPage = () => {
  const socials = [
    { tag: "National Smile Month", title: "Radiant Smiles Campaign", desc: "Educational content focusing on preventive care and routine check-ups f...", color: "#4CAF50" },
    { tag: "Limited Offer", title: "Summer Whitening Special", desc: "Promotional graphic for the 20% off laser whitening seasonal package.", color: T.primary },
    { tag: "Engagement", title: "New Patient Welcome", desc: "Welcoming our community with a tour of our clinical sanctuary and friendly staff.", color: T.error },
  ];

  return (
    <div>
      <SearchBar placeholder="Search brand assets, campaigns, or photography..." />
      <TopBar title="Marketing Hub" subtitle="Elevating the Inspire Dental Group brand, together." />

      {/* Brand Assets + Visual Standards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 320px", gap: 20, marginBottom: 32 }}>
        <Card style={{ padding: 28, gridColumn: "span 2" }} hover={false}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h3 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Brand Assets</h3>
              <p style={{ fontSize: 13, color: T.onSurfaceVariant }}>Access official Inspire Dental Group logos and identifiers.</p>
            </div>
            <BtnPrimary style={{ padding: "12px 20px", fontSize: 12 }}><I name="download" size={14} /> Download All (.ZIP)</BtnPrimary>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Primary Logo", bg: T.surfaceLowest },
              { label: "Icon Mark", bg: T.surfaceLowest },
              { label: "White Variant", bg: T.primary },
            ].map((l, i) => (
              <div key={i} style={{
                padding: 20, borderRadius: 12, background: l.bg, textAlign: "center",
                border: l.bg === T.surfaceLowest ? `1px solid ${T.outlineVariant}20` : "none",
                minHeight: 100, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 12,
              }}>
                <span style={{
                  fontFamily: "Manrope", fontSize: l.label === "Icon Mark" ? 28 : 16,
                  fontWeight: 800, color: l.bg === T.primary ? T.onPrimary : T.primary,
                  letterSpacing: "0.08em",
                }}>
                  {l.label === "Icon Mark" ? "I" : "INSPIRE\nDENTAL"}
                </span>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, color: l.bg === T.primary ? T.onPrimary : T.onSurfaceVariant }}>{l.label}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }} hover={false}>
          <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Visual Standards</h3>
          {[
            { icon: "palette", label: "Primary Teal", desc: `${T.primary} — Use for main headlines and primary CTAs` },
            { icon: "target", label: "Clear Space", desc: "Maintain a minimum margin of 'I' height around the logo" },
            { icon: "shield", label: "Don'ts", desc: "Never stretch, rotate, or recolor the brand marks." },
          ].map((v, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: T.surfaceLow,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}><I name={v.icon} size={16} /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope" }}>{v.label}</div>
                <div style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.5 }}>{v.desc}</div>
              </div>
            </div>
          ))}
          <BtnSecondary style={{ width: "100%", justifyContent: "center" }}>View Full Brand Book</BtnSecondary>
        </Card>
      </div>

      {/* Ready-to-Post Socials */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Ready-to-Post Socials</h3>
            <p style={{ fontSize: 13, color: T.onSurfaceVariant }}>Fresh content for Instagram, Facebook, and LinkedIn.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }}>New Content</BtnSecondary>
            <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }}>Campaigns</BtnSecondary>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {socials.map((s, i) => (
            <Card key={i} style={{ overflow: "hidden" }}>
              <div style={{
                height: 180, background: gradient, position: "relative",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                padding: 16,
              }}>
                <Pill bg={s.color} color="white" small>{s.tag}</Pill>
                <I name="tooth" size={60} color="rgba(255,255,255,0.12)" />
              </div>
              <div style={{ padding: 20 }}>
                <h4 style={{ fontFamily: "Manrope", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.5, marginBottom: 16 }}>{s.desc}</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <BtnPrimary style={{ padding: "8px 16px", fontSize: 12 }}><I name="download" size={12} /> Download</BtnPrimary>
                  <BtnSecondary style={{ padding: "8px 16px", fontSize: 12 }}><I name="edit" size={12} /> Caption</BtnSecondary>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Team & Clinic Photography */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 700 }}>Team & Clinic Photography</h3>
          <a style={{ fontSize: 13, color: T.primary, fontWeight: 600, cursor: "pointer" }}>Request Custom Shoot →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "120px 120px", gap: 10 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: `hsl(${180 + i * 15}, 30%, ${75 - i * 5}%)`,
              borderRadius: 12, gridRow: i === 0 ? "span 2" : "auto",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "opacity 0.2s",
            }}>
              <I name="camera" size={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── HR HUB ─── */
const HrPage = () => {
  const policies = [
    { name: "Maternity & Paternity", updated: "Updated Aug 2023" },
    { name: "Health & Safety", updated: "Updated Jan 2024" },
    { name: "Clinical Standards", updated: "Updated May 2023" },
    { name: "Disciplinary Code", updated: "Updated Dec 2023" },
    { name: "Expenses Policy", updated: "Updated Feb 2024" },
  ];

  const perks = [
    { label: "Private Medical", bg: T.tertiaryContainer, color: T.onTertiaryContainer },
    { label: "Gym Membership", bg: T.secondaryContainer, color: T.secondary },
    { label: "Cycle to Work", bg: `${T.primaryContainer}`, color: T.primary },
    { label: "+4 More", bg: T.surfaceHighest, color: T.outline },
  ];

  const quickLinks = [
    { icon: "file", title: "Request a Referral", desc: "Fast-track clinical referrals for specialized cases through our internal hub.", tint: T.primary },
    { icon: "heart", title: "Mental Wellbeing", desc: "Confidential support and resources to help you maintain a healthy work-life balance.", tint: T.secondary },
    { icon: "creditcard", title: "Payslip Portal", desc: "Securely view and download your monthly salary statements and tax documents.", tint: T.onTertiaryContainer },
  ];

  return (
    <div>
      <SearchBar placeholder="Search HR policies, documents, or staff..." />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Manrope", fontSize: 30, fontWeight: 800, color: T.onSurface, margin: 0 }}>HR Hub</h1>
          <p style={{ color: T.onSurfaceVariant, fontSize: 14, marginTop: 6, maxWidth: 520, lineHeight: 1.5 }}>
            Your central sanctuary for career management, employment records, and practice wellness.
          </p>
        </div>
        <BtnPrimary style={{ flexShrink: 0 }}>
          <I name="plus" size={16} color={T.onPrimary} /> Request Time Off
        </BtnPrimary>
      </div>

      {/* Top Bento Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 340px", gap: 20, marginBottom: 24 }}>
        {/* Employment Summary */}
        <Card style={{ padding: 28 }} hover={false}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <I name="briefcase" size={16} color={T.primary} />
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.outline }}>Employment Summary</span>
          </div>
          <h3 style={{ fontFamily: "Manrope", fontSize: 24, fontWeight: 800, color: T.onSurface, lineHeight: 1.2, marginBottom: 20 }}>
            Senior Clinical Associate
          </h3>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
            background: T.surfaceLow, borderRadius: 12, marginBottom: 12,
          }}>
            <I name="calendar" size={16} color={T.outline} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>Join Date</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Manrope", color: T.onSurface }}>October 14th, 2021</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: "14px 16px", background: T.surfaceLow, borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>Contract</div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope", marginTop: 4 }}>Full-Time (Permanent)</div>
            </div>
            <div style={{ padding: "14px 16px", background: T.surfaceLow, borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>Location</div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Manrope", marginTop: 4 }}>Harley St. Clinic</div>
            </div>
          </div>
        </Card>

        {/* Annual Leave Balance */}
        <Card style={{
          padding: 28, background: gradient, color: T.onPrimary,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", position: "relative", overflow: "hidden",
        }} hover={false}>
          <div style={{
            position: "absolute", bottom: -30, right: -30, opacity: 0.08,
          }}>
            <I name="umbrella" size={160} color="white" />
          </div>
          <div style={{
            fontFamily: "Manrope", fontSize: 64, fontWeight: 800, lineHeight: 1,
            position: "relative", zIndex: 1,
          }}>12</div>
          <div style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            marginTop: 8, opacity: 0.85, position: "relative", zIndex: 1,
          }}>Days Left</div>
          <div style={{
            fontSize: 13, marginTop: 12, opacity: 0.7, position: "relative", zIndex: 1,
          }}>Annual Leave Balance</div>
        </Card>

        {/* HR Policy Library */}
        <Card style={{ padding: 24, display: "flex", flexDirection: "column" }} hover={false}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <I name="shield" size={16} color={T.primary} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.outline }}>HR Policy Library</span>
            </div>
            <a style={{ fontSize: 12, fontWeight: 700, color: T.primary, cursor: "pointer" }}>See All</a>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
            {policies.map((p, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", background: T.surfaceLowest, borderRadius: 12,
                cursor: "pointer", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = `${T.primaryContainer}40`}
                onMouseLeave={e => e.currentTarget.style.background = T.surfaceLowest}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.onSurface }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: T.onSurfaceVariant, marginTop: 2 }}>{p.updated}</div>
                </div>
                <I name="download" size={16} color={T.outline} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Middle Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Career Growth */}
        <Card style={{ padding: 28 }} hover={false}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <I name="chart" size={16} color={T.primary} />
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.outline }}>Career Growth</span>
          </div>
          <h3 style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Path to Specialist</h3>
          <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.6, marginBottom: 20 }}>
            You've completed 85% of your mandatory certifications for the year. Keep it up!
          </p>
          <ProgressBar pct={85} h={8} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>Status</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.primary }}>85% Complete</span>
          </div>
          <BtnOutline onClick={() => {}} style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
            View PDP Plan
          </BtnOutline>
        </Card>

        {/* Staff Perks */}
        <Card style={{ overflow: "hidden" }} hover={false}>
          <div style={{
            height: 140, background: gradient, position: "relative",
            display: "flex", alignItems: "flex-end", padding: 24,
          }}>
            <div style={{ position: "absolute", top: 16, right: 20, opacity: 0.15 }}>
              <I name="gift" size={80} color="white" />
            </div>
            <h3 style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 800, color: T.onPrimary, position: "relative", zIndex: 1 }}>
              Your Staff Perks
            </h3>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {perks.map((p, i) => (
                <Pill key={i} bg={p.bg} color={p.color} small>{p.label}</Pill>
              ))}
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingTop: 16, borderTop: `1px solid ${T.outlineVariant}15`,
            }}>
              <div style={{ display: "flex" }}>
                {["AB", "CD", "EF"].map((init, i) => (
                  <Avatar key={i} name={init} size={28} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: T.onSurfaceVariant }}>12 others used perks this week</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Quick Links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {quickLinks.map((q, i) => (
          <Card key={i} style={{ padding: 28, cursor: "pointer" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: `${q.tint}10`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 18,
            }}>
              <I name={q.icon} size={22} color={q.tint} />
            </div>
            <h4 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{q.title}</h4>
            <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.6 }}>{q.desc}</p>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.outlineVariant}15`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.outline }}>
          © 2024 Inspire Dental Group Ltd.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms of Employment", "Support Hub"].map((l, i) => (
            <a key={i} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.outline, cursor: "pointer" }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── CPD TRACKER ─── */
const CpdPage = () => {
  const mandatory = [
    { name: "Medical Emergencies", done: true },
    { name: "Radiography", done: false, due: "DUE SEP '24" },
    { name: "Disinfection & Decon.", done: true },
    { name: "Legal & Ethical", done: true },
    { name: "Safeguarding", done: true },
  ];

  const activityMix = [
    { label: "Clinical Skill", pct: 45 },
    { label: "Patient Care", pct: 30 },
    { label: "Compliance", pct: 25 },
  ];

  const recentActivity = [
    { title: "Endodontic Masterclass", date: "12 Oct 2023", hours: "6.0", verified: true, icon: "tooth", bg: T.tertiaryContainer },
    { title: "Annual ILS Training", date: "05 Sep 2023", hours: "3.5", verified: true, icon: "shield", bg: T.secondaryContainer },
    { title: "Reading: Modern Composites", date: "15 Aug 2023", hours: "1.5", verified: false, icon: "book", bg: T.surfaceContainer },
  ];

  const bottomActions = [
    { icon: "clouddownload", title: "Export GDC Statement", desc: "PDF, CSV, or direct upload" },
    { icon: "calendar", title: "Recommended Courses", desc: "Based on your clinical focus" },
    { icon: "help", title: "GDC Guidance Hub", desc: "Enhanced CPD requirements" },
  ];

  return (
    <div>
      <SearchBar placeholder="Search CPD activities, courses, or compliance records..." />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Manrope", fontSize: 30, fontWeight: 800, color: T.onSurface, margin: 0 }}>CPD Tracker Hub</h1>
          <p style={{ color: T.onSurfaceVariant, fontSize: 14, marginTop: 6, maxWidth: 520, lineHeight: 1.5 }}>
            Manage your GDC continuous professional development cycle, mandatory training, and clinical reflections in one sanctuary.
          </p>
        </div>
        <BtnPrimary style={{ flexShrink: 0 }}>
          <I name="plus" size={16} color={T.onPrimary} /> Log New Activity
        </BtnPrimary>
      </div>

      {/* GDC Cycle Card + Mandatory Topics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 24 }}>
        {/* GDC Cycle */}
        <Card style={{ padding: 32 }} hover={false}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800 }}>GDC Cycle 2021-2026</h3>
            <Pill bg={`#4CAF5018`} color="#4CAF50">On Track</Pill>
          </div>
          <p style={{ fontSize: 13, color: T.onSurfaceVariant, marginBottom: 28 }}>2.5 Years remaining in current 5-year cycle</p>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginBottom: 24 }}>
            <div>
              <span style={{ fontFamily: "Manrope", fontSize: 52, fontWeight: 800, color: T.primary, lineHeight: 1 }}>68.5</span>
              <span style={{ fontSize: 18, color: T.onSurfaceVariant, fontWeight: 600 }}> / 100</span>
              <div style={{ fontSize: 13, color: T.onSurfaceVariant, marginTop: 4 }}>hrs</div>
            </div>
            <div style={{ textAlign: "center", padding: "0 16px" }}>
              <div style={{ fontFamily: "Manrope", fontSize: 24, fontWeight: 800 }}>68%</div>
              <div style={{ fontSize: 11, color: T.onSurfaceVariant, fontWeight: 600 }}>Complete</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ padding: "14px 20px", background: T.surfaceLow, borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline, marginBottom: 4 }}>Verified</div>
                <div style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800 }}>54.0</div>
              </div>
              <div style={{ padding: "14px 20px", background: T.surfaceLow, borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline, marginBottom: 4 }}>Unverified</div>
                <div style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800 }}>14.5</div>
              </div>
            </div>
          </div>

          {/* Stacked progress bar */}
          <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", background: T.surfaceHigh }}>
            <div style={{ width: "54%", background: T.primary, borderRadius: "99px 0 0 99px" }} />
            <div style={{ width: "14%", background: `${T.primary}50` }} />
          </div>
        </Card>

        {/* Mandatory Topics */}
        <Card style={{ padding: 28 }} hover={false}>
          <h3 style={{ fontFamily: "Manrope", fontSize: 17, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <I name="checkcircle" size={18} color={T.primary} /> Mandatory Topics
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mandatory.map((m, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                opacity: m.done ? 1 : 0.6,
              }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                {m.done ? (
                  <I name="checkcircle" size={20} color={T.primary} />
                ) : (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "4px 8px",
                    background: T.surfaceHighest, borderRadius: 6, color: T.onSurface,
                  }}>{m.due}</span>
                )}
              </div>
            ))}
          </div>
          <a style={{
            display: "flex", alignItems: "center", gap: 4, fontSize: 13,
            fontWeight: 700, color: T.primary, marginTop: 24, cursor: "pointer",
          }}>
            View Compliance Audit <I name="arrow" size={14} color={T.primary} />
          </a>
        </Card>
      </div>

      {/* Middle Row: Activity Mix + Recent Activity + Weekly Reflection */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 280px", gap: 20, marginBottom: 24 }}>
        {/* Activity Mix */}
        <Card style={{ padding: 24 }} hover={false}>
          <h4 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.onSurfaceVariant, marginBottom: 24 }}>
            Activity Mix
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {activityMix.map((a, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <span>{a.label}</span>
                  <span>{a.pct}%</span>
                </div>
                <ProgressBar pct={a.pct} h={4} bg={`${T.primary}20`} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card style={{ padding: 28 }} hover={false}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700 }}>Recent Activity</h3>
            <a style={{ fontSize: 13, fontWeight: 700, color: T.primary, cursor: "pointer" }}>View All</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                borderRadius: 12, cursor: "pointer", transition: "background 0.2s",
                opacity: a.verified ? 1 : 0.65,
              }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceLow}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: a.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <I name={a.icon} size={18} color={T.onTertiaryContainer} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: T.onSurfaceVariant, fontWeight: 600, textTransform: "uppercase", marginTop: 2 }}>
                    {a.date} • {a.hours} Hours {a.verified ? "Verified" : "Unverified"}
                  </div>
                </div>
                <I name="file" size={16} color={T.outline} />
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Reflection */}
        <div style={{
          background: gradient, borderRadius: 14, padding: 28,
          color: T.onPrimary, display: "flex", flexDirection: "column",
          justifyContent: "flex-end", position: "relative", overflow: "hidden",
          minHeight: 300,
        }}>
          <div style={{
            position: "absolute", inset: 0, background: `${T.primary}90`,
            backdropFilter: "blur(4px)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <I name="lightbulb" size={28} color={T.onPrimary} />
            <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, margin: "16px 0 8px" }}>Weekly Reflection</h3>
            <p style={{ fontSize: 12, opacity: 0.9, fontStyle: "italic", lineHeight: 1.6, marginBottom: 20 }}>
              "How did today's clinical challenges influence your approach to patient communication?"
            </p>
            <button onClick={() => {}} style={{
              width: "100%", padding: "14px 20px", background: T.surfaceLowest,
              color: T.primary, border: "none", borderRadius: 12, fontFamily: "Manrope",
              fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "transform 0.15s",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}>
              Write Reflection
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {bottomActions.map((a, i) => (
          <Card key={i} style={{
            padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: T.surfaceContainer,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <I name={a.icon} size={18} color={T.primary} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: T.onSurfaceVariant }}>{a.desc}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ─── ADMIN PORTAL ─── */
const AdminPage = () => {
  const sections = [
    { id: "clinical", label: "Clinical Resources", icon: "clinical", color: T.primary },
    { id: "staff", label: "Staff Directory", icon: "staff", color: T.secondary },
    { id: "marketing", label: "Marketing Hub", icon: "marketing", color: T.onTertiaryContainer },
    { id: "training", label: "Training Hub", icon: "training", color: "#4CAF50" },
    { id: "cpd", label: "CPD Tracker", icon: "chart", color: "#FF9800" },
  ];

  const [activeSection, setActiveSection] = useState("clinical");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadSection, setUploadSection] = useState("clinical");

  const [docs, setDocs] = useState([
    // Clinical Resources
    { id: 1, name: "Infection Control Policy v3.2", section: "clinical", status: "approved", uploadedBy: "Dr. Sarah Jenkins", date: "2024-01-15", size: "2.4 MB", type: "PDF", approvedBy: "Mark Thompson", approvedDate: "2024-01-16", version: "3.2", downloads: 47 },
    { id: 2, name: "Emergency Drug Dosage Chart", section: "clinical", status: "approved", uploadedBy: "Dr. Alexander Chen", date: "2024-01-08", size: "890 KB", type: "PDF", approvedBy: "Dr. Sarah Jenkins", approvedDate: "2024-01-09", version: "5.1", downloads: 112 },
    { id: 3, name: "Radiography Audit Checklist", section: "clinical", status: "in_review", uploadedBy: "Dr. Maya Patel", date: "2024-02-25", size: "1.8 MB", type: "PDF", reviewer: "Dr. Sarah Jenkins", version: "4.0", downloads: 0 },
    { id: 4, name: "Sedation Monitoring Standards", section: "clinical", status: "pending", uploadedBy: "Leo Vance", date: "2024-02-22", size: "1.2 MB", type: "PDF", version: "2.0", downloads: 0 },
    { id: 5, name: "Endodontic Irrigation Protocol", section: "clinical", status: "approved", uploadedBy: "Dr. Maya Patel", date: "2024-01-20", size: "640 KB", type: "PDF", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-01-21", version: "3.0", downloads: 38 },
    // Staff Directory
    { id: 6, name: "Staff Onboarding Checklist 2024", section: "staff", status: "approved", uploadedBy: "Elena Rossi", date: "2024-02-01", size: "1.1 MB", type: "DOCX", approvedBy: "Mark Thompson", approvedDate: "2024-02-02", version: "1.0", downloads: 24 },
    { id: 7, name: "Organisation Chart - Q1 2024", section: "staff", status: "approved", uploadedBy: "Mark Thompson", date: "2024-01-10", size: "420 KB", type: "PDF", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-01-11", version: "2.1", downloads: 56 },
    { id: 8, name: "New Starter Bio Template", section: "staff", status: "pending", uploadedBy: "Jessica Wu", date: "2024-02-28", size: "280 KB", type: "DOCX", version: "1.0", downloads: 0 },
    { id: 9, name: "Team Photo Guidelines", section: "staff", status: "approved", uploadedBy: "Elena Rossi", date: "2024-01-05", size: "350 KB", type: "PDF", approvedBy: "Mark Thompson", approvedDate: "2024-01-06", version: "1.2", downloads: 15 },
    // Marketing Hub
    { id: 10, name: "Brand Guidelines - Summer Campaign", section: "marketing", status: "rejected", uploadedBy: "Jessica Wu", date: "2024-02-18", size: "5.7 MB", type: "PDF", rejectedBy: "Mark Thompson", rejectedReason: "Logo usage on pg.4 doesn't meet brand standards.", version: "1.0", downloads: 0 },
    { id: 11, name: "Social Media Template Pack", section: "marketing", status: "approved", uploadedBy: "Jessica Wu", date: "2024-01-25", size: "12.4 MB", type: "ZIP", approvedBy: "Mark Thompson", approvedDate: "2024-01-26", version: "3.0", downloads: 31 },
    { id: 12, name: "Patient Testimonial Release Form", section: "marketing", status: "approved", uploadedBy: "Elena Rossi", date: "2024-01-12", size: "180 KB", type: "DOCX", approvedBy: "Mark Thompson", approvedDate: "2024-01-13", version: "2.1", downloads: 22 },
    { id: 13, name: "Whitening Campaign Assets", section: "marketing", status: "in_review", uploadedBy: "Jessica Wu", date: "2024-02-26", size: "8.3 MB", type: "ZIP", reviewer: "Mark Thompson", version: "1.0", downloads: 0 },
    // Training Hub
    { id: 14, name: "CPR Refresher Slides 2024", section: "training", status: "approved", uploadedBy: "Dr. Alexander Chen", date: "2024-01-18", size: "4.2 MB", type: "PPTX", approvedBy: "Dr. Sarah Jenkins", approvedDate: "2024-01-19", version: "6.0", downloads: 67 },
    { id: 15, name: "Safeguarding Level 2 Certificate Template", section: "training", status: "pending", uploadedBy: "Leo Vance", date: "2024-02-22", size: "340 KB", type: "DOCX", version: "2.0", downloads: 0 },
    { id: 16, name: "Infection Control E-Learning Module", section: "training", status: "approved", uploadedBy: "Dr. Sarah Jenkins", date: "2024-02-05", size: "18.6 MB", type: "ZIP", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-02-06", version: "4.1", downloads: 89 },
    { id: 17, name: "New Composite Technique Masterclass", section: "training", status: "approved", uploadedBy: "Dr. Maya Patel", date: "2024-02-10", size: "2.8 MB", type: "PDF", approvedBy: "Dr. Sarah Jenkins", approvedDate: "2024-02-11", version: "1.0", downloads: 43 },
    // CPD Tracker
    { id: 18, name: "GDC CPD Requirements 2024 Guide", section: "cpd", status: "approved", uploadedBy: "Dr. Sarah Jenkins", date: "2024-01-02", size: "1.6 MB", type: "PDF", approvedBy: "Dr. Alexander Chen", approvedDate: "2024-01-03", version: "2.0", downloads: 74 },
    { id: 19, name: "CPD Activity Log Template", section: "cpd", status: "approved", uploadedBy: "Elena Rossi", date: "2024-01-08", size: "220 KB", type: "XLSX", approvedBy: "Mark Thompson", approvedDate: "2024-01-09", version: "3.2", downloads: 52 },
    { id: 20, name: "Reflective Practice Worksheet", section: "cpd", status: "pending", uploadedBy: "Dr. Maya Patel", date: "2024-02-27", size: "380 KB", type: "DOCX", version: "1.0", downloads: 0 },
    { id: 21, name: "Enhanced CPD Compliance Checklist", section: "cpd", status: "in_review", uploadedBy: "Leo Vance", date: "2024-02-24", size: "290 KB", type: "PDF", reviewer: "Dr. Sarah Jenkins", version: "1.5", downloads: 0 },
  ]);

  const statusConfig = {
    approved: { label: "Approved", color: "#4CAF50", icon: "checkcircle" },
    pending: { label: "Pending", color: "#FF9800", icon: "clock3" },
    in_review: { label: "In Review", color: T.primary, icon: "eye" },
    rejected: { label: "Rejected", color: T.error, icon: "xcircle" },
  };

  const sectionDocs = docs.filter(d => d.section === activeSection);
  const filtered = sectionDocs.filter(d => {
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    return true;
  });

  const sectionStats = {
    total: sectionDocs.length,
    approved: sectionDocs.filter(d => d.status === "approved").length,
    pending: sectionDocs.filter(d => d.status === "pending" || d.status === "in_review").length,
    rejected: sectionDocs.filter(d => d.status === "rejected").length,
  };

  const handleApprove = (id) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: "approved", approvedBy: "Dr. Alexander Chen", approvedDate: new Date().toISOString().split("T")[0] } : d));
    setSelectedDoc(null);
  };

  const handleReject = (id) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: "rejected", rejectedBy: "Dr. Alexander Chen", rejectedReason: "Needs revision — see comments." } : d));
    setSelectedDoc(null);
  };

  const handleDelete = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    setSelectedDoc(null);
  };

  const currentSection = sections.find(s => s.id === activeSection);

  /* Upload Modal */
  const UploadModal = () => {
    const [dragOver, setDragOver] = useState(false);
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
      }} onClick={() => setShowUpload(false)}>
        <div onClick={e => e.stopPropagation()} style={{
          background: T.surfaceLowest, borderRadius: 20, padding: 36, width: 520,
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800 }}>Upload Document</h2>
            <div onClick={() => setShowUpload(false)} style={{ cursor: "pointer" }}><I name="xcircle" size={22} color={T.outline} /></div>
          </div>

          {/* Target section */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.onSurfaceVariant, display: "block", marginBottom: 8 }}>Upload to Section</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sections.map(s => (
                <button key={s.id} onClick={() => setUploadSection(s.id)} style={{
                  padding: "8px 16px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
                  border: "none", cursor: "pointer", fontFamily: "Inter",
                  background: uploadSection === s.id ? s.color : T.surfaceContainer,
                  color: uploadSection === s.id ? "white" : T.onSurfaceVariant,
                  transition: "all 0.2s",
                }}>
                  <I name={s.icon} size={13} color={uploadSection === s.id ? "white" : T.onSurfaceVariant} /> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            style={{
              border: `2px dashed ${dragOver ? T.primary : T.outlineVariant}`,
              borderRadius: 16, padding: "36px 24px", textAlign: "center",
              background: dragOver ? `${T.primaryContainer}20` : T.surfaceLow,
              transition: "all 0.2s", marginBottom: 20, cursor: "pointer",
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: "50%", background: `${T.primaryContainer}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              <I name="cloud" size={24} color={T.primary} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, fontFamily: "Manrope", marginBottom: 4 }}>Drag & drop files here</p>
            <p style={{ fontSize: 12, color: T.onSurfaceVariant }}>
              or <span style={{ color: T.primary, fontWeight: 600, cursor: "pointer" }}>browse from your device</span>
            </p>
            <p style={{ fontSize: 11, color: T.outlineVariant, marginTop: 10 }}>PDF, DOCX, XLSX, PPTX, ZIP up to 25MB</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.onSurfaceVariant, display: "block", marginBottom: 6 }}>Description</label>
            <textarea rows={2} placeholder="Brief description of the document..." style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: `1px solid ${T.outlineVariant}33`, background: T.surfaceLowest,
              fontSize: 13, fontFamily: "Inter", outline: "none", resize: "vertical",
              color: T.onSurface, boxSizing: "border-box",
            }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 14px", background: `${T.primaryContainer}20`, borderRadius: 10 }}>
            <I name="shieldalert" size={16} color={T.primary} />
            <span style={{ fontSize: 12, color: T.onSurfaceVariant }}>Documents require approval before they become visible to staff.</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <BtnPrimary onClick={() => setShowUpload(false)} style={{ flex: 1, justifyContent: "center" }}>
              <I name="upload" size={16} color={T.onPrimary} /> Upload & Submit for Review
            </BtnPrimary>
            <BtnSecondary onClick={() => setShowUpload(false)} style={{ padding: "14px 20px" }}>Cancel</BtnSecondary>
          </div>
        </div>
      </div>
    );
  };

  /* Document Detail Panel */
  const DetailPanel = ({ doc }) => {
    const sc = statusConfig[doc.status];
    return (
      <div style={{
        position: "fixed", right: 0, top: 0, width: 420, height: "100vh",
        background: T.surfaceLowest, boxShadow: "-8px 0 32px rgba(0,0,0,0.1)",
        zIndex: 100, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "28px 28px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 700 }}>Document Details</h3>
            <div onClick={() => setSelectedDoc(null)} style={{ cursor: "pointer" }}><I name="xcircle" size={20} color={T.outline} /></div>
          </div>
          <div style={{
            height: 120, background: T.surfaceLow, borderRadius: 14,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
          }}>
            <I name="file" size={32} color={T.outline} />
            <span style={{ fontSize: 11, color: T.outline, marginTop: 6, fontWeight: 600 }}>{doc.type} • {doc.size}</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 28px 28px" }}>
          <h4 style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{doc.name}</h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <Pill bg={`${sc.color}15`} color={sc.color} small>{sc.label}</Pill>
            <Pill bg={T.surfaceHighest} color={T.onSurface} small>v{doc.version}</Pill>
            <Pill bg={`${currentSection.color}12`} color={currentSection.color} small>{currentSection.label}</Pill>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Uploaded by", value: doc.uploadedBy, icon: "person" },
              { label: "Upload date", value: doc.date, icon: "calendar" },
              { label: "File size", value: doc.size, icon: "file" },
              { label: "Downloads", value: doc.downloads.toString(), icon: "download" },
              doc.approvedBy && { label: "Approved by", value: `${doc.approvedBy} (${doc.approvedDate})`, icon: "checkcircle" },
              doc.reviewer && { label: "Reviewing", value: doc.reviewer, icon: "eye" },
              doc.rejectedBy && { label: "Rejected by", value: doc.rejectedBy, icon: "xcircle" },
            ].filter(Boolean).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <I name={m.icon} size={14} color={T.outline} />
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>{m.label}</span>
                  <div style={{ fontSize: 13, color: T.onSurface, marginTop: 1 }}>{m.value}</div>
                </div>
              </div>
            ))}
          </div>

          {doc.rejectedReason && (
            <div style={{
              padding: 14, background: `${T.error}08`, borderRadius: 10,
              borderLeft: `3px solid ${T.error}`, marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.error, marginBottom: 4 }}>Rejection Reason</div>
              <div style={{ fontSize: 12, color: T.onSurface, lineHeight: 1.5 }}>{doc.rejectedReason}</div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <BtnPrimary onClick={() => {}} style={{ width: "100%", justifyContent: "center" }}>
              <I name="download" size={16} color={T.onPrimary} /> Download
            </BtnPrimary>
            {(doc.status === "pending" || doc.status === "in_review") && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleApprove(doc.id)} style={{
                  flex: 1, padding: "12px 16px", background: "#4CAF5015", color: "#4CAF50",
                  border: `1.5px solid #4CAF5040`, borderRadius: 9999, fontFamily: "Manrope",
                  fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <I name="checkcircle" size={15} color="#4CAF50" /> Approve
                </button>
                <button onClick={() => handleReject(doc.id)} style={{
                  flex: 1, padding: "12px 16px", background: `${T.error}08`, color: T.error,
                  border: `1.5px solid ${T.error}40`, borderRadius: 9999, fontFamily: "Manrope",
                  fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <I name="xcircle" size={15} color={T.error} /> Reject
                </button>
              </div>
            )}
            <button onClick={() => handleDelete(doc.id)} style={{
              width: "100%", padding: "12px 16px", background: "transparent", color: T.error,
              border: "none", borderRadius: 9999, fontFamily: "Manrope",
              fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 6, opacity: 0.7,
            }}>
              <I name="trash" size={14} color={T.error} /> Delete Document
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {showUpload && <UploadModal />}
      {selectedDoc && <DetailPanel doc={selectedDoc} />}

      <SearchBar placeholder="Search documents across all sections..." />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Manrope", fontSize: 30, fontWeight: 800, color: T.onSurface, margin: 0 }}>Document Upload Centre</h1>
          <p style={{ color: T.onSurfaceVariant, fontSize: 14, marginTop: 6, maxWidth: 520, lineHeight: 1.5 }}>
            Manage documents, control approvals, and maintain the clinical knowledge base.
          </p>
        </div>
        <BtnPrimary onClick={() => { setUploadSection(activeSection); setShowUpload(true); }} style={{ flexShrink: 0 }}>
          <I name="upload" size={16} color={T.onPrimary} /> Upload Document
        </BtnPrimary>
      </div>

      {/* Section Tabs */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 24, padding: "6px",
        background: T.surfaceLow, borderRadius: 14, overflow: "hidden",
      }}>
        {sections.map(s => {
          const active = activeSection === s.id;
          const count = docs.filter(d => d.section === s.id).length;
          return (
            <button key={s.id} onClick={() => { setActiveSection(s.id); setFilterStatus("all"); }} style={{
              flex: 1, padding: "14px 12px", borderRadius: 10, border: "none",
              cursor: "pointer", fontFamily: "Manrope", fontSize: 12, fontWeight: 700,
              background: active ? T.surfaceLowest : "transparent",
              color: active ? s.color : T.onSurfaceVariant,
              boxShadow: active ? shadow : "none",
              transition: "all 0.2s", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4,
            }}>
              <I name={s.icon} size={18} color={active ? s.color : T.outlineVariant} />
              <span>{s.label}</span>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 99,
                background: active ? `${s.color}12` : T.surfaceHigh,
                color: active ? s.color : T.outline,
              }}>{count} docs</span>
            </button>
          );
        })}
      </div>

      {/* Section Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total", value: sectionStats.total, icon: "layers", color: currentSection.color },
          { label: "Approved", value: sectionStats.approved, icon: "checkcircle", color: "#4CAF50" },
          { label: "Pending", value: sectionStats.pending, icon: "clock3", color: "#FF9800" },
          { label: "Rejected", value: sectionStats.rejected, icon: "xcircle", color: T.error },
        ].map((s, i) => (
          <Card key={i} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }} hover={false}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: `${s.color}12`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <I name={s.icon} size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: T.onSurfaceVariant, fontWeight: 600 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Status Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "in_review", label: "In Review" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
            padding: "7px 16px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: "Inter",
            background: filterStatus === f.key ? currentSection.color : T.surfaceContainer,
            color: filterStatus === f.key ? "white" : T.onSurfaceVariant,
            transition: "all 0.2s",
          }}>{f.label}</button>
        ))}
      </div>

      {/* Document Table */}
      <Card style={{ overflow: "hidden" }} hover={false}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 0.7fr 0.5fr",
          padding: "12px 24px", background: T.surfaceLow, gap: 12,
        }}>
          {["Document", "Status", "Uploaded by", "Date", ""].map((h, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.outline }}>{h}</span>
          ))}
        </div>
        {filtered.map(doc => {
          const sc = statusConfig[doc.status];
          return (
            <div key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              style={{
                display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 0.7fr 0.5fr",
                padding: "14px 24px", gap: 12, alignItems: "center",
                borderBottom: `1px solid ${T.outlineVariant}12`, cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.surfaceLow}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, background: `${currentSection.color}10`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <I name="file" size={15} color={currentSection.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.onSurface }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: T.outlineVariant }}>{doc.type} • {doc.size}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <I name={sc.icon} size={14} color={sc.color} />
                <span style={{ fontSize: 12, fontWeight: 600, color: sc.color }}>{sc.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={doc.uploadedBy} size={22} />
                <span style={{ fontSize: 12, color: T.onSurfaceVariant }}>{doc.uploadedBy.split(" ").slice(0, 2).join(" ")}</span>
              </div>
              <span style={{ fontSize: 12, color: T.onSurfaceVariant }}>{doc.date}</span>
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                <div style={{ padding: 5, borderRadius: 6, cursor: "pointer", display: "flex" }}
                  onClick={e => e.stopPropagation()}
                ><I name="download" size={14} color={T.outline} /></div>
                <div style={{ padding: 5, borderRadius: 6, cursor: "pointer", display: "flex" }}
                  onClick={e => e.stopPropagation()}
                ><I name="more" size={14} color={T.outline} /></div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: T.onSurfaceVariant }}>
            <I name="file" size={28} color={T.outlineVariant} />
            <p style={{ marginTop: 10, fontSize: 13, fontWeight: 600 }}>No documents match your filters</p>
          </div>
        )}
      </Card>

      {/* Cloud Storage Footer */}
      <div style={{
        marginTop: 20, padding: "14px 24px", background: `${T.primaryContainer}15`,
        borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <I name="cloud" size={16} color={T.primary} />
          <span style={{ fontSize: 12, color: T.onSurfaceVariant }}>
            Cloud Storage: <span style={{ fontWeight: 700, color: T.onSurface }}>4.8 GB</span> of 50 GB used • AWS S3 (eu-west-2)
          </span>
        </div>
        <span style={{ fontSize: 11, color: T.onSurfaceVariant, display: "flex", alignItems: "center", gap: 4 }}>
          <I name="refresh" size={12} color={T.outline} /> Last synced: 2 mins ago
        </span>
      </div>
    </div>
  );
};

/* ─── REGISTRATION PAGE ─── */
const RegisterPage = ({ onNav }) => (
  <div style={{
    minHeight: "100vh", background: T.surface, display: "flex", flexDirection: "column",
    fontFamily: "Inter, sans-serif",
  }}>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
    {/* Top bar */}
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "20px 40px", borderBottom: `1px solid ${T.outlineVariant}12`,
    }}>
      <span style={{ fontFamily: "Manrope", fontSize: 20, fontWeight: 800, color: T.onSurface }}>Inspire Dental Group</span>
      <BtnSecondary onClick={() => onNav("login")} style={{ padding: "8px 20px", fontSize: 13 }}>Login</BtnSecondary>
    </div>

    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ width: "100%", maxWidth: 920 }}>
        <Pill bg={T.surfaceContainer} color={T.onSurfaceVariant}>Registration</Pill>
        <h1 style={{ fontFamily: "Manrope", fontSize: 36, fontWeight: 800, color: T.onSurface, margin: "16px 0 8px", lineHeight: 1.15 }}>
          Join with your email address
        </h1>
        <p style={{ fontSize: 14, color: T.onSurfaceVariant, maxWidth: 440, lineHeight: 1.6 }}>
          Create your professional profile to access the Inspire Dental Group clinical intranet and staff resources.
        </p>

        <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
          {/* Photo upload */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{
              width: 180, height: 200, borderRadius: 16, background: T.surfaceLow,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}>
              <I name="camera" size={32} color={T.outlineVariant} />
              <div style={{
                position: "absolute", bottom: 12, right: 12, width: 36, height: 36,
                borderRadius: "50%", background: gradient, display: "flex",
                alignItems: "center", justifyContent: "center", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,105,116,0.3)",
              }}>
                <I name="plus" size={18} color={T.onPrimary} />
              </div>
            </div>
            <p style={{ fontFamily: "Manrope", fontSize: 14, fontWeight: 700, marginTop: 14 }}>Profile Photo</p>
            <p style={{ fontSize: 12, color: T.onSurfaceVariant, maxWidth: 180, lineHeight: 1.4, marginTop: 4 }}>
              Please upload a clear professional headshot for clinical identification.
            </p>
          </div>

          {/* Form */}
          <Card style={{ flex: 1, padding: 32 }} hover={false}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Input label="Full Name" placeholder="Dr. Jane Smith" />
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.onSurfaceVariant, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Gender</label>
                <select style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12,
                  border: `1px solid ${T.outlineVariant}33`, background: T.surfaceLowest,
                  fontSize: 14, fontFamily: "Inter", outline: "none", color: T.onSurfaceVariant,
                  boxSizing: "border-box", marginBottom: 20,
                }}>
                  <option>Select gender</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                </select>
              </div>
              <Input label="Username" placeholder="jsmith_clinical" />
              <Input label="Password" type="password" placeholder="••••••••••••" icon={<I name="eye" size={14} />} />
              <Input label="Email Address" placeholder="jane.smith@inspiredental.co.uk" />
              <Input label="Date of Birth" type="date" />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 28, cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: T.primary, marginTop: 3 }} />
              <span style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.5 }}>
                I agree to the <span style={{ color: T.primary, fontWeight: 600 }}>Terms of Use</span> and acknowledge the <span style={{ color: T.primary, fontWeight: 600 }}>Clinical Data Handling Policy</span> regarding patient confidentiality.
              </span>
            </label>

            <BtnPrimary onClick={() => onNav("onboarding")} style={{ padding: "16px 32px", fontSize: 15 }}>
              Create & Complete Profile <I name="arrow" size={16} />
            </BtnPrimary>
          </Card>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{
      padding: "20px 40px", borderTop: `1px solid ${T.outlineVariant}12`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.outline }}>Inspire Dental Group</span>
      <div style={{ display: "flex", gap: 24 }}>
        {["Privacy Policy", "Terms of Service", "Clinical Standards"].map((l, i) => (
          <a key={i} style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline, cursor: "pointer" }}>{l}</a>
        ))}
      </div>
      <span style={{ fontSize: 11, color: T.outline }}>© 2024 Inspire Dental Group. All rights reserved.</span>
    </div>
  </div>
);

/* ─── ONBOARDING FLOW ─── */
const OnboardingPage = ({ onNav }) => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState(["Implantology", "Cosmetic"]);
  const [equipment, setEquipment] = useState(["iTero Scanners", "CBCT Imaging"]);

  const steps = [
    { num: 1, label: "Identity", icon: "person" },
    { num: 2, label: "Clinical Interests", icon: "clinical" },
    { num: 3, label: "Credentials", icon: "file" },
    { num: 4, label: "Verification", icon: "checkcircle" },
  ];

  const toggleItem = (item, list, setList) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const ChipToggle = ({ label, selected, onToggle }) => (
    <button onClick={onToggle} style={{
      padding: "10px 20px", borderRadius: 9999, fontSize: 13, fontWeight: 600,
      border: selected ? `2px solid ${T.primary}` : `1.5px solid ${T.outlineVariant}40`,
      background: selected ? `${T.primaryContainer}30` : "transparent",
      color: selected ? T.primary : T.onSurface, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
      fontFamily: "Inter",
    }}>
      {label} {selected && <I name="checkcircle" size={14} color={T.primary} />}
    </button>
  );

  const CheckItem = ({ label, checked, onToggle }) => (
    <label style={{
      display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
      background: T.surfaceLowest, borderRadius: 10, cursor: "pointer",
      border: checked ? `1.5px solid ${T.primary}40` : `1.5px solid ${T.outlineVariant}20`,
      transition: "all 0.2s",
    }}>
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ accentColor: T.primary, width: 16, height: 16 }} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
    </label>
  );

  /* Step 1: Identity */
  const Step1 = () => (
    <div>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ maxWidth: 280 }}>
          <h2 style={{ fontFamily: "Manrope", fontSize: 24, fontWeight: 800, color: T.primary, marginBottom: 12 }}>Basic Info</h2>
          <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.6 }}>
            Start by introducing yourself to the group. Your professional bio helps colleagues find you for internal referrals and collaborative clinical cases.
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
            <div style={{ textAlign: "center" }}>
              <Avatar name="Dr. Alistair Sterling" size={90} />
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.outline, marginTop: 8 }}>Upload Photo</p>
            </div>
            <div style={{ flex: 1 }}>
              <Input label="Full Name" placeholder="e.g. Dr. Alistair Sterling" />
              <Input label="Professional Title" placeholder="Associate Dentist (Clinical Lead)" />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.onSurfaceVariant, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Professional Clinical Bio</label>
            <textarea rows={4} placeholder="Briefly describe your clinical background, years of experience, and patient philosophy..." style={{
              width: "100%", padding: "14px 16px", borderRadius: 12,
              border: `1px solid ${T.outlineVariant}33`, background: T.surfaceLowest,
              fontSize: 14, fontFamily: "Inter", outline: "none", resize: "vertical",
              color: T.onSurface, boxSizing: "border-box",
            }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Card style={{ padding: 20 }} hover={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <I name="building" size={16} color={T.primary} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.primary }}>Primary Site</span>
              </div>
              <select style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: `1px solid ${T.outlineVariant}33`, background: T.surfaceLowest,
                fontSize: 13, fontFamily: "Inter", outline: "none", color: T.onSurface,
              }}>
                <option>Select practice...</option><option>London Flagship - Harley St</option>
                <option>Canary Wharf Clinic</option><option>Bristol South West Hub</option>
              </select>
            </Card>
            <Card style={{ padding: 20 }} hover={false}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <I name="briefcase" size={16} color={T.primary} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.primary }}>Clinical Role</span>
              </div>
              <select style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: `1px solid ${T.outlineVariant}33`, background: T.surfaceLowest,
                fontSize: 13, fontFamily: "Inter", outline: "none", color: T.onSurface,
              }}>
                <option>Select role...</option><option>Associate Dentist</option>
                <option>Hygienist</option><option>Nurse</option><option>Practice Manager</option>
              </select>
            </Card>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.onSurfaceVariant, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Clinical Interests (Select All That Apply)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Endodontics", "Implantology", "Cosmetic Dentistry", "Pediatric Care", "Practice Growth", "Digital Radiography"].map(c => (
                <ChipToggle key={c} label={c} selected={interests.includes(c)} onToggle={() => toggleItem(c, interests, setInterests)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* Step 2: Clinical Interests */
  const Step2 = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        <Card style={{ padding: 28 }} hover={false}>
          <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <I name="clinical" size={18} color={T.primary} /> Clinical Focus Areas
          </h3>
          <p style={{ fontSize: 13, color: T.onSurfaceVariant, marginBottom: 20, lineHeight: 1.5 }}>
            Select the disciplines you wish to prioritize in your clinical rotation.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Implantology", "Orthodontics", "Cosmetic", "Pedodontics", "Endodontics", "Periodontics", "Oral Surgery", "Digital Dentistry"].map(d => (
              <ChipToggle key={d} label={d} selected={interests.includes(d)} onToggle={() => toggleItem(d, interests, setInterests)} />
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }} hover={false}>
          <h3 style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <I name="star" size={16} color={T.primary} /> Special Interests
          </h3>
          <p style={{ fontSize: 12, color: T.onSurfaceVariant, marginBottom: 16, lineHeight: 1.5 }}>
            Do you have specific areas of study or niche skills like sleep apnea therapy or sedation?
          </p>
          <textarea rows={5} placeholder="Describe your niche interests..." style={{
            width: "100%", padding: "14px 16px", borderRadius: 12,
            border: `1px solid ${T.outlineVariant}33`, background: T.surfaceLowest,
            fontSize: 13, fontFamily: "Inter", outline: "none", resize: "vertical",
            color: T.onSurface, boxSizing: "border-box",
          }} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        <Card style={{ padding: 28, background: T.surfaceLow }} hover={false}>
          <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <I name="monitor" size={18} color={T.primary} /> Preferred Clinical Equipment
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {["iTero Scanners", "3Shape TRIOS", "CBCT Imaging", "CEREC Systems"].map(eq => (
              <CheckItem key={eq} label={eq} checked={equipment.includes(eq)} onToggle={() => toggleItem(eq, equipment, setEquipment)} />
            ))}
          </div>
        </Card>

        <div style={{
          borderRadius: 14, background: gradient, padding: 28, color: T.onPrimary,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          position: "relative", overflow: "hidden", minHeight: 200,
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.08 }}>
            <I name="tooth" size={160} color="white" />
          </div>
          <p style={{ fontSize: 15, fontStyle: "italic", fontWeight: 600, lineHeight: 1.5, position: "relative", zIndex: 1 }}>
            "Delivering excellence through precision and care."
          </p>
          <span style={{ fontSize: 12, opacity: 0.7, marginTop: 8, position: "relative", zIndex: 1 }}>— Inspire Dental Standards</span>
        </div>
      </div>
    </div>
  );

  /* Step 3: Clinical Compliance */
  const Step3 = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <Card style={{ padding: 32 }} hover={false}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: `${T.primaryContainer}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <I name="upload" size={22} color={T.primary} />
            </div>
            <Pill bg={`${T.error}12`} color={T.error}>Upload Required</Pill>
          </div>
          <h3 style={{ fontFamily: "Manrope", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>GDC Certificate</h3>
          <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.6, marginBottom: 24 }}>
            Your General Dental Council registration certificate must be current and clearly show your registration number and specialty status.
          </p>
          <div style={{
            border: `2px dashed ${T.outlineVariant}50`, borderRadius: 16, padding: "40px 24px",
            textAlign: "center", background: T.surfaceLow, cursor: "pointer",
          }}>
            <I name="cloud" size={28} color={T.outlineVariant} />
            <p style={{ fontSize: 14, fontWeight: 600, marginTop: 12 }}>Drag and drop your PDF here</p>
            <p style={{ fontSize: 12, color: T.outlineVariant, marginTop: 4 }}>Maximum file size: 10MB</p>
            <BtnSecondary style={{ marginTop: 14 }}>Select File</BtnSecondary>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 24 }} hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: `${T.primaryContainer}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <I name="shield" size={18} color={T.primary} />
              </div>
              <Pill bg={`#FF980015`} color="#FF9800">Pending</Pill>
            </div>
            <h4 style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Indemnity Insurance</h4>
            <p style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.5, marginBottom: 14 }}>
              Verification of your current professional indemnity cover.
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
              background: T.surfaceLow, borderRadius: 10,
            }}>
              <I name="checkcircle" size={14} color={T.primary} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>indemnity_2024.pdf</span>
            </div>
          </Card>

          <Card style={{ padding: 24 }} hover={false}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: `${T.error}08`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <I name="alert" size={18} color={T.error} />
              </div>
              <Pill bg={`${T.error}12`} color={T.error}>Missing</Pill>
            </div>
            <h4 style={{ fontFamily: "Manrope", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>DBS Check</h4>
            <p style={{ fontSize: 12, color: T.onSurfaceVariant, lineHeight: 1.5, marginBottom: 14 }}>
              Enhanced Disclosure and Barring Service certificate issued within 3 years.
            </p>
            <BtnOutline style={{ width: "100%", justifyContent: "center", padding: "10px 16px", fontSize: 12 }}>Start Upload</BtnOutline>
          </Card>
        </div>
      </div>

      {/* System health & timeline */}
      <div style={{
        marginTop: 24, padding: "16px 24px", background: `${T.primaryContainer}15`,
        borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 12,
      }}>
        <I name="dot" size={16} color={T.primary} />
        <div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Verification Timeline</span>
          <p style={{ fontSize: 12, color: T.onSurfaceVariant, marginTop: 4, lineHeight: 1.5 }}>
            Once uploaded, our clinical compliance team typically verifies credentials within 48 business hours. You will receive an automated notification via your practice email once approved.
          </p>
        </div>
      </div>
    </div>
  );

  /* Step 4: Review & Launch */
  const Step4 = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Profile Strength */}
        <Card style={{ padding: 32, textAlign: "center" }} hover={false}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%", border: `4px solid ${T.primary}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <span style={{ fontFamily: "Manrope", fontSize: 36, fontWeight: 800, color: T.primary }}>100%</span>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.onSurfaceVariant }}>Strength</span>
          </div>
          <h3 style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Ready for Clinic</h3>
          <p style={{ fontSize: 13, color: T.onSurfaceVariant, lineHeight: 1.5 }}>
            Your professional profile is fully verified and ready for the intranet.
          </p>
        </Card>

        {/* Summary cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }} hover={false}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${T.primaryContainer}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="briefcase" size={18} color={T.primary} />
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>Placement Details</span>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>Senior Associate Dentist</div>
              <div style={{ fontSize: 12, color: T.onSurfaceVariant }}>Canary Wharf Clinic</div>
            </div>
          </Card>

          <Card style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }} hover={false}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${T.primaryContainer}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="bookmark" size={18} color={T.primary} />
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>Focus Areas</span>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                {["Endodontics", "Implantology", "Cosmetic Bonding"].map(f => (
                  <Pill key={f} bg={T.surfaceHighest} color={T.onSurface} small>{f}</Pill>
                ))}
              </div>
            </div>
          </Card>

          <Card style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }} hover={false}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${T.primaryContainer}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I name="checksquare" size={18} color={T.primary} />
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: T.outline }}>Verified Documents</span>
              <p style={{ fontSize: 12, color: T.onSurfaceVariant, marginTop: 4, lineHeight: 1.5 }}>
                GDC Registration, Indemnity Certificate, and DBS clearance have been processed successfully.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Welcome banner */}
      <div style={{
        background: gradient, borderRadius: 16, padding: "32px 36px", color: T.onPrimary,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.06 }}>
          <I name="tooth" size={200} color="white" />
        </div>
        <p style={{ fontSize: 18, fontStyle: "italic", fontWeight: 600, position: "relative", zIndex: 1, maxWidth: 480, lineHeight: 1.4 }}>
          "Welcome to the team. Your clinical sanctuary awaits."
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)",
          padding: "8px 16px", borderRadius: 99, position: "relative", zIndex: 1,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50" }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Systems Online</span>
        </div>
      </div>
    </div>
  );

  const stepContent = { 1: <Step1 />, 2: <Step2 />, 3: <Step3 />, 4: <Step4 /> };
  const stepTitles = ["", "Identity", "Practice & Clinical Interests", "Clinical Compliance", "Review & Launch"];
  const stepStages = ["", "Stage One", "Stage Two", "Stage Three", "Final Step"];

  return (
    <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "Inter, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      {/* Header */}
      <div style={{ textAlign: "center", padding: "28px 40px 0" }}>
        <div style={{ fontFamily: "Manrope", fontSize: 18, fontWeight: 800, color: T.onSurface }}>Inspire Dental Group</div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: T.primary, marginTop: 2 }}>Clinical Sanctuary</div>
        <p style={{ fontSize: 14, color: T.onSurfaceVariant, marginTop: 12 }}>Welcome to the Clinical Sanctuary. Let's set up your profile.</p>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 8, padding: "20px 40px 0", maxWidth: 800, margin: "0 auto" }}>
        {steps.map((s) => (
          <div key={s.num} style={{ flex: 1 }}>
            <div style={{
              height: 4, borderRadius: 99,
              background: s.num <= step ? T.primary : T.surfaceHigh,
              transition: "background 0.4s",
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              color: s.num === step ? T.primary : T.outline, marginTop: 6, display: "block",
            }}>Step {s.num}: {s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px" }}>
        {/* Content */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.primary }}>{stepStages[step]}</span>
            <h1 style={{ fontFamily: "Manrope", fontSize: 28, fontWeight: 800, margin: "6px 0", color: T.onSurface }}>{stepTitles[step]}</h1>
          </div>
          {stepContent[step]}
        </div>
      </div>

      {/* Footer nav */}
      <div style={{
        padding: "24px 40px", maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: `1px solid ${T.outlineVariant}12`,
      }}>
        {step > 1 ? (
          <BtnSecondary onClick={() => setStep(step - 1)}>
            <I name="arrow" size={14} color={T.onSurface} style={{ transform: "rotate(180deg)" }} /> Previous Step
          </BtnSecondary>
        ) : (
          <span style={{ fontSize: 13, color: T.outline, cursor: "pointer" }} onClick={() => onNav("dashboard")}>Save & Go to Dashboard</span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {step < 4 && (
            <span style={{ fontSize: 12, color: T.outline }}>Next up: <strong>{steps[step]?.label}</strong></span>
          )}
          {step < 4 ? (
            <BtnPrimary onClick={() => setStep(step + 1)}>
              Next Step <I name="arrow" size={16} />
            </BtnPrimary>
          ) : (
            <BtnPrimary onClick={() => onNav("dashboard")} style={{ padding: "16px 32px", fontSize: 15 }}>
              Finish & Go to Dashboard <I name="arrow" size={16} />
            </BtnPrimary>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN APP ─── */
export default function App() {
  const [page, setPage] = useState("login");

  const pages = {
    dashboard: <DashboardPage />,
    clinical: <ClinicalPage />,
    training: <TrainingPage />,
    staff: <StaffPage />,
    marketing: <MarketingPage />,
    hr: <HrPage />,
    admin: <AdminPage />,
  };

  if (page === "login") return <LoginPage onNav={setPage} />;
  if (page === "register") return <RegisterPage onNav={setPage} />;
  if (page === "onboarding") return <OnboardingPage onNav={setPage} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.surface, fontFamily: "Inter, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <Sidebar current={page} onNav={setPage} />
      <main style={{ marginLeft: 240, flex: 1, padding: "32px 40px", maxWidth: 1200 }}>
        {pages[page] || <DashboardPage />}
      </main>
    </div>
  );
}
