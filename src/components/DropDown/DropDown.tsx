import { Children } from "react";
import { ROLES } from "../../constants";
import type { PopoverType } from "../../types";
import { Popover } from "../Popover";
import { PopoverContent } from "../Popover/PopoverContent";

/**
 * DropDown component is a wrapper around Popover component.
 * It is used to create a dropdown menu.
 * It should contain 2 children :
 * 1. The trigger element for the dropdown.
 * 2. The content of the dropdown.
 * @param visible - Whether the dropdown is visible or not.
 * @param position - Position of the dropdown.
 * @param children - Should contain 2 children.
 * @param props - Rest of the props are passed to the PopoverContent component.
 * @returns ReactNode
 * @example
 * ```tsx
 * <DropDown visible={true} position="bottom" className="w-48">
 * 	<Button label="Click me" />
 * 	<div className="flex flex-col gap-4">
 * 		<Button label="Option 1" />
 * 		<Button label="Option 2" />
 * 	</div>
 * </DropDown>
 * ```
 * */
type DropDownProps = PopoverType &
	React.ComponentProps<"div"> & {
		children: React.ReactNode[];
	};

const DropDown = ({ visible, position, children, ...props }: DropDownProps) => {
	const [trigger, content] = Children.toArray(children);

	return (
		<Popover visible={visible}>
			{trigger}
			<PopoverContent role={ROLES.dropdown} position={position} {...props}>
				{content}
			</PopoverContent>
		</Popover>
	);
};

DropDown.displayName = "DropDown";
export { DropDown };
