import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type LineProps = ComponentProps<"hr"> & VariantProps<typeof lineClasses>;

const lineClasses = cva(
	"border-solid border-black-100 border-1/2 rounded-full w-full transition-all",
	{
		variants: {
			direction: {
				horizontal: "",
				vertical: "rotate-90",
			},
		},
		defaultVariants: {
			direction: "horizontal",
		},
	},
);

const Line = forwardRef<HTMLHRElement, LineProps>(({ direction }, ref) => (
	<hr ref={ref} className={twMerge(lineClasses({ direction }))} />
));

Line.displayName = "Line";
export { Line };
