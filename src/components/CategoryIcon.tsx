import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Coffee,
  HeartPulse,
  GraduationCap,
  Home,
  HeartHandshake,
  Package,
  Briefcase,
  Store,
  Laptop,
  Gift,
  TrendingUp,
  Sparkles,
  Banknote,
  CreditCard,
  Smartphone,
  Wallet as WalletIcon,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Coffee,
  HeartPulse,
  GraduationCap,
  Home,
  HeartHandshake,
  Package,
  Briefcase,
  Store,
  Laptop,
  Gift,
  TrendingUp,
  Sparkles,
  Banknote,
  CreditCard,
  Smartphone,
  Wallet: WalletIcon,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  color?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-4 h-4',
  color,
  size,
}) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent className={className} style={{ color }} size={size} />;
};
