import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "..";

const avatarStyles = cva(
	"group brightness-100 hover:brightness-150 rounded-full transition-all overflow-hidden w-16 h-16 aspect-square flex items-center justify-center",
	{
		variants: {
			small: {
				true: "w-6 h-6",
			},
			color: {
				secondary: "bg-secondary-brand",
				blue: "bg-secondary-blue",
				blueDarker: "bg-secondary-blueDarker",
				blueLighter: "bg-secondary-blueLighter",
				cyan: "bg-secondary-cyan",
				green: "bg-secondary-green",
				greenDarker: "bg-secondary-greenDarker",
				greenLighter: "bg-secondary-greenLighter",
				indigo: "bg-secondary-indigo",
				indigoDarker: "bg-secondary-indigoDarker",
				indigoLighter: "bg-secondary-indigoLighter",
				mint: "bg-secondary-mint",
				orange: "bg-secondary-orange",
				purple: "bg-secondary-purple",
				red: "bg-secondary-red",
				yellow: "bg-secondary-yellow",
				yellowDarker: "bg-secondary-yellowDarker",
				yellowLighter: "bg-secondary-yellowLighter",
			},
		},
		defaultVariants: {
			color: "orange",
			small: true,
		},
	},
);

export type AvatarProps = ComponentProps<"div"> &
	VariantProps<typeof avatarStyles> & {
		username: string;
		img?: string;
	};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
	({ small, img, username, color, className }, ref) => (
		<div
			className={twMerge(avatarStyles({ small, color, className }))}
			ref={ref}
		>
			{img && (
				<img
					src={img}
					alt={username}
					className="w-full h-full transition-all group-hover:scale-125"
				/>
			)}
			{!img && (
				<Text
					as="span"
					className="group-hover:text-sm group-hover:font-semibold w-min cursor-default text-black-100"
				>
					{username
						.split(" ")
						.map((word) => word[0])
						.join("")}
				</Text>
			)}
		</div>
	),
);

Avatar.displayName = "Avatar";
export { Avatar };
