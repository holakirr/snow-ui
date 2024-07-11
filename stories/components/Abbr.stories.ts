import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { Abbr } from "../../src";

const testLabel = "Tooltip";
const testText = "Hover me";

const meta = {
	title: "Base Components/Abbr",
	component: Abbr,
	parameters: {
		controls: {
			exclude: ["children"],
		},
	},
	argTypes: {
		semibold: { control: "boolean" },
		italic: { control: "boolean" },
		underline: { control: "boolean" },
	},
	args: {
		semibold: false,
		italic: false,
		underline: false,
		className: "text-black-100",
		tooltipProps: { label: testLabel },
		children: testText,
	},
} satisfies Meta<typeof Abbr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const abbr = canvas.getByText(testText);

		expect(abbr).toBeInTheDocument();

		await userEvent.hover(abbr);

		await waitFor(
			() => {
				const tooltip = canvas.getByText(testLabel);
				expect(tooltip).toBeInTheDocument();
			},
			{ timeout: 700 },
		);
	},
};
