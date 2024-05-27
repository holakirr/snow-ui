import { Avatar, type AvatarProps, Text } from "@components";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const AvatarName = forwardRef<HTMLDivElement, AvatarProps>(
	({ username, img, className, size = "sm", color }, ref) => (
		<div className={twMerge("grid grid-flow-col-dense items-center gap-2", className)} ref={ref}>
			<Avatar username={username} img={img} size={size} color={color} />
			<Text size={14} as="span" className="text-black-100">
				{username}
			</Text>
		</div>
	),
);

AvatarName.displayName = "AvatarName";
export { AvatarName };
