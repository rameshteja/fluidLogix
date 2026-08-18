/**
 * Centralized Design System & Theme Tokens for FluidLogix.
 * 
 * To change branding, modify the variables in `src/app/globals.css`
 * or update the theme defaults below.
 */

export const THEME_COLORS = {
  // Brand Primary & Foreground
  primary: "#FFA500",
  primaryHover: "#FFB733",
  primaryActive: "#E69500",
  primaryForeground: "#071522",
  primaryMuted: "rgba(255, 165, 0, 0.12)",
  primaryBorder: "rgba(255, 165, 0, 0.25)",

  // Brand Navy & Backgrounds
  brandNavy: "#071522",
  brandNavyLight: "#0F1F30",
  brandNavyMuted: "#162234",

  // Accent & Status Colors
  accent: "#38BDF8",
  accentForeground: "#071522",
  success: "#10B981",
  destructive: "#EF4444",
  warning: "#F59E0B",
  info: "#38BDF8",

  // Charts
  chart1: "#FFA500",
  chart2: "#38BDF8",
  chart3: "#10B981",
  chart4: "#EF4444",
  chart5: "#A78BFA",
} as const;

export type ThemePreset = "amber" | "sky" | "emerald" | "indigo" | "crimson";

export interface ThemePresetConfig {
  id: ThemePreset;
  name: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  accent: string;
  preview: string;
}

export const THEME_PRESETS: ThemePresetConfig[] = [
  {
    id: "amber",
    name: "FluidLogix Amber (Default)",
    primary: "#FFA500",
    primaryHover: "#FFB733",
    primaryForeground: "#071522",
    accent: "#38BDF8",
    preview: "#FFA500",
  },
  {
    id: "sky",
    name: "Aero Sky Blue",
    primary: "#0284C7",
    primaryHover: "#38BDF8",
    primaryForeground: "#FFFFFF",
    accent: "#FFA500",
    preview: "#0284C7",
  },
  {
    id: "emerald",
    name: "Emerald Freight",
    primary: "#059669",
    primaryHover: "#10B981",
    primaryForeground: "#FFFFFF",
    accent: "#38BDF8",
    preview: "#059669",
  },
  {
    id: "indigo",
    name: "Royal Indigo",
    primary: "#6366F1",
    primaryHover: "#818CF8",
    primaryForeground: "#FFFFFF",
    accent: "#FFA500",
    preview: "#6366F1",
  },
  {
    id: "crimson",
    name: "Crimson Speed",
    primary: "#E11D48",
    primaryHover: "#F43F5E",
    primaryForeground: "#FFFFFF",
    accent: "#38BDF8",
    preview: "#E11D48",
  },
];
