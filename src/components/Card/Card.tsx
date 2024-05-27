import { ROLES } from "@constants";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = ComponentProps<"div">;

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children }, ref) => (
	<div
		ref={ref}
		className={twMerge("relative flex flex-col gap-2 p-6 rounded-2xl bg-primary-light", className)}
		role={ROLES.card}
	>
		{children}
	</div>
));

Card.displayName = "Card";
export { Card };
