import type { IconWeight } from "@phosphor-icons/react";

export const ICON_WEIGHTS: { [K in IconWeight]: IconWeight } = {
	bold: "bold",
	duotone: "duotone",
	fill: "fill",
	light: "light",
	regular: "regular",
	thin: "thin",
} as const;
