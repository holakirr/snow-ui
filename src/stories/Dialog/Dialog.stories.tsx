import { Button, Card, Dialog } from "@components";
import { iconControl } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { useState } from "react";

const testTitle = "Title";

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
					label="Open Dialog"
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
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const Dialog = canvas.getByRole("complementary");

		expect(Dialog).toHaveTextContent(testTitle);
	},
};
