import { DatePicker } from "@components";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
	title: "Base Components/DatePicker",
	component: DatePicker,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		withTime: {
			description: "Whether to show the time selector",
		},
		withRange: {
			description: "Whether to show the range selector",
		},
		dateTime: {
			description: "The date and time to display in Date format",
		},
		dateTimeTo: {
			description: "The date and time 'TO' to display in Date format",
		},
		changingType: {
			description:
				"The type of changing: day, month, year, hour, minute, am/pm",
		},
		changingToOrFrom: {
			description: "The type of changing: to, from",
		},
		lastSelection: {
			description: "The last selected date: Date in string format",
		},
		onSelectDate: {
			description:
				"The function to call when a date is selected [returns Date in string format]",
		},
		onTypeChange: {
			description:
				"The function to call when a type is selected [returns day | month | year | hour | minute | am/pm]",
		},
		onMonthChange: {
			description:
				"The function to call when a month is selected [returns month in number format]",
		},
		onToOrFromChange: {
			description:
				"The function to call when a to or from is selected [returns to | from]",
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		withTime: true,
		withRange: true,
		dateTime: "2024-05-13T04:13:42.055Z",
		dateTimeTo: new Date(Date.now()).toISOString(),
		changingType: "day",
		changingToOrFrom: "from",
		lastSelection: "2024-05-13T04:13:42.055Z",
		onSelectDate: (date) => {
			console.log(date);
			return date;
		},
		onTypeChange: (type) => {
			console.log(type);
			return type;
		},
		onMonthChange: (month) => {
			console.log(month);
			return month;
		},
		onToOrFromChange: (toOrFrom) => {
			console.log(toOrFrom);
			return toOrFrom;
		},
	},
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicDatePicker: Story = {
	args: {},
	// play: ({ canvasElement }) => {
	// 	const canvas = within(canvasElement);

	// },
};
