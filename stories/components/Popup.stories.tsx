import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";
import { Avatar, Button, Card, FourLeafCloverIcon, Popup, ROLES } from "../../src";
import { ControlTypeRadio, imageSrcMocks, testUserName } from "../mocks";

const testTitle = "Title";
const openButtonLabel = "Open Popup";
const testCloseFn = fn(() => console.log("close popup"));

const meta = {
	title: "Base Components/Popup",
	component: Popup,
	parameters: {
		layout: "fullscreen",
		controls: {
			exclude: [],
		},
	},
	argTypes: {
		startContent: {
			control: ControlTypeRadio,
			options: ["woman", "flowerIcon", "avatar", "Nothing"],
			mapping: {
				avatar: <Avatar size="md" src={imageSrcMocks.man} name={testUserName} />,
				woman: <img alt="woman" width={48} height={48} src={imageSrcMocks.woman} />,
				flowerIcon: <FourLeafCloverIcon size={48} alt={`Icon ${FourLeafCloverIcon.displayName}`} />,
				Nothing: undefined,
			},
		},
	},
	args: {
		open: true,
		onClose: testCloseFn,
		children: (
			<Card className="w-80 h-80 bg-white-100 rounded-[32px] flex justify-center items-center">
				<p className="text-lg text-black-100">This could be any content</p>
			</Card>
		),
	},
	decorators: [
		(Story) => (
			<div className="w-full h-full min-h-96">
				<Story />
			</div>
		),
	],
	render: (args) => {
		const [show, setShow] = useState(args.open);
		const handleClose = () => {
			setShow(false);
			if (args.onClose) {
				args.onClose();
			}
		};

		return (
			<>
				<Button
					onClick={() => setShow(true)}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							setShow(true);
						}
					}}
					variant="filled"
					label={openButtonLabel}
				/>
				<Popup {...args} onClose={handleClose} open={show} />
			</>
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

		expect(popup).toBeInTheDocument();
	},
};

export const WithStartContent: Story = {
	args: {
		startContent: <FourLeafCloverIcon size={48} alt={`Icon ${FourLeafCloverIcon.displayName}`} />,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const popupHeader = canvas.getByRole(ROLES.heading);
		const startContent = popupHeader.querySelector("svg");

		expect(startContent).toBeInTheDocument();
	},
};

export const WithTitle: Story = {
	args: {
		title: testTitle,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const popupHeader = canvas.getByRole(ROLES.heading);

		expect(popupHeader).toHaveTextContent(testTitle);
	},
};

export const WithCloseIcon: Story = {
	args: {
		withCloseIcon: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const closeButton = canvas.getByTitle("Close popup icon button");

		expect(closeButton).toBeInTheDocument();
	},
};

export const WithBlur: Story = {
	args: {
		withBlur: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const popup = canvas.getByRole(ROLES.dialog);

		expect(popup.parentElement).toHaveClass("backdrop-blur-md");
	},
};

export const WithAllProps: Story = {
	args: {
		startContent: <Avatar size="md" src={imageSrcMocks.alex} name={testUserName} />,
		title: testTitle,
		withCloseIcon: true,
		withBlur: true,
	},
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
