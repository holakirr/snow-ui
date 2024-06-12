import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";

const Card = ({ className, children, ref }: React.ComponentProps<"div">) => (
	<div
		ref={ref}
		className={twMerge("relative flex flex-col gap-2 p-6 rounded-2xl bg-primary-light", className)}
		role={ROLES.card}
	>
		{children}
	</div>
);

Card.displayName = "Card";
export { Card };
