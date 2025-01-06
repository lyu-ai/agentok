import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  FolderKanban,
  List,
  Plus,
  Image,
  X,
  Upload,
  Settings,
  User,
  LogOut,
  Sparkles,
  Zap,
  Filter,
  Save,
  AlertTriangle,
  Skull,
  Brain,
  Flame,
  Repeat,
  ShoppingBag,
  Check,
  Loader2,
  Trash2,
  MoreVertical,
  Edit,
  Inbox,
  MessageSquare,
  Shuffle,
  Compass,
  Send,
  Square,
  Bot,
  Copy,
  RefreshCw,
  Code,
  type LucideIcon,
  HardHat,
  Share2,
  EyeOff,
  Eye,
  Key,
  Home,
  GitFork,
  Heart,
  Code2,
  Hammer,
  Brackets,
  Braces,
  Download,
  Pin,
  PinOff,
  Menu,
  BadgeCheck,
  Grip,
  Users,
  Rocket,
  Notebook,
  Search,
  MessageCircleQuestion,
  Brush,
  ExternalLink,
  Megaphone,
  CheckCircle,
  Sun,
  Moon,
  Laptop,
  MessagesSquare,
  ChevronsUpDown,
  UserRound,
  Plane,
  SendHorizonal,
  SquareKanban,
  Kanban,
  SquareDot,
  CircleDot,
  Settings2,
  SquareTerminal,
  CircleCheck,
  StickyNote,
  LucideProps,
  Route,
  RotateCw,
  RotateCcw,
  Terminal,
  CornerDownLeft,
} from 'lucide-react';
import { Logo } from './logo';
import { ElementType } from 'react';

export type Icon = ElementType;

