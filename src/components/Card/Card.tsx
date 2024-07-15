import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";

/**
 * Card component displays a card with a shadow.
 */
const Card = ({ className, children, ref, ...props }: React.ComponentProps<"div">) => (
	<div
		ref={ref}
		className={twMerge("flex flex-col gap-2 p-6 rounded-2xl bg-primary-light", className)}
		role={ROLES.article}
		{...props}
	>
		{children}
	</div>
);

Card.displayName = "Card";
export { Card };
