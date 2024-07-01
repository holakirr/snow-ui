import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { type DateLimitsType, RangePicker, useRangePicker } from "../../../src";

const testFromDate = new Date(2024, 4, 13, 4, 13);
const testToDate = new Date(2024, 4, 15, 14, 27);
const testDateLimits: DateLimitsType = [new Date(2021, 3, 1), new Date(2025, 5, 31)];

const onDateSelectTest = fn((date) => console.log("Selected date is: ", date));
const onTypeChangeTest = fn((type) => console.log("Selected type is: ", type));
const onDisplayMonthChangeTest = fn((month) => console.log("New month is: ", month));
const onFromOrToChangeTest = fn((toOrFrom) => console.log("New from or to is: ", toOrFrom));
const onDisplayYearChangeTest = fn((year) => console.log("New year is: ", year));

const meta: Meta<typeof RangePicker> = {
	title: "Widgets/Date/Range Picker",
	component: RangePicker,
	args: {
		from: testFromDate,
		to: testToDate,
		onDateSelect: onDateSelectTest,
		onTypeChange: onTypeChangeTest,
		onDisplayMonthChange: onDisplayMonthChangeTest,
		onFromOrToChange: onFromOrToChangeTest,
		onDisplayYearChange: onDisplayYearChangeTest,
	},
	render: (args) => (
		<RangePicker {...useRangePicker({ ...args, onDateSelect: onDateSelectTest })} />
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

// TODO: Add tests

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
