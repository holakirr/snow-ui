import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { Button, ROLES, Text, Tooltip } from "../../src";
import { testKeyBindings } from "../mocks";

const testSeparator = "+";
const testText = "Tooltip trigger";
const testLabel = "Tooltip";
const testButtonLabel = "Hover me";

const meta = {
	title: "Base Components/Tooltip",
	component: Tooltip,
	parameters: {
		controls: {
			exclude: ["children"],
		},
	},
	argTypes: {
		position: {
			control: "radio",
			options: ["top", "bottom", "left", "right"],
		},
	},
	args: {
		position: "bottom",
		label: testLabel,
		kbd: undefined,
		children: <Text className="text-black-100">{testText}</Text>,
	},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTooltip: Story = {
	args: {},
	render: (args) => <Tooltip {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const text = canvas.getByText(testText);

		await userEvent.hover(text);

		await waitFor(() => {
			const tooltip = canvas.getByRole(ROLES.tooltip);
			expect(tooltip).toBeInTheDocument();
			expect(tooltip).toHaveTextContent(testLabel);
		});
	},
};

export const TooltipWithKeyBindings: Story = {
	args: {
		kbd: {
			keyBindings: testKeyBindings,
			separator: testSeparator,
		},
	},
	play: async (context) => {
		const { canvasElement } = context;
		const canvas = within(canvasElement);
		const text = canvas.getByText(testText);

		await userEvent.hover(text);

		await waitFor(() => {
			const tooltip = canvas.getByRole(ROLES.tooltip);
			expect(tooltip).toBeInTheDocument();
			expect(tooltip).toHaveTextContent(testLabel);

			const keyBindings = canvas.getByRole(ROLES.definition);
			expect(keyBindings).toBeInTheDocument();
			expect(keyBindings).toHaveTextContent(testKeyBindings.join(testSeparator));
		});
	},
};

export const ButtonWithTooltip: Story = {
	args: {
		children: <Button label={testButtonLabel} variant="filled" />,
		kbd: {
			keyBindings: testKeyBindings,
		},
	},
	play: async (context) => {
		const { canvasElement } = context;
		const canvas = within(canvasElement);
		const button = canvas.getByRole(ROLES.button);

		expect(button).toBeInTheDocument();

		await userEvent.hover(button);

		await waitFor(async () => {
			const tooltip = canvas.getByRole(ROLES.tooltip);
			const kbd = canvas.getByRole(ROLES.definition);

			expect(kbd).toBeInTheDocument();
			expect(kbd).toHaveTextContent(testKeyBindings.join(""));

			await userEvent.unhover(button);

			await waitFor(() => {
				expect(tooltip.clientHeight).toBe(0);
			});
		});
	},
};
