import { Text } from "@components";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import "./Slider.module.sass";

type SliderProps = ComponentProps<"input">;

const Slider = forwardRef<HTMLInputElement, SliderProps>(
	(
		{ className, min = 0, max = 100, value = 50, placeholder, ...props },
		ref,
	) => {
		const percentage =
			((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;
		return (
			<div className="relative flex justify-center items-center h-[34px] bg-black-5 overflow-hidden rounded-lg">
				<input
					min={min}
					max={max}
					className={twMerge(
						"peer appearance-none w-full h-full bg-transparent",
						className,
					)}
					value={value}
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
						size={12}
					>
						{placeholder}
					</Text>
				)}
				<Text
					className={twMerge(
						"absolute text-black-40 right-2 top-1/2 w-min -translate-y-1/2 pointer-events-none peer-disabled:text-black-10",
						percentage > 80 && "text-white-40 peer-disabled:text-white-10",
					)}
					size={12}
				>
					{Math.round(percentage)}%
				</Text>
			</div>
		);
	},
);

Slider.displayName = "Slider";
export { Slider };
