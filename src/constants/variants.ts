import type { ButtonVariant, SeparatorDirection } from "../types";

export const BUTTON_VARIANTS: { [K in ButtonVariant]: K } = {
	borderless: "borderless",
	gray: "gray",
	outline: "outline",
	filled: "filled",
} as const;

export const SEPARATOR_DIRECTIONS: { [K in SeparatorDirection]: K } = {
	horizontal: "horizontal",
	vertical: "vertical",
} as const;
