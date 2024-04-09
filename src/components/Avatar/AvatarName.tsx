import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Avatar, type AvatarProps } from ".";
import { Text } from "..";

const AvatarName = forwardRef<HTMLDivElement, AvatarProps>(
	({ username, img, className, small = true, color }, ref) => (
		<div
			className={twMerge(
				"grid grid-flow-col-dense items-center gap-2",
				className,
			)}
			ref={ref}
		>
			<Avatar username={username} img={img} small={small} color={color} />
			<Text size={14} as="span" className="text-black-100">
				{username}
			</Text>
		</div>
	),
);

AvatarName.displayName = "AvatarName";
export { AvatarName };
