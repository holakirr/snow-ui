import type { TextSize } from "@components";
import type { SimpleSize, Size } from "@types";

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
	12: 12,
	14: 14,
	18: 18,
	24: 24,
	48: 48,
	64: 64,
} as const;
