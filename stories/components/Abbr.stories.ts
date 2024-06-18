import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { Abbr } from "../../src";

const testLabel = "Tooltip";
const testText = "Hover me";

const meta = {
	title: "Base Components/Abbr",
	component: Abbr,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		controls: {
			exclude: ["children"],
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { className: "text-black-100", tooltipProps: { label: testLabel }, children: testText },
} satisfies Meta<typeof Abbr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicAbbr: Story = {
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
