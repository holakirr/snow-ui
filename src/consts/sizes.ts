import type { SimpleSize, Size } from "@utils";

export const SIMPLE_SIZES: { [K in SimpleSize]: K } = {
	sm: "sm",
	lg: "lg",
} as const;

export const SIZES: { [K in Size]: K } = {
	...SIMPLE_SIZES,
	md: "md",
} as const;
