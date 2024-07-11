import type { TextSize } from "../components";
import type { IconSize, SimpleSize, Size } from "../types";

export const SIMPLE_SIZES: { [K in SimpleSize]: K } = {
	sm: "sm",
	lg: "lg",
} as const;

export const SIZES: { [K in Size]: K } = {
	sm: "sm",
	md: "md",
	lg: "lg",
} as const;

export const TEXT_SIZES: { [K in Exclude<TextSize, null | undefined>]: K } = {
	default: "default",
	12: 12,
	14: 14,
	16: 16,
	18: 18,
	24: 24,
	32: 32,
	48: 48,
	64: 64,
} as const;

export const ICON_SIZES: { [K in IconSize]: K } = {
	16: 16,
	20: 20,
	24: 24,
	28: 28,
	32: 32,
	40: 40,
	48: 48,
	80: 80,
} as const;
