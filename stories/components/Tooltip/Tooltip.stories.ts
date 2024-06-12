import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { ROLES, Tooltip } from "../../../src";
import { testKeyBindings } from "../../mocks";

const testLabel = "Tooltip";

const meta = {
	title: "Base Components/Tooltip/Tooltip",
	component: Tooltip,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		kbd: undefined,
		label: testLabel,
	},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTooltip: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tooltip = canvas.getByRole(ROLES.tooltip);

		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent(testLabel);
	},
};

const testSeparator = "+";

export const TooltipWithKeyBindings: Story = {
	args: {
		kbd: {
			keyBindings: testKeyBindings,
			separator: testSeparator,
		},
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tooltip = canvas.getByRole(ROLES.tooltip);
		const keyBindings = canvas.getByRole(ROLES.kbd);

		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent(testLabel);
		expect(keyBindings).toBeInTheDocument();
		expect(keyBindings).toHaveTextContent(testKeyBindings.join(testSeparator));
	},
};
