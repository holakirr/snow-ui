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
			"group relative flex items-center justify-start bg-black-20 rounded-full w-7 h-4 cursor-pointer transition-all hover:bg-black-40 has-[:disabled]:bg-black-10 px-0.5",
			"has-[:checked]:justify-end has-[:checked]:bg-primary-brand has-[:checked]:hover:bg-primary-brandHover",
			className,
		)}
	>
		<input id={id} role={ROLES.switch} type="checkbox" className="absolute opacity-0" {...props} />
		<span className={twMerge("absolute rounded-full w-3 h-3 bg-white-100 block transition-all")} />
	</label>
);

Switch.displayName = "Switch";
export { Switch };
