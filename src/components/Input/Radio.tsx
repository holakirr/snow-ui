import { twMerge } from "tailwind-merge";
import { Text } from "../Text";

type RadioProps = React.ComponentProps<"input">;

const Radio = ({ className, id, ...props }: RadioProps) => (
	<Text as="label" htmlFor={id} className="relative group block p-0.5 cursor-pointer">
		<input
			id={id}
			type="radio"
			className="absolute w-8 h-8 top-0 left-0 opacity-0 cursor-pointer"
			{...props}
		/>
		<span
			className={twMerge(
				"flex items-center justify-center w-7 h-7 border-2 border-black-20 group-hover:border-black-40 rounded-full transition-colors group-has-[:disabled]:cursor-not-allowed group-has-[:disabled]:border-black-10 before:w-[14px] before:h-[14px] before:rounded-full before:bg-primary-brand before:opacity-0 before:transition-all group-has-[:checked]:before:opacity-100",
				className,
			)}
		/>
	</Text>
);

Radio.displayName = "Radio";
export { Radio };
