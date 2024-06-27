import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { useState } from "react";
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
		visible: true,
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
	render: (args) => <Tooltip visible {...args} />,
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const tooltip = canvas.getByRole(ROLES.tooltip);

		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent(testLabel);
	},
};

export const TooltipWithKeyBindings: Story = {
	args: {
		kbd: {
			keyBindings: testKeyBindings,
			separator: testSeparator,
		},
	},
	play: (context) => {
		const { canvasElement, step } = context;
		const canvas = within(canvasElement);
		const keyBindings = canvas.getByRole(ROLES.kbd);

		if (BasicTooltip.play) BasicTooltip.play(context);

		step("Key bindings are visible", () => {
			expect(keyBindings).toBeInTheDocument();
			expect(keyBindings).toHaveTextContent(testKeyBindings.join(testSeparator));
		});
	},
};

export const ButtonWithTooltip: Story = {
	args: {
		children: <Button label={testButtonLabel} />,
		kbd: {
			keyBindings: testKeyBindings,
		},
		visible: false,
	},
	render: (args) => {
		const [showTooltip, setShowTooltip] = useState(args.visible);

		return (
			<Tooltip {...args} visible={showTooltip}>
				<Button
					label="Hover me"
					variant="filled"
					onMouseEnter={() => setShowTooltip(true)}
					onMouseLeave={() => {
						setShowTooltip(false);
					}}
				/>
			</Tooltip>
		);
	},
	play: async (context) => {
		const { canvasElement } = context;
		const canvas = within(canvasElement);
		const button = canvas.getByRole(ROLES.button);

		expect(button).toBeInTheDocument();

		await userEvent.hover(button);

		await waitFor(async () => {
			const tooltip = canvas.getByRole(ROLES.tooltip);
			if (BasicTooltip.play) BasicTooltip.play(context);
			const kbd = canvas.getByRole(ROLES.kbd);

			expect(kbd).toBeInTheDocument();
			expect(kbd).toHaveTextContent(testKeyBindings.join(""));

			await userEvent.unhover(button);

			await waitFor(() => {
				expect(tooltip).not.toBeInTheDocument();
			});
		});
	},
};
