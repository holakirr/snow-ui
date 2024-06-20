import { User as UserIcon } from "@phosphor-icons/react";
import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Text } from "../";
import { ROLES } from "../../constants";
import { getInitials } from "../../helpers";

const avatarStyles = cva(
	"group brightness-100 hover:brightness-105 rounded-full transition-all overflow-hidden w-16 h-16 aspect-square flex items-center justify-center",
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

/**
 * Props for the Avatar component.
 */
export type AvatarProps = React.ComponentProps<"div"> &
	VariantProps<typeof avatarStyles> & {
		/**
		 * The name of the avatar.
		 */
		name: string;
		/**
		 * Determines whether to show a fallback avatar when `src` is not provided.
		 */
		showFallback?: boolean;
		/**
		 * The source URL of the avatar image.
		 */
		src?: string;
	};

const Avatar = ({ size, src, name, showFallback, color, className, ref }: AvatarProps) => (
	<div
		role={ROLES.avatar}
		aria-label={`Avatar for ${name}`}
		className={twMerge(
			avatarStyles({ size, color, className }),
			showFallback && "bg-black-5 hover:bg-black-20",
		)}
		ref={ref}
	>
		{showFallback && (
			<UserIcon
				aria-label="Default user icon"
				weight="fill"
				className="w-3 h-3 group-hover:scale-[1.125] transition-all"
				size={16}
			/>
		)}
		{!showFallback && src && (
			<img
				src={src}
				alt={`Avatar of user ${name}`}
				className="w-full h-full transition-all group-hover:scale-[1.125]"
			/>
		)}
		{!showFallback && !src && (
			<Text
				as="span"
				className="group-hover:text-sm group-hover:font-semibold w-min cursor-default text-black-100"
			>
				{getInitials(name)}
			</Text>
		)}
	</div>
);

Avatar.displayName = "Avatar";
export { Avatar };
