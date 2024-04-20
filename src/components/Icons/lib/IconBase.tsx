import type { IconBaseProps } from "@utils";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const CustomIconBase = forwardRef<SVGSVGElement, IconBaseProps>(
	(
		{
			alt,
			color = "currentColor",
			size,
			weight = "regular",
			weights,
			mirrored,
			className,
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
			style={{ transition: "all .15s" }}
			className={twMerge("aspect-square", className)}
			role="img"
			{...restProps}
		>
			<title>{alt}</title>
			{weights.get(weight) || weights.get("regular")}
		</svg>
	),
);
