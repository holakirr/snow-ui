import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Avatar, type AvatarProps } from ".";
import { Text } from "../..";

const AvatarName = forwardRef<HTMLDivElement, AvatarProps>(
	({ username, img, className, small = true }, ref) => (
		<div
			className={twMerge(
				"grid grid-flow-col-dense items-center gap-2",
				className,
			)}
			ref={ref}
		>
			<Avatar username={username} img={img} small={small} />
			<Text size={14} as="span">
				{username}
			</Text>
		</div>
	),
);

AvatarName.displayName = "AvatarName";
export { AvatarName };
