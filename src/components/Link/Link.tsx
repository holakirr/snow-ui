import { ROLES } from "@constants";
import { twMerge } from "tailwind-merge";

const Link = ({ className, ref, ...props }: React.ComponentProps<"a">) => (
	<a
		ref={ref}
		className={twMerge(
			"cursor-pointer text-secondary-indigo hover:underline underline-offset-4 visited:text-secondary-purple transition-all",
			className,
		)}
		role={ROLES.link}
		{...props}
	/>
);

Link.displayName = "Link";
export { Link };
