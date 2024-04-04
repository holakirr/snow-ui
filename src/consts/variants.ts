import type { ButtonVariant } from "../utils";

export const BUTTON_VARIANTS: { [K in ButtonVariant]: ButtonVariant } = {
	borderless: "borderless",
	gray: "gray",
	outline: "outline",
	filled: "filled",
} as const;
