import { forwardRef } from "react";
import type { IconBaseProps } from "../types";

export const CustomIconBase = forwardRef<SVGSVGElement, IconBaseProps>(
	(
		{
			alt,
			color = "currentColor",
			size,
			weight = "regular",
			children,
			weights,
			mirrored,
			...restProps
		},
		ref,
	) => (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill={color}
			viewBox="0 0 32 32"
			transform={mirrored ? "scale(-1, 1)" : undefined}
			{...restProps}
		>
			<title>{alt}</title>
			{children}
			{weights.get(weight)}
		</svg>
	),
);
