import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { DatePickerType } from "../../types";
import { DatePickerBody } from "./DatePickerBody";
import { DatePickerHead } from "./DatePickerHead";

export type DatePickerProps = React.ComponentProps<"div"> & DatePickerType;

const DatePicker = ({
	selected,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	dateLimits,
	withTime,
	lastSelection,
	onDateSelect,
	onTypeChange,
	onDisplayMonthChange,
	onDisplayYearChange,
	className,
	...props
}: DatePickerProps) => (
	<div
		className={twMerge(
			"w-[360px] rounded-2xl border border-black-10 flex flex-col backdrop-blur-[20px] bg-white-80 text-black-100",
			className,
		)}
		role={ROLES.dialog}
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
