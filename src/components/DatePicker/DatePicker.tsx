import type { DateTypeEnum } from "@types";
import { twMerge } from "tailwind-merge";
import { DatePickerBody } from "./DatePickerBody";
import { DatePickerHead } from "./DatePickerHead";

export type DatePickerProps = React.ComponentProps<"div"> & {
	selected: Date | Date[];
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	changingType: DateTypeEnum;
	changingFromOrTo: "from" | "to";
	withTime?: boolean;
	lastSelection?: Date;
	dateLimits?: [Date, Date];
	onDateSelect: (date: Date) => void;
	onTypeChange: (type: DateTypeEnum) => void;
	onDisplayMonthChange: (month: number) => void;
	onDisplayYearChange: (year: number) => void;
	onFromOrToChange?: (fromOrTo: "from" | "to") => void;
};

const DatePicker = ({
	selected,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	changingFromOrTo,
	withTime,
	lastSelection,
	dateLimits,
	onDateSelect,
	onTypeChange,
	onFromOrToChange,
	onDisplayMonthChange: onMonthChange,
	onDisplayYearChange: onYearChange,
	className,
	...props
}: DatePickerProps) => {
	let date: Date;
	let rangeEnd: Date | undefined;

	if (Array.isArray(selected)) {
		date = selected[0];
		rangeEnd = selected[1];
	} else {
		date = selected;
	}

	return (
		<div
			className={twMerge(
				"w-[360px] rounded-2xl border-1 border-black-10 flex flex-col backdrop-blur-[20px] bg-white-80 text-black-100",
				className,
			)}
			{...props}
		>
			<DatePickerHead
				date={date}
				rangeEnd={rangeEnd}
				changingType={changingType}
				changingFromOrTo={changingFromOrTo}
				withTime={withTime}
				onTypeChange={onTypeChange}
				onFromOrToChange={onFromOrToChange}
			/>
			<DatePickerBody
				date={date}
				rangeEnd={rangeEnd}
				displayMonth={displayMonth}
				displayYear={displayYear}
				startOfWeek={startOfWeek}
				changingType={changingType}
				changingFromOrTo={changingFromOrTo}
				lastSelection={lastSelection}
				dateLimits={dateLimits}
				onDateSelect={onDateSelect}
				onMonthChange={onMonthChange}
				onYearChange={onYearChange}
				onTypeChange={onTypeChange}
			/>
		</div>
	);
};

DatePicker.displayName = "DatePicker";
export { DatePicker };
