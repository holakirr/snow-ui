import { userEvent, within } from "@storybook/test";
import { ROLES } from "../../../src";

export const ResetDatePicker = async (picker: HTMLElement) => {
	await userEvent.click(
		within(picker).getByRole(ROLES.tab, {
			name: "2024",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.cell, {
			name: "2024",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.button, {
			name: "Back to month selection",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.cell, {
			name: "Select Jun 2024",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.button, {
			name: "Back to day selection",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.cell, {
			name: "Thu Jun 20 2024",
		}),
	);
};
