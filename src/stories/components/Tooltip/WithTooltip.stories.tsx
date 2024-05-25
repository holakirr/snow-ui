import { Button, WithTooltip } from "@components";
import { ROLES } from "@constants";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { testKeyBindings } from "../mocks";

const testLabel = "WithTooltip";
const testButtonLabel = "Hover me";

const meta = {
	title: "Base Components/Tooltip/With Tooltip",
	component: WithTooltip,
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
	argTypes: {
		position: {
			control: "radio",
			options: ["top", "bottom", "left", "right"],
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		position: "bottom",
		label: testLabel,
		kbd: undefined,
	},
	render: (args) => {
		const [showTooltip, setShowTooltip] = useState(false);
		return (
			<WithTooltip {...args} visible={showTooltip}>
				<Button
					label="Hover me"
					variant="filled"
					onMouseEnter={() => setShowTooltip(true)}
					onMouseLeave={() => {
						setShowTooltip(false);
					}}
				/>
			</WithTooltip>
		);
	},
} satisfies Meta<typeof WithTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonWithTooltip: Story = {
	args: {
		children: <Button label={testButtonLabel} />,
		kbd: {
			keyBindings: testKeyBindings,
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole(ROLES.button);

		expect(button).toBeInTheDocument();

		await userEvent.hover(button);

		const tooltip = canvas.getByRole(ROLES.tooltip);
		const kbd = canvas.getByRole(ROLES.kbd);

		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent(testLabel);
		expect(kbd).toBeInTheDocument();
		expect(kbd).toHaveTextContent(testKeyBindings.join(""));
	},
};
