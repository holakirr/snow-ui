import type { DateTypeEnum } from "../../types";
import { Input } from "./Input";

type TimeInputProps = React.ComponentProps<"input"> & {
	value: number;
	changingType: DateTypeEnum;
};

export const TimeInput = ({ value, changingType, ...props }: TimeInputProps) => (
	<Input
		type="number"
		min={0}
		max={changingType === "hours" ? 12 : 59}
		value={value === 0 ? "" : value}
		placeholder="00"
		className="text-xs py-[10px] px-[22px] max-w-[60px] text-center rounded-xl"
		autoComplete="off"
		{...props}
	/>
);
