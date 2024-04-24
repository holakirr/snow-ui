import { ROLES } from "@constants";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Link = forwardRef<HTMLAnchorElement, ComponentProps<"a">>(
	({ className, ...props }, ref) => (
		<a
			ref={ref}
			className={twMerge(
				"cursor-pointer text-secondary-indigo hover:underline underline-offset-4 visited:text-secondary-purple transition-all",
				className,
			)}
			role={ROLES.link}
			{...props}
		/>
	),
);

Link.displayName = "Link";
export { Link };
