import { cva } from "class-variance-authority";
import { ROLES } from "../../constants";
import { Line } from "../Line";

const dropdownSectionClasses = cva("flex flex-col");

type DropDownSectionProps = React.ComponentProps<"ul"> & {
	showDivider?: boolean;
};

const DropDownSection = ({ showDivider, className, children, ...props }: DropDownSectionProps) => (
	<ul className={dropdownSectionClasses({ className })} role={ROLES.dropdownSection} {...props}>
		{children}
		{showDivider && <Line className="bg-black-5 my-2" />}
	</ul>
);

DropDownSection.displayName = "DropDownSection";
export { DropDownSection };
