import { twMerge } from "tailwind-merge";
import { ROLES, TEXT_SIZES } from "../../constants";
import { Text } from "../Text";

/**
 * Represents a keyboard component that displays key bindings.
 */
export type KBDProps = React.ComponentProps<"p"> & {
	/**
	 * An array of key bindings to be displayed.
	 */
	keyBindings: string[];
	/**
	 * The separator to be used between key bindings. Defaults to an empty string.
	 */
	separator?: string;
};

const KBD = ({ keyBindings, separator = "", className, ref }: KBDProps) => (
	<Text
		size={TEXT_SIZES[14]}
		ref={ref}
		as="kbd"
		role={ROLES.definition}
		aria-keyshortcuts={keyBindings.join(separator)}
		className={twMerge("w-min text-black-20", className)}
	>
		{keyBindings.join(separator || "")}
	</Text>
);

KBD.displayName = "KBD";
export { KBD };
