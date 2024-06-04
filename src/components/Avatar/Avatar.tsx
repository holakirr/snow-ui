import { Text } from "@components";
import { ROLES } from "@constants";
import { getInitials } from "@helpers";
import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const avatarStyles = cva(
	"group brightness-100 hover:brightness-150 rounded-full transition-all overflow-hidden w-16 h-16 aspect-square flex items-center justify-center",
	{
		variants: {
			size: {
				sm: "w-8 h-8",
				lg: "w-16 h-16",
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
			size: "sm",
		},
	},
);

export type AvatarProps = React.ComponentProps<"div"> &
	VariantProps<typeof avatarStyles> & {
		username: string;
		img?: string;
	};

const Avatar = ({ size, img, username, color, className, ref }: AvatarProps) => (
	<div
		role={ROLES.avatar}
		aria-label={`Avatar for ${username}`}
		className={twMerge(avatarStyles({ size, color, className }))}
		ref={ref}
	>
		{img && (
			<img
				src={img}
				// biome-ignore lint/a11y/noRedundantAlt: <explanation>
				alt={`Profile picture of ${username}`}
				className="w-full h-full transition-all group-hover:scale-125"
			/>
		)}
		{!img && (
			<Text
				as="span"
				className="group-hover:text-sm group-hover:font-semibold w-min cursor-default text-black-100"
			>
				{getInitials(username)}
			</Text>
		)}
	</div>
);

Avatar.displayName = "Avatar";
export { Avatar };
