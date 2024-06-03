import { Text } from "@components";
import { ROLES } from "@constants";
import { twMerge } from "tailwind-merge";

export type KBDProps = React.ComponentProps<"p"> & {
	keyBindings: string[];
	separator?: string;
};

const KBD = ({ keyBindings, separator, className, ref }: KBDProps) => (
	<Text
		size={14}
		ref={ref}
		as="kbd"
		role={ROLES.kbd}
		aria-keyshortcuts={keyBindings.join(separator || "")}
		className={twMerge("w-min text-black-20", className)}
	>
		{keyBindings.join(separator || "")}
	</Text>
);

KBD.displayName = "KBD";
export { KBD };
