import { twMerge } from "tailwind-merge";
import { Text } from "../Text";

type RadioProps = React.ComponentProps<"input">;

/**
 * Radio component displays a radio button.
 */
const Radio = ({ className, id, ...props }: RadioProps) => (
	<Text
		as="label"
		htmlFor={id}
		className="relative group block p-0.5 cursor-pointer has-[:disabled]:cursor-not-allowed"
	>
		<input
			id={id}
			type="radio"
			className="absolute w-8 h-8 top-0 left-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
			{...props}
		/>
		<span
			className={twMerge(
				"flex items-center justify-center w-7 h-7 border-2 border-black-20 group-hover:border-black-40 rounded-full transition-colors group-hover:bg-black-5",
				"before:w-[14px] before:h-[14px] before:rounded-full before:bg-primary-brand before:opacity-0 before:transition-all",
				"group-has-[:disabled]:border-black-10 group-has-[:disabled]:before:bg-black-10 group-has-[:disabled]:bg-transparent",
				"group-has-[:checked]:before:opacity-100 group-hover:group-has-[:checked]:before:opacity-80",
				className,
			)}
		/>
	</Text>
);

Radio.displayName = "Radio";
export { Radio };
