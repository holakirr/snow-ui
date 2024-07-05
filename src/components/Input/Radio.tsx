import { twMerge } from "tailwind-merge";

type RadioProps = React.ComponentProps<"input">;

const Radio = ({ className, ...props }: RadioProps) => (
	<div className="group block p-0.5 cursor-pointer relative">
		<input
			type="radio"
			className="absolute w-8 h-8 top-0 left-0 opacity-0 cursor-pointer"
			{...props}
		/>
		<div
			className={twMerge(
				"flex items-center justify-center w-7 h-7 border-2 border-black-20 group-hover:border-black-40 rounded-full transition-colors group-has-[:disabled]:cursor-not-allowed group-has-[:disabled]:border-black-10",
				className,
			)}
		>
			<div className="w-[14px] h-[14px] rounded-full transition-all bg-primary-brand opacity-0 group-has-[:checked]:opacity-100" />
		</div>
	</div>
);

Radio.displayName = "Radio";
export { Radio };
