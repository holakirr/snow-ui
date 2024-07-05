import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { ROLES, Radio, Text } from "../../../src";

const testName = "Test Name";
const testIds = ["Radio 1", "Radio 2", "Radio 3"];

const meta: Meta<typeof Radio> = {
	title: "Base Components/Inputs/Radio",
	component: Radio,
	args: {
		name: testName,
		disabled: false,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	render: (args) => {
		const id = testIds[0];
		return (
			<div>
				<Text
					key={id}
					as="label"
					htmlFor={id}
					className="flex justify-center items-center gap-2 cursor-pointer"
				>
					<Radio id={id} {...args} />
					<span className="text-black-100">{id}</span>
				</Text>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const radio = canvas.getByRole(ROLES.radio);

		expect(radio).not.toBeChecked();

		await userEvent.click(radio);

		expect(radio).toBeChecked();
	},
};

export const Group: Story = {
	render: (args) => (
		<div>
			{testIds.map((id) => (
				<Text
					key={id}
					as="label"
					htmlFor={id}
					className="flex justify-center items-center gap-2 cursor-pointer"
				>
					<Radio id={id} {...args} />
					<span className="text-black-100">{id}</span>
				</Text>
			))}
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const radios = canvas.getAllByRole(ROLES.radio);

		expect(radios).toHaveLength(testIds.length);

		const [first, second, third] = radios;

		expect(first).not.toBeChecked();
		expect(second).not.toBeChecked();
		expect(third).not.toBeChecked();

		await userEvent.click(first);

		expect(first).toBeChecked();

		await userEvent.click(second);

		expect(first).not.toBeChecked();
		expect(second).toBeChecked();
	},
};
