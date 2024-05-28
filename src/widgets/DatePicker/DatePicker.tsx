import { ROLES } from "@constants";
import type { DateTypeEnum } from "@types";
import { twMerge } from "tailwind-merge";
import { DatePickerBody } from "./DatePickerBody";
import { DatePickerHead } from "./DatePickerHead";

export type DatePickerProps = React.ComponentProps<"div"> & {
	selected: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	changingType: DateTypeEnum;
	withTime?: boolean;
	lastSelection?: Date;
	dateLimits?: [Date, Date];
	onDateSelect: (date: Date) => void;
	onTypeChange: (type: DateTypeEnum) => void;
	onDisplayMonthChange: (month: number) => void;
	onDisplayYearChange: (year: number) => void;
};

const DatePicker = ({
	selected,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	withTime,
	lastSelection,
	dateLimits,
	onDateSelect,
	onTypeChange,
	onDisplayMonthChange,
	onDisplayYearChange,
	className,
	...props
}: DatePickerProps) => (
	<div
		className={twMerge(
			"w-[360px] rounded-2xl border-1 border-black-10 flex flex-col backdrop-blur-[20px] bg-white-80 text-black-100",
			className,
		)}
		role={ROLES.datepicker}
		{...props}
	>
		<DatePickerHead
			date={selected}
			changingType={changingType}
			withTime={withTime}
			onTypeChange={onTypeChange}
		/>
		<DatePickerBody
			selected={selected}
			displayMonth={displayMonth}
			displayYear={displayYear}
			startOfWeek={startOfWeek}
			changingType={changingType}
			lastSelection={lastSelection}
			dateLimits={dateLimits}
			onDateSelect={onDateSelect}
			onDisplayMonthChange={onDisplayMonthChange}
			onDisplayYearChange={onDisplayYearChange}
			onTypeChange={onTypeChange}
		/>
	</div>
);

DatePicker.displayName = "DatePicker";
export { DatePicker };
