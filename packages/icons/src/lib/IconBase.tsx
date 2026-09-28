import { ICON_SIZES } from "./constants";
import type { BaseIcon } from "./types";

export const IconBase: BaseIcon = ({
	alt,
	color = "currentColor",
	size = ICON_SIZES[24],
	weight = "regular",
	weights,
	mirrored,
	children,
	ref,
	style,
	...restProps
}) => {
	const isLabelled = Boolean(alt || restProps["aria-label"] || restProps["aria-labelledby"]);

	return (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill={color}
			viewBox="0 0 32 32"
			transform={mirrored ? "scale(-1, 1)" : undefined}
			style={{ transition: "all .15s", ...style }}
			role={isLabelled ? "img" : undefined}
			aria-hidden={isLabelled ? undefined : true}
			{...restProps}
		>
			{alt && <title>{alt}</title>}
			{children}
			{weights.get(weight) || weights.get("regular")}
		</svg>
	);
};
