declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react'
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }
  
  export type LucideIcon = ComponentType<LucideProps>
  
  export const Home: LucideIcon
  export const Plus: LucideIcon
  export const Bell: LucideIcon
  export const BookOpen: LucideIcon
  export const Settings: LucideIcon
  export const CheckCircle: LucideIcon
  export const Trash2: LucideIcon
  export const Camera: LucideIcon
  export const Upload: LucideIcon
  export const X: LucideIcon
  export const RotateCw: LucideIcon
  export const Crop: LucideIcon
  export const ExternalLink: LucideIcon
  export const MapPin: LucideIcon
  export const Clock: LucideIcon
  export const Download: LucideIcon
  export const Edit2: LucideIcon
  export const Check: LucideIcon
  export const Scan: LucideIcon
  export const Edit: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const Search: LucideIcon
  export const TrendingUp: LucideIcon
  export const Recycle: LucideIcon
  export const AlertTriangle: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronRight: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const Circle: LucideIcon
  export const Dot: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronUp: LucideIcon
  export const PanelLeft: LucideIcon
  export const GripVertical: LucideIcon
  export const Package: LucideIcon
  export const StoreIcon: LucideIcon
  export const Store: LucideIcon
  export const Wifi: LucideIcon
  export const WifiOff: LucideIcon
  export const Calendar: LucideIcon
}
