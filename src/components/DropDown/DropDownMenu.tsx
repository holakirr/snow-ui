import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";

type DropDownMenuProps = React.ComponentProps<"menu">;

/**
 * DropDownMenu component displays a menu with a white background.
 */
const DropDownMenu = ({ className, ...props }: DropDownMenuProps) => (
	<menu
		className={twMerge(
			"rounded-2xl bg-white-80 flex flex-col p-2 border border-black-10 text-black-100 min-w-40",
			className,
		)}
		role={ROLES.menu}
		{...props}
	/>
);

DropDownMenu.displayName = "DropDownMenu";
export { DropDownMenu };
