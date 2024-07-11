import { twMerge } from "tailwind-merge";
import { TEXT_SIZES } from "../../constants";
import { Avatar, type AvatarProps } from "../Avatar";
import { Text } from "../Text";

const User = ({ name, src, showFallback, className, size = "sm", color, ref }: AvatarProps) => (
	<div className={twMerge("grid grid-flow-col-dense items-center gap-2", className)} ref={ref}>
		<Avatar showFallback={showFallback} name={name} src={src} size={size} color={color} />
		<Text size={TEXT_SIZES[14]} as="span" className="text-black-100">
			{name}
		</Text>
	</div>
);

User.displayName = "User";
export { User };
