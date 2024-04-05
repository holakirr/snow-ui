import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = ComponentProps<"div">;

const Card = forwardRef<HTMLDivElement, CardProps>(({ children }, ref) => (
	<div
		ref={ref}
		className={twMerge(
			"flex flex-col gap-2 px-6 py-6 rounded-2xl bg-primary-light",
		)}
	>
		{children}
	</div>
));

Card.displayName = "Card";
export { Card };