export const Icons: Record<string, ElementType> = {
  messageSquare: MessageSquare,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronUp: ChevronUp,
  chevronsUpDown: ChevronsUpDown,
  checkCircle: CircleCheck,
  externalLink: ExternalLink,
  console: SquareTerminal,
  sun: Sun,
  moon: Moon,
  laptop: Laptop,
  brush: Brush,
  megaphone: Megaphone,
  project: Route,
  list: List,
  question: MessageCircleQuestion,
  code: Code2,
  search: Search,
  rocket: Rocket,
  note: StickyNote,
  badgeCheck: BadgeCheck,
  draggable: Grip,
  add: Plus,
  braces: Braces,
  enter: CornerDownLeft,
  config: Settings2,
  menu: Menu,
  pin: Pin,
  unpin: PinOff,
  download: Download,
  refresh: RefreshCw,
  tool: Hammer,
  eye: Eye,
  eyeOff: EyeOff,
  image: Image,
  close: X,
  upload: Upload,
  settings: Settings,
  spy: HardHat,
  user: UserRound,
  logout: LogOut,
  logs: Terminal,
  sparkles: Sparkles,
  zap: Zap,
  filter: Filter,
  key: Key,
  save: Save,
  alert: AlertTriangle,
  share: Share2,
  skull: Skull,
  brain: Brain,
  fire: Flame,
  gitFork: GitFork,
  heart: Heart,
  exit: LogOut,
  group: Users,
  home: Home,
  swap3: Repeat,
  shoppingBag: ShoppingBag,
  spinner: Loader2,
  check: Check,
  trash: Trash2,
  more: MoreVertical,
  edit: Edit,
  inbox: Inbox,
  chat: MessagesSquare,
  shuffle: Shuffle,
  compass: Compass,
  send: SendHorizonal,
  stop: Square,
  robot: Bot,
  robotActive: Bot,
  reset: RotateCw,
  copy: Copy,
  reload: RefreshCw,
  codeBlock: Code,
  userVoiceLine: User,
  userVoiceFill: User,
  voiceprintLine: MessageSquare,
  github: ({ ...props }: any) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  python: ({ ...props }: any) => (
    <svg
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      {...props}
    >
      <path
        d="M378.026667 960.426667a103.253333 103.253333 0 0 1-87.893334-101.973334v-251.733333a126.72 126.72 0 0 1 126.72-126.72h189.44a62.805333 62.805333 0 0 0 62.72-62.72V165.973333a39.082667 39.082667 0 0 0-33.706666-38.826666 804.949333 804.949333 0 0 0-247.893334 0 39.893333 39.893333 0 0 0-33.706666 39.253333v156.586667a32.213333 32.213333 0 0 1-32 32 32.213333 32.213333 0 0 1-32-32V166.4a103.253333 103.253333 0 0 1 87.893333-101.973333 878.933333 878.933333 0 0 1 267.52 0 103.253333 103.253333 0 0 1 87.893333 101.973333v251.733333a126.72 126.72 0 0 1-126.72 126.72H416.853333a62.805333 62.805333 0 0 0-62.72 62.72v251.306667a39.082667 39.082667 0 0 0 33.706667 38.826667 804.949333 804.949333 0 0 0 247.893333 0 39.893333 39.893333 0 0 0 33.706667-39.253334v-156.586666a32 32 0 0 1 64 0v156.586666a103.253333 103.253333 0 0 1-87.893333 101.973334 871.466667 871.466667 0 0 1-133.546667 10.24 881.194667 881.194667 0 0 1-133.973333-10.24z"
        p-id="5414"
        fill="currentColor"
      ></path>
      <path
        d="M480 701.44a32.213333 32.213333 0 0 1 32-32h346.453333a39.082667 39.082667 0 0 0 38.826667-33.706667 804.949333 804.949333 0 0 0 0-247.893333 39.082667 39.082667 0 0 0-38.826667-33.706667h-156.586666a32.213333 32.213333 0 0 1-32-32 32.213333 32.213333 0 0 1 32-32h156.586666a103.253333 103.253333 0 0 1 101.973334 87.893334 878.933333 878.933333 0 0 1 0 267.52 103.253333 103.253333 0 0 1-101.973334 87.893333H512a32.213333 32.213333 0 0 1-32-32zM165.973333 733.44a103.253333 103.253333 0 0 1-101.973333-87.893333 878.933333 878.933333 0 0 1 0-267.52A103.253333 103.253333 0 0 1 165.973333 290.133333H512a32.213333 32.213333 0 0 1 32 32 32.213333 32.213333 0 0 1-32 32H165.546667a39.082667 39.082667 0 0 0-38.826667 33.706667 804.949333 804.949333 0 0 0 0 247.893333 39.082667 39.082667 0 0 0 38.826667 33.706667h156.586666a32.213333 32.213333 0 0 1 32 32 31.872 31.872 0 0 1-31.573333 32zM406.186667 203.52a35.797333 35.797333 0 0 1 34.56-34.133333 38.101333 38.101333 0 0 1 23.893333 9.386666 36.437333 36.437333 0 0 1 10.666667 24.746667 36.181333 36.181333 0 0 1-34.56 34.56 36.48 36.48 0 0 1-34.56-34.56zM548.693333 820.053333a36.181333 36.181333 0 0 1 34.56-34.56 38.058667 38.058667 0 0 1 23.893334 9.386667 36.437333 36.437333 0 0 1 10.666666 24.746667 36.906667 36.906667 0 0 1-34.56 34.986666 36.48 36.48 0 0 1-34.56-34.56z"
        p-id="5415"
        fill="currentColor"
      ></path>
    </svg>
  ),
  google: ({ ...props }: any) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
  ),
  openai: ({ ...props }: any) => (
    <svg
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4423"
      width="200"
      height="200"
      {...props}
    >
      <path
        d="M950.676 419.057a255.347 255.347 0 0 0-22.015-209.482A257.95 257.95 0 0 0 650.915 85.848a258.76 258.76 0 0 0-438.377 92.539A255.347 255.347 0 0 0 41.966 302.114a257.95 257.95 0 0 0 31.7 302.79 255.133 255.133 0 0 0 21.758 209.525 258.163 258.163 0 0 0 277.96 123.727 255.347 255.347 0 0 0 192.373 85.84 258.376 258.376 0 0 0 246.26-179.446 255.56 255.56 0 0 0 170.53-123.727 258.376 258.376 0 0 0-31.871-301.766zM565.757 957.013a190.966 190.966 0 0 1-122.703-44.37l6.016-3.456 203.893-117.67a33.918 33.918 0 0 0 16.725-29.054v-287.43l86.182 49.832a3.03 3.03 0 0 1 1.621 2.219v238.195a192.16 192.16 0 0 1-191.734 191.734zM153.62 780.98a190.71 190.71 0 0 1-22.826-128.59l6.058 3.626 204.065 117.71a32.894 32.894 0 0 0 33.278 0L623.482 629.99v99.494a3.413 3.413 0 0 1-1.408 2.645L415.578 851.206a191.99 191.99 0 0 1-261.96-70.226zM99.86 336.928a191.35 191.35 0 0 1 100.944-84.177v242.206a32.681 32.681 0 0 0 16.554 28.841l248.094 143.14-86.182 49.832a3.242 3.242 0 0 1-3.03 0L170.173 597.907a192.16 192.16 0 0 1-70.31-262.003zM807.963 501.4L559.102 356.895l85.968-49.661a3.242 3.242 0 0 1 3.03 0L854.169 426.31a191.734 191.734 0 0 1-28.841 345.796v-242.25a33.705 33.705 0 0 0-17.365-28.456z m85.756-128.975l-6.016-3.627-203.68-118.692a33.108 33.108 0 0 0-33.491 0L401.456 393.842v-99.536a2.816 2.816 0 0 1 1.195-2.602l206.07-118.906a191.99 191.99 0 0 1 284.998 198.816zM354.44 548.842l-86.182-49.661a3.413 3.413 0 0 1-1.621-2.432V259.236a191.99 191.99 0 0 1 314.65-147.32l-6.058 3.413-203.851 117.668a33.918 33.918 0 0 0-16.767 29.055z m46.803-100.901l111.013-63.997 111.226 63.997v127.95l-110.8 63.997-111.226-63.996z"
        p-id="4424"
        fill="currentColor"
      ></path>
    </svg>
  ),
  resize: ({ ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="yellowgreen"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  ),
  logo: Logo,
  logoSimple: ({ ...props }: any) => <Logo simple {...props} />,
  node: ({ ...props }: LucideProps) => (
    <svg
      fill="currentColor"
      viewBox="0 0 1024 1024"
      width="200"
      height="200"
      {...props}
    >
      <path
        d="M512 512a128 128 0 1 1-256 0 128 128 0 0 1 256 0z m-192 0a64 64 0 1 0 128 0 64 64 0 0 0-128 0zM512 512a128 128 0 1 0 256 0 128 128 0 0 0-256 0z m192 0a64 64 0 1 1-128 0 64 64 0 0 1 128 0zM544.64 720.085333a173.482667 173.482667 0 0 0 87.68-47.36l44.8 45.44A236.8 236.8 0 0 1 512 786.645333a240.768 240.768 0 0 1-90.88-18.56 233.088 233.088 0 0 1-76.16-50.56l44.8-45.44a173.525333 173.525333 0 0 0 154.88 47.36v0.64z"
        p-id="7746"
      ></path>
      <path
        d="M608 96a96 96 0 0 1-64 90.538667V192h160A192 192 0 0 1 896 384v64l64 64v128L896 704V768a192 192 0 0 1-192 192h-384A192 192 0 0 1 128 768v-64L64 640v-128L128 448V384a192 192 0 0 1 192-192h160v-5.461333a96 96 0 1 1 128-90.538667zM320 256a128 128 0 0 0-128 128v384a128 128 0 0 0 128 128h384a128 128 0 0 0 128-128V384a128 128 0 0 0-128-128h-384z"
        p-id="7747"
      ></path>
    </svg>
  ),
} as const;
