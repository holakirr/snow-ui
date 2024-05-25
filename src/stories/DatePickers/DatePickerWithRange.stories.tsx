import { DatePicker } from "@components";
import { useDatePicker } from "@hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const onDateSelectTest = fn((date) => console.log("Selected date is: ", date));
const onTypeChangeTest = fn((type) => console.log("Selected type is: ", type));
const onMonthChangeTest = fn((month) => console.log("New month is: ", month));
const onFromOrToChangeTest = fn((toOrFrom) =>
	console.log("New from or to is: ", toOrFrom),
);
const onYearChangeTest = fn((year) => console.log("New year is: ", year));

const meta: Meta<typeof DatePicker> = {
	title: "Base Components/DatePickers/DatePickerWithRange",
	component: DatePicker,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		selected: new Date("2024-05-13T04:13:42.055"),
		displayMonth: new Date().getMonth(),
		onDateSelect: onDateSelectTest,
		onTypeChange: onTypeChangeTest,
		onDisplayMonthChange: onMonthChangeTest,
		onFromOrToChange: onFromOrToChangeTest,
		onDisplayYearChange: onYearChangeTest,
	},
	render: (args) => {
		const {
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
			onDisplayMonthChange,
			onDisplayYearChange,
			onTypeChange,
			onFromOrToChange,
		} = useDatePicker(args);

		return (
			<DatePicker
				selected={selected}
				displayMonth={displayMonth}
				displayYear={displayYear}
				startOfWeek={startOfWeek}
				changingType={changingType}
				changingFromOrTo={changingFromOrTo}
				withTime={withTime}
				lastSelection={lastSelection}
				dateLimits={dateLimits}
				onDateSelect={onDateSelect}
				onTypeChange={onTypeChange}
				onDisplayMonthChange={onDisplayMonthChange}
				onDisplayYearChange={onDisplayYearChange}
				onFromOrToChange={onFromOrToChange}
			/>
		);
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicDatePicker: Story = {
	args: {},
};

export const DatePickerWithTime: Story = {
	args: {
		withTime: true,
	},
};

export const DatePickerWithRange: Story = {
	args: {
		selected: [
			new Date("2024-05-13T04:13:42.055"),
			new Date("2024-05-15T04:13:42.055"),
		],
	},
};

export const DatePickerWithAllProps: Story = {
	args: {
		selected: [
			new Date("2024-04-30T15:13:42.055"),
			new Date("2024-05-04T19:13:42.055"),
		],
		displayYear: 2024,
		startOfWeek: 1,
		changingFromOrTo: "from",
		changingType: "date",
		withTime: true,
		lastSelection: new Date("2024-05-13T04:13:42.055Z"),
		dateLimits: [new Date("2016-08-15"), new Date("2026-10-20")],
	},
};
