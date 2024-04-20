import { Button, Card, Dialog } from "@components";
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
			control: null,
			description: "Function to close the dialog",
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		titleIcon: undefined,
		title: testTitle,
		show: true,
		children: (
			<Card className="w-96">
				<div className="p-4">
					<p className="text-lg text-gray-800">This is a card</p>
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
				<Dialog {...args} onClose={handleClose} show={show} />
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
		const dialog = canvas.getByRole("dialog");
		const dialogTitle = canvas.getByRole("complementary");
		const closeButton = canvas.getByTitle("Button title");
		const openButton = canvas.getByRole("button", { name: openButtonLabel });

		expect(dialog).toBeInTheDocument();
		expect(dialogTitle).toHaveTextContent(testTitle);
		expect(closeButton).toBeInTheDocument();

		await userEvent.click(closeButton);

		expect(dialog).toHaveClass(
			"w-0 h-0 opacity-0 *:text-[0rem] *:w-[0rem] *:h-[0rem] *:opacity-0 *:p-0 *:m-0",
		);

		await userEvent.click(openButton);

		expect(dialog).toHaveClass(
			"w-dvw h-dvh backdrop-blur-[20px] bg-[linear-gradient(180deg, rgba(215, 208, 255, 0.20) 0%, rgba(203, 221, 255, 0.50) 100%)] opacity-100",
		);
	},
};
