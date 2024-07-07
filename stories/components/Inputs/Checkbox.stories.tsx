import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { type ChangeEventHandler, useState } from "react";
import { Checkbox, ROLES, Text } from "../../../src";

const testName = "Test Name";
const testIds = ["Checkbox 1", "Checkbox 2", "Checkbox 3"];
const subItems = [
	["Sub Checkbox 1", "Sub Checkbox 2", "Sub Checkbox 3"],
	["Sub Checkbox 4", "Sub Checkbox 5", "Sub Checkbox 6"],
	["Sub Checkbox 7", "Sub Checkbox 8", "Sub Checkbox 9"],
];
const testOnChange = fn((e) => console.log("onChange", e));

const meta: Meta<typeof Checkbox> = {
	title: "Base Components/Inputs/Checkbox",
	component: Checkbox,
	args: {
		name: testName,
		checked: false,
		indeterminate: false,
		disabled: false,
		onChange: testOnChange,
	},
	render: (args) => {
		const [checked, setChecked] = useState(false);

		const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
			setChecked((prev) => !prev);
			args.onChange?.(e);
		};

		return <Checkbox {...args} checked={checked} onChange={handleOnChange} />;
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Checkbox = canvas.getByRole(ROLES.checkbox);

		expect(Checkbox).not.toBeChecked();

		await userEvent.click(Checkbox);

		expect(Checkbox).toBeChecked();
		expect(testOnChange).toHaveBeenCalled();
	},
};

export const Indeterminate: Story = {
	args: {},
	render: (args) => {
		const [indeterminate, setIndeterminate] = useState(false);

		const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
			setIndeterminate((prev) => !prev);
			args.onChange?.(e);
		};

		return <Checkbox {...args} indeterminate={indeterminate} onChange={handleOnChange} />;
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Checkbox = canvas.getByRole(ROLES.checkbox);

		expect(Checkbox).not.toBeChecked();

		await userEvent.click(Checkbox);

		expect(testOnChange).toHaveBeenCalled();
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Checkbox = canvas.getByRole(ROLES.checkbox);

		expect(Checkbox).not.toBeChecked();

		await userEvent.click(Checkbox);

		expect(Checkbox).not.toBeChecked();
		expect(testOnChange).not.toHaveBeenCalled();
	},
};

export const Group: Story = {
	render: (args) => {
		const [items, setItems] = useState(testIds.map((acc) => ({ id: acc, checked: false })));

		const handleOnChange = (id: string) => {
			testOnChange(id);
			setItems((prev) =>
				prev.map((acc) => (acc.id === id ? { ...acc, checked: !acc.checked } : acc)),
			);
		};

		return (
			<div>
				{items.map(({ id, checked }) => (
					<Text
						key={id}
						as="label"
						htmlFor={id}
						className="flex justify-center items-center gap-2 cursor-pointer"
					>
						<Checkbox
							{...args}
							id={id}
							checked={checked}
							onChange={(e) => handleOnChange(e.target.id)}
						/>
						<span className="text-black-100">{id}</span>
					</Text>
				))}
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Checkboxs = canvas.getAllByRole(ROLES.checkbox);

		expect(Checkboxs).toHaveLength(testIds.length);

		const [first, second, third] = Checkboxs;

		expect(first).not.toBeChecked();
		expect(second).not.toBeChecked();
		expect(third).not.toBeChecked();

		await userEvent.click(first);

		expect(testOnChange).toHaveBeenCalledWith(testIds[0]);
		expect(first).toBeChecked();

		await userEvent.click(second);

		expect(testOnChange).toHaveBeenCalledWith(testIds[1]);
		expect(first).toBeChecked();
		expect(second).toBeChecked();
	},
};

export const GroupWithSubGroup: Story = {
	render: (args) => {
		const [items, setItems] = useState(
			testIds.map((acc, i) => ({
				id: acc,
				checked: false,
				indeterminate: false,
				disabled: i === 2,
				subItems: subItems[i].map((sub) => ({
					id: sub,
					checked: false,
					disabled: i === 2,
				})),
			})),
		);

		const handleOnChange = (id: string) => {
			testOnChange(id);
			setItems((prev) =>
				prev.map((acc) => {
					if (acc.subItems) {
						if (acc.id === id) {
							const newCheckedState = !acc.checked;
							const newSubItems = acc.subItems.map((sub) => ({ ...sub, checked: newCheckedState }));
							return {
								...acc,
								checked: newCheckedState,
								subItems: newSubItems,
								indeterminate: false,
							};
						}
					}
					if (acc.subItems.find((sub) => sub.id === id)) {
						const newSubItems = acc.subItems.map((sub) =>
							sub.id === id ? { ...sub, checked: !sub.checked } : sub,
						);
						return {
							...acc,
							checked: newSubItems.every((sub) => sub.checked),
							indeterminate: newSubItems.some((sub) => sub.checked),
							subItems: newSubItems,
						};
					}
					return acc.id === id ? { ...acc, checked: !acc.checked } : acc;
				}),
			);
		};

		return (
			<ul>
				{items.map(({ id, checked, subItems, indeterminate, disabled }) => (
					<li key={id}>
						<Text
							as="label"
							htmlFor={id}
							className="flex justify-center items-center gap-2 cursor-pointer"
						>
							<Checkbox
								{...args}
								id={id}
								checked={checked}
								disabled={disabled}
								indeterminate={indeterminate}
								onChange={(e) => handleOnChange(e.target.id)}
							/>
							<span className="text-black-100">{id}</span>
						</Text>
						<ul className="pl-16">
							{subItems.map(({ id, checked, disabled }) => (
								<Text
									key={id}
									as="label"
									htmlFor={id}
									className="flex justify-center items-center gap-2 cursor-pointer"
								>
									<Checkbox
										{...args}
										id={id}
										checked={checked}
										disabled={disabled}
										onChange={(e) => handleOnChange(e.target.id)}
									/>
									<span className="text-black-100">{id}</span>
								</Text>
							))}
						</ul>
					</li>
				))}
			</ul>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const Checkboxes = canvas.getAllByRole(ROLES.checkbox);

		expect(Checkboxes).toHaveLength(testIds.length + subItems.flat().length);

		for (const checkbox of Checkboxes) {
			expect(checkbox).not.toBeChecked();
		}

		const checkboxes = Checkboxes.filter((checkbox) => !subItems.flat().includes(checkbox.id));
		const subCheckboxes = Checkboxes.filter((checkbox) => subItems.flat().includes(checkbox.id));

		await userEvent.click(checkboxes[0]);

		expect(testOnChange).toHaveBeenCalledWith(testIds[0]);
		expect(checkboxes[0]).toBeChecked();
		expect(subCheckboxes[0]).toBeChecked();
		expect(subCheckboxes[1]).toBeChecked();
		expect(subCheckboxes[2]).toBeChecked();

		await userEvent.click(subCheckboxes[0]);

		expect(testOnChange).toHaveBeenCalledWith(subItems[0][0]);
		expect(checkboxes[0]).not.toBeChecked();
		expect(subCheckboxes[0]).not.toBeChecked();
		expect(subCheckboxes[1]).toBeChecked();
		expect(subCheckboxes[2]).toBeChecked();

		await userEvent.click(checkboxes[1]);
	},
};
