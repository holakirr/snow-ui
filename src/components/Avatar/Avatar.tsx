import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { COLOR_SCHEME, Text } from "../..";

const avatarStyles = cva(
	"group brightness-100 hover:brightness-150 rounded-full transition-all overflow-hidden w-16 h-16 flex place-items-center justify-center",
	{
		variants: {
			small: {
				true: "w-6 h-6",
			},
		},
	},
);

const backgrounds = Object.keys(COLOR_SCHEME.secondary);

type AvatarProps = ComponentProps<"div"> &
	VariantProps<typeof avatarStyles> & {
		username: string;
		img?: string;
	};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
	({ small, img, username, className }) => {
		const randomColorNumber = Math.floor(Math.random() * backgrounds.length);
		const bg = `bg-secondary-${backgrounds[randomColorNumber]}`;
		return (
			<div className={twMerge(bg, avatarStyles({ small, className }))}>
				{img && (
					<img
						src="https://avatar.iran.liara.run/public"
						alt={username}
						className="w-full h-full transition-all group-hover:scale-125"
					/>
				)}
				{!img && (
					<Text
						as="span"
						className="group-hover:text-sm group-hover:font-semibold w-min cursor-default"
					>
						{username
							.split(" ")
							.map((word) => word[0])
							.join("")}
					</Text>
				)}
			</div>
		);
	},
);

Avatar.displayName = "Avatar";
export { Avatar };
