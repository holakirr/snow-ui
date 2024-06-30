import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Button, Card, Popup, ROLES } from "../../src";
import { iconControl } from "../mocks";

const testTitle = "Title";
const openButtonLabel = "Open Popup";
const testCloseFn = fn(() => console.log("close"));

const meta = {
	title: "Base Components/Popup",
	component: Popup,
	parameters: {
		layout: "fullscreen",
		controls: {
			exclude: ["open", "onClose"],
		},
	},
	argTypes: {
		titleIcon: iconControl,
		onClose: {
			control: undefined,
		},
	},
	args: {
		titleIcon: undefined,
		title: testTitle,
		open: true,
		onClose: testCloseFn,
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
			setShow(false);
			if (args.onClose) {
				args.onClose();
			}
		};

		return (
			<div className="w-full h-full">
				<Button onClick={() => setShow(true)} variant="filled" label={openButtonLabel} />
				<Popup {...args} onClose={handleClose} open={show} />
			</div>
		);
	},
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const popup = canvas.getByRole(ROLES.dialog);
		const popupHeader = canvas.getByRole(ROLES.heading);
		const closeButton = canvas.getByTitle("Close popup icon button");
		const openButton = canvas.getByRole(ROLES.button, {
			name: openButtonLabel,
		});

		expect(popup).toBeInTheDocument();
		expect(popupHeader).toHaveTextContent(testTitle);
		expect(closeButton).toBeInTheDocument();

		await userEvent.click(closeButton);

		expect(popup).not.toBeVisible();
		expect(testCloseFn).toHaveBeenCalledOnce();

		await userEvent.click(openButton);

		expect(popup).toBeVisible();
	},
};
