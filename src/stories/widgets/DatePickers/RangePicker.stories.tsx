import { useRangePicker } from "@hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { DateLimitsType } from "@types";
import { RangePicker } from "@widgets";

const testFromDate = new Date(2024, 4, 13, 4, 13);
const testToDate = new Date(2024, 4, 15, 14, 27);
const testDateLimits: DateLimitsType = [new Date(2021, 3, 1), new Date(2025, 5, 31)];

const onDateSelectTest = fn((date) => console.log("Selected date is: ", date));
const onTypeChangeTest = fn((type) => console.log("Selected type is: ", type));
const onDisplayMonthChangeTest = fn((month) => console.log("New month is: ", month));
const onFromOrToChangeTest = fn((toOrFrom) => console.log("New from or to is: ", toOrFrom));
const onDisplayYearChangeTest = fn((year) => console.log("New year is: ", year));

const meta: Meta<typeof RangePicker> = {
	title: "Widgets/Range Picker",
	component: RangePicker,
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
		from: testFromDate,
		to: testToDate,
		onDateSelect: onDateSelectTest,
		onTypeChange: onTypeChangeTest,
		onDisplayMonthChange: onDisplayMonthChangeTest,
		onFromOrToChange: onFromOrToChangeTest,
		onDisplayYearChange: onDisplayYearChangeTest,
	},
	render: (args) => <RangePicker {...useRangePicker(args)} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicRangePicker: Story = {
	args: {},
};

export const RangePickerWithAllProps: Story = {
	args: {
		withTime: true,
		displayMonth: 4,
		displayYear: 2024,
		startOfWeek: 0,
		changingType: "date",
		changingFromOrTo: "from",
		lastSelection: new Date(2024, 4, 13, 4, 13),
		dateLimits: testDateLimits,
	},
};
