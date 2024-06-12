import { twMerge } from "tailwind-merge";
import type { RangePickerType } from "../../types";
import { RangePickerBody } from "./RangePickerBody";
import { RangePickerHead } from "./RangePickerHead";

export type RangePickerProps = React.ComponentProps<"div"> & RangePickerType;

const RangePicker = ({
	from,
	to,
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
	onDisplayMonthChange,
	onDisplayYearChange,
	className,
	...props
}: RangePickerProps) => (
	<div
		className={twMerge(
			"w-[360px] rounded-2xl border-1 border-black-10 flex flex-col backdrop-blur-[20px] bg-white-80 text-black-100",
			className,
		)}
		{...props}
	>
		<RangePickerHead
			from={from}
			to={to}
			changingType={changingType}
			changingFromOrTo={changingFromOrTo}
			withTime={withTime}
			onTypeChange={onTypeChange}
			onFromOrToChange={onFromOrToChange}
		/>
		<RangePickerBody
			from={from}
			to={to}
			displayMonth={displayMonth}
			displayYear={displayYear}
			startOfWeek={startOfWeek}
			changingType={changingType}
			changingFromOrTo={changingFromOrTo}
			dateLimits={dateLimits}
			lastSelection={lastSelection}
			onDateSelect={onDateSelect}
			onDisplayMonthChange={onDisplayMonthChange}
			onDisplayYearChange={onDisplayYearChange}
			onTypeChange={onTypeChange}
		/>
	</div>
);

RangePicker.displayName = "RangePicker";
export { RangePicker };
