import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";

type SwitchProps = React.ComponentProps<"input">;

/**
 * Switch component for toggling between two states.
 */
const Switch = ({ id, className, ...props }: SwitchProps) => (
	<label
		htmlFor={id}
		className={twMerge(
			"group relative flex items-center bg-black-20 px-0.5 rounded-full w-7 h-4 cursor-pointer transition-all hover:bg-black-40 has-[:disabled]:bg-black-10 has-[:disabled]:cursor-not-allowed",
			"has-[:checked]:bg-primary-brand has-[:checked]:hover:bg-primary-brandHover",
			className,
		)}
	>
		<input
			id={id}
			role={ROLES.switch}
			type="checkbox"
			className="absolute opacity-0 cursor-pointer disabled:cursor-not-allowed"
			{...props}
		/>
		<span className="rounded-full w-3 h-3 bg-white-100 block transition-all group-has-[:checked]:ml-3" />
	</label>
);

Switch.displayName = "Switch";
export { Switch };
