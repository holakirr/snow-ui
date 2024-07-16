import { twMerge } from "tailwind-merge";
import { ROLES, TEXT_SIZES } from "../../constants";
import { Text } from "../Text";

/**
 * Props for the Slider component.
 */
type SliderProps = React.ComponentProps<"input"> & {
	/**
	 * The minimum value of the slider.
	 */
	min?: number;

	/**
	 * The maximum value of the slider.
	 */
	max?: number;

	/**
	 * The current value of the slider.
	 */
	value?: number;

	/**
	 * The placeholder text for the slider.
	 */
	placeholder?: string;
};

/**
 * Slider component displays a slider input field.
 */
const Slider = ({
	className,
	min = 0,
	max = 100,
	value = 50,
	placeholder,
	ref,
	...props
}: SliderProps) => {
	const percentage = ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;
	return (
		<div className="relative flex justify-center items-center h-[34px] bg-black-5 overflow-hidden rounded-lg">
			<input
				role={ROLES.slider}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				min={min}
				max={max}
				value={value}
				className={twMerge("peer appearance-none w-full h-full bg-transparent", className)}
				{...props}
				type="range"
				ref={ref}
			/>
			<div
				className="absolute block left-0 top-0 h-full bg-black-100 -z-[1] will-change-auto peer-disabled:bg-black-80"
				style={{ width: `${percentage + 2}%` }}
			/>
			{placeholder && (
				<Text
					className={twMerge(
						"absolute text-white-100 left-2 top-1/2 w-min -translate-y-1/2 pointer-events-none",
						percentage < 5 && "text-black-100",
					)}
					size={TEXT_SIZES[12]}
				>
					{placeholder}
				</Text>
			)}
			<Text
				className={twMerge(
					"absolute text-black-40 right-2 top-1/2 w-min -translate-y-1/2 pointer-events-none peer-disabled:text-black-10",
					percentage > 80 && "text-white-40 peer-disabled:text-white-10",
				)}
				size={TEXT_SIZES[12]}
			>
				{Math.round(percentage)}%
			</Text>
		</div>
	);
};

Slider.displayName = "Slider";
export { Slider };
