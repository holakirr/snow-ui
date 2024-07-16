import type { DateTypeEnum } from "../../types";
import { Input } from "./Input";

/**
 * Props for the TimeInput component.
 */
type TimeInputProps = React.ComponentProps<"input"> & {
	/**
	 * The value of the time input.
	 */
	value: number;

	/**
	 * The type of date being changed (e.g., hour, minute, second).
	 */
	changingType: DateTypeEnum;
};

/**
 * TimeInput component displays a time input field.
 */
export const TimeInput = ({ changingType, value, ...props }: TimeInputProps) => (
	<Input
		type="number"
		min={0}
		max={changingType === "hours" ? 12 : 59}
		value={value}
		placeholder="00"
		className="text-xs py-[10px] px-[22px] max-w-[60px] text-center rounded-xl"
		autoComplete="off"
		{...props}
	/>
);
