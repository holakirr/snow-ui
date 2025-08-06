import { ICON_SIZES } from "./constants";
import type { BaseIcon } from "./types";

export const IconBase: BaseIcon = ({
	alt = "Icon",
	color = "currentColor",
	size = ICON_SIZES[24],
	weight = "regular",
	weights,
	mirrored,
	children,
	ref,
	...restProps
}) => (
	<svg
		ref={ref}
		xmlns="https://www.w3.org/TR/SVG2/"
		width={size}
		height={size}
		fill={color}
		stroke={color}
		viewBox="0 0 32 32"
		transform={mirrored ? "scale(-1, 1)" : undefined}
		style={{ transition: "all .15s" }}
		role="img"
		{...restProps}
	>
		<title>{alt}</title>
		{children}
		{weights.get(weight) || weights.get("regular")}
	</svg>
);
