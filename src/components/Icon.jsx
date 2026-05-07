import {
  LayoutDashboard, Stethoscope, GraduationCap, Users, Megaphone,
  Settings, LogOut, Bell, Search, ArrowRight,
  User, Check, Star, Heart, Play,
  ShieldCheck, TrendingUp, Clock, FolderOpen, Download,
  Mail, Eye, Pencil, Plus, Flame,
  Award, BookOpen, Video, Building2,
  Camera, Palette, Handshake, Target,
  AlertTriangle, FileText, Monitor, Wifi,
  CircleDot, Sparkles, Zap, Send, ClipboardList,
  UserPlus, AtSign, Lock, ExternalLink, Hash,
  Briefcase, CalendarDays, Gift, CreditCard, Brain, Umbrella, Bike,
  HelpCircle, CloudDownload, BookMarked, CheckCircle, Lightbulb,
  Upload, Trash2, MoreVertical, Filter, ChevronDown, XCircle,
  CheckSquare, Clock3, Archive, RefreshCw, Cloud, FilePlus,
  UserCheck, ShieldAlert, BarChart3, Layers, Info, ChevronLeft, Phone,
} from "lucide-react";

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
  barchart: BarChart3, layers: Layers, info: Info, back: ChevronLeft, phone: Phone,
};

export const I = ({ name, size = 18, strokeWidth = 1.75, color }) => {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return <CircleDot size={size} strokeWidth={strokeWidth} />;
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      style={color ? { color } : undefined}
    />
  );
};
