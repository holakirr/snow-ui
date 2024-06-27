import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { useState } from "react";
import { Button, Popover, PopoverContent, ROLES, Text } from "../../src";

const testLabel = "Popover content";
const testButtonLabel = "Popover trigger";

const meta = {
	title: "Base Components/Popover",
	component: Popover,
	argTypes: {
		position: {
			control: "radio",
			options: ["top", "bottom", "left", "right"],
		},
		children: {
			control: {
				disable: true,
			},
			description: `
Should contain 2 children:
	1. The trigger element for the popover.
	2. The content of the popover.
You can pass second child as any element, it will be wrapped in PopoverContent component.
`,
		},
	},
	args: {
		visible: true,
		position: "bottom",
		children: [
			<Text className="text-black-100 text-nowrap" key={testLabel}>
				{testLabel}
			</Text>,
		],
	},
	play: async (context) => {
		const { canvasElement } = context;
		const canvas = within(canvasElement);
		const button = canvas.getByRole(ROLES.button);

		expect(button).toBeInTheDocument();

		await userEvent.hover(button);

		await waitFor(async () => {
			const popover = canvas.getByRole(ROLES.popover);

			expect(popover).toBeInTheDocument();
			expect(popover).toHaveTextContent(testLabel);

			await userEvent.unhover(button);

			await waitFor(() => {
				expect(popover).not.toBeInTheDocument();
			});
		});
	},
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonWithPopover: Story = {
	args: {
		visible: false,
	},
	render: (args) => {
		const [showPopover, setShowPopover] = useState(args.visible);

		return (
			<Popover {...args} visible={showPopover}>
				<Button
					label={testButtonLabel}
					variant="filled"
					onMouseEnter={() => setShowPopover(true)}
					onMouseLeave={() => setShowPopover(false)}
				/>
				<PopoverContent position={args.position}>{args.children}</PopoverContent>
			</Popover>
		);
	},
};

export const PopoverWithoutContentElement: Story = {
	render: (args) => {
		const [showPopover, setShowPopover] = useState(args.visible);

		return (
			<Popover {...args} visible={showPopover}>
				<Button
					label={testButtonLabel}
					variant="filled"
					onMouseEnter={() => setShowPopover(true)}
					onMouseLeave={() => setShowPopover(false)}
				/>
				{args.children}
			</Popover>
		);
	},
};
