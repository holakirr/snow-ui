import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../..";

type KBDProps = ComponentProps<"p"> & {
	keyBindings: string[];
	separator?: string;
};

const KBD = forwardRef<HTMLParagraphElement, KBDProps>(
	({ keyBindings, separator, className }, ref) => (
		<Text
			size={14}
			ref={ref}
			aria-keyshortcuts={keyBindings.join(separator || "")}
			className={twMerge("w-min text-black-20", className)}
			as="p"
		>
			{keyBindings.join(separator || "")}
		</Text>
	),
);

KBD.displayName = "KBD";
export { KBD };
