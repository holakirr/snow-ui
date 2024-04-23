import { Button, Card, Dialog } from "@components";
import { ROLES } from "@constants";
import { iconControl } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { useState } from "react";

const testTitle = "Title";
const openButtonLabel = "Open Dialog";

const meta = {
	title: "Base Components/Dialog/Dialog",
	component: Dialog,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		titleIcon: iconControl,
		onClose: {
			control: undefined,
			description: "Function to close the dialog",
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		titleIcon: undefined,
		title: testTitle,
		open: true,
		children: (
			<Card className="w-96">
				<div className="p-4">
					<p className="text-lg text-black-100">This is a card</p>
				</div>
			</Card>
		),
	},
	render: (args) => {
		const [show, setShow] = useState(true);
		const handleClose = () => {
			console.log("close");

			setShow(false);
		};

		return (
			<div className="w-full h-full">
				<Button
					onClick={() => setShow(true)}
					variant="filled"
					label={openButtonLabel}
				/>
				<Dialog {...args} onClose={handleClose} open={show} />
			</div>
		);
	},
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicDialog: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const dialog = canvas.getByRole(ROLES.dialog);
		const dialogTitle = canvas.getByRole(ROLES.dialogTitle);
		const closeButton = canvas.getByTitle("Close dialog icon button");
		const openButton = canvas.getByRole(ROLES.button, {
			name: openButtonLabel,
		});

		expect(dialog).toBeInTheDocument();
		expect(dialogTitle).toHaveTextContent(testTitle);
		expect(closeButton).toBeInTheDocument();

		await userEvent.click(closeButton);

		expect(dialog).toHaveClass("h-0 opacity-0");

		await userEvent.click(openButton);

		expect(dialog).toHaveClass("opacity-100");
	},
};
