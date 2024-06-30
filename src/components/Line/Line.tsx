import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";

type LineProps = React.ComponentProps<"hr"> & VariantProps<typeof lineClasses>;

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

const Line = ({ direction, className, ref }: LineProps) => (
	<hr ref={ref} className={twMerge(lineClasses({ direction, className }))} role={ROLES.separator} />
);

Line.displayName = "Line";
export { Line };
