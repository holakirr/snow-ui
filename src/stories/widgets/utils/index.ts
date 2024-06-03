import { ROLES } from "@constants";
import { userEvent, within } from "@storybook/test";

export const ResetDatePicker = async (picker: HTMLElement) => {
	await userEvent.click(
		within(picker).getByRole(ROLES.datepickerHeadTab, {
			name: "2024",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.datepickerBodyTableCell, {
			name: "2024",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.button, {
			name: "Back to month selection",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.datepickerBodyTableCell, {
			name: "Select Jun 2024",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.button, {
			name: "Back to day selection",
		}),
	);
	await userEvent.click(
		within(picker).getByRole(ROLES.datepickerBodyTableCell, {
			name: "Thu Jun 20 2024",
		}),
	);
};
