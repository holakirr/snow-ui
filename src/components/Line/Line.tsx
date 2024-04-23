import { ROLES } from "@constants";
import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type LineProps = ComponentProps<"hr"> & VariantProps<typeof lineClasses>;

const lineClasses = cva("border-none bg-black-100 rounded-full", {
	variants: {
		direction: {
			horizontal: "w-full h-px",
			vertical: "h-full w-px",
		},
	},
	defaultVariants: {
		direction: "horizontal",
	},
});

const Line = forwardRef<HTMLHRElement, LineProps>(
	({ direction, className }, ref) => (
		<hr
			ref={ref}
			className={twMerge(lineClasses({ direction, className }))}
			role={ROLES.line}
		/>
	),
);

Line.displayName = "Line";
export { Line };
