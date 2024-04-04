import type { Size } from "../utils";

export const SIZES: { [K in Size]: Size } = {
	sm: "sm",
	md: "md",
	lg: "lg",
} as const;
