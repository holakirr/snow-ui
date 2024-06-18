import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { DatePicker, ROLES, useDatePicker } from "../../../src";
import { ResetDatePicker } from "../utils";

const testDate = new Date(2024, 4, 13, 4, 13, 42);
const testLimits: [Date, Date] = [new Date(2016, 7, 15), new Date(2024, 4, 28, 15, 30)];
const testLastSelection = new Date(2024, 4, 10, 4, 13, 42);
const baseStartOfWeek = 1;
const today = new Date();

const onDateSelectTest = fn((date) => console.log("Selected date is: ", date));
const onTypeChangeTest = fn((type) => console.log("Selected type is: ", type));
const onDisplayMonthChangeTest = fn((month) => console.log("New month is: ", month));
const onDisplayYearChangeTest = fn((year) => console.log("New year is: ", year));

const meta: Meta<typeof DatePicker> = {
	title: "Widgets/Date/Date Picker",
	component: DatePicker,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		selected: testDate,
		onDateSelect: onDateSelectTest,
		onTypeChange: onTypeChangeTest,
		onDisplayMonthChange: onDisplayMonthChangeTest,
		onDisplayYearChange: onDisplayYearChangeTest,
	},
	render: (args) => <DatePicker {...useDatePicker(args)} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicDatePicker: Story = {
	args: {},
	play: async ({ canvasElement, step }) => {
		const firstDayOfMoth = new Date(testDate.getFullYear(), testDate.getMonth(), 1).getDay();
		const selectedDate = "13";
		const selectedMonth = "05";
		const selectedYear = "2024";
		const picker = within(canvasElement).getByRole(ROLES.datepicker);
		const datepickerHead = within(picker).getByRole(ROLES.datepickerHead);
		const dateTag = within(datepickerHead).getByRole(ROLES.datepickerHeadTab, {
			name: selectedDate,
		});
		const monthTag = within(datepickerHead).getByRole(ROLES.datepickerHeadTab, {
			name: selectedMonth,
		});
		const yearTag = within(datepickerHead).getByRole(ROLES.datepickerHeadTab, {
			name: selectedYear,
		});

		const datepickerBody = within(picker).getByRole(ROLES.datepickerBody);
		const datepickerBodyNavigation = within(datepickerBody).getByRole(ROLES.datepickerNavigation);
		const todayTag = within(datepickerBodyNavigation).getByRole(ROLES.tag);
		let navButtons = within(datepickerBodyNavigation).getAllByRole(ROLES.button);
		let navDisplay = within(datepickerBodyNavigation).getByRole(ROLES.datepickerNavigationDisplay);

		const datepickerBodyTable = within(datepickerBody).getByRole(ROLES.datepickerBodyTable);
		const weekdays = within(datepickerBodyTable).getAllByRole(ROLES.datepickerBodyTableHeadCell);
		const days = within(datepickerBodyTable).getAllByRole(ROLES.datepickerBodyTableCell);
		const selectedDay = within(datepickerBodyTable).getByRole(ROLES.datepickerBodyTableCell, {
			name: testDate.toDateString(),
		});

		await step("Initial render", async () => {
			// Check if selected tab is the date tab
			expect(dateTag).toHaveAttribute("aria-selected", "true");
			expect(monthTag).toHaveAttribute("aria-selected", "false");
			expect(yearTag).toHaveAttribute("aria-selected", "false");

			// Check navigation
			expect(todayTag).toHaveTextContent("Today");
			expect(navButtons).toHaveLength(2);
			expect(navDisplay).toHaveTextContent("May");

			// Check weekdays
			expect(weekdays).toHaveLength(7);
			expect(weekdays[0]).toHaveTextContent("Mo");

			// Check days
			expect(days).toHaveLength(35);
			expect(selectedDay, "Day with current date is selected").toHaveAttribute(
				"aria-selected",
				"true",
			);
			expect(
				days.findIndex((day) => day.textContent === "1"),
				"First day of month is on current place",
			).toBe(firstDayOfMoth - baseStartOfWeek);
		});

		// Check functionality
		await step("DateView", async () => {
			await step("Select previous month", async () => {
				await userEvent.click(navButtons[0]);
				expect(onDisplayMonthChangeTest).toHaveBeenCalledWith(3);
				expect(navDisplay).toHaveTextContent("Apr");
			});

			await step("Select next month", async () => {
				await userEvent.click(navButtons[1]);
				expect(onDisplayMonthChangeTest).toHaveBeenCalledWith(4);
				expect(navDisplay).toHaveTextContent("May");
			});

			await step("Click on a day from previous month twice", async () => {
				await userEvent.click(days[0]);
				expect(
					onDisplayMonthChangeTest,
					"Should just change the display month",
				).toHaveBeenCalledWith(3);
				expect(onDateSelectTest, "Should not change the date").not.toHaveBeenCalled();
				await userEvent.click(days[0]);
				expect(onDateSelectTest, "Should change the date").toHaveBeenCalled();
			});

			await step("Click on 'Today' tag", async () => {
				await userEvent.click(todayTag);
				expect(onDateSelectTest).toHaveBeenCalled();
				expect(navDisplay).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { month: "long" }).format(today).slice(0, 3),
				);
				expect(dateTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(today),
				);
				expect(monthTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(today),
				);
				expect(yearTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { year: "numeric" }).format(today),
				);
				expect(
					within(datepickerBodyTable).getByRole(ROLES.datepickerBodyTableCell, { current: "date" }),
				).toHaveAttribute("aria-selected", "true");
			});
		});

		await step("YearView", async () => {
			await userEvent.click(monthTag);
			const yearView = within(picker).getByRole(ROLES.datepickerBody);
			const yearViewNavigation = within(yearView).getByRole(ROLES.datepickerNavigation);
			navDisplay = within(yearViewNavigation).getByRole(ROLES.datepickerNavigationDisplay);
			const currMonthTag = within(yearViewNavigation).getByRole(ROLES.tag);
			const yearViewTable = within(yearView).getByRole(ROLES.datepickerBodyTable);
			const months = within(yearViewTable).getAllByRole(ROLES.datepickerBodyTableCell);
			const selectedMonth = within(yearViewTable).getByRole(ROLES.datepickerBodyTableCell, {
				current: "date",
			});
			navButtons = within(yearViewNavigation).getAllByRole(ROLES.button);

			// Check head and navigation
			expect(monthTag).toHaveAttribute("aria-selected", "true");
			expect(currMonthTag).toHaveTextContent("This month");
			expect(navButtons).toHaveLength(2);
			expect(navDisplay).toHaveTextContent(today.getFullYear().toString());

			// Check months
			expect(months).toHaveLength(12);
			expect(selectedMonth).toHaveAttribute("aria-selected", "true");

			await step("Select previous year", async () => {
				await userEvent.click(navButtons[0]);
				expect(onDisplayYearChangeTest).toHaveBeenCalledWith(today.getFullYear() - 1);
				expect(navDisplay).toHaveTextContent((today.getFullYear() - 1).toString());
			});

			await step("Select next year", async () => {
				await userEvent.click(navButtons[1]);
				expect(onDisplayYearChangeTest).toHaveBeenCalledWith(today.getFullYear());
				expect(navDisplay).toHaveTextContent(today.getFullYear().toString());
			});

			await step("Click on a month", async () => {
				await userEvent.click(months[0]);
				expect(onDateSelectTest).toHaveBeenCalled();
				expect(navDisplay).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { year: "numeric" }).format(today),
				);

				expect(dateTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(today),
				);
				expect(monthTag).toHaveTextContent("01");
				expect(yearTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { year: "numeric" }).format(today),
				);
			});

			await step("Click on 'This month' tag", async () => {
				await userEvent.click(currMonthTag);
				expect(onDateSelectTest).toHaveBeenCalled();
				expect(navDisplay).toHaveTextContent(today.getFullYear().toString());

				expect(dateTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(today),
				);
				expect(monthTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(today),
				);
				expect(yearTag).toHaveTextContent(
					Intl.DateTimeFormat("en-US", { year: "numeric" }).format(today),
				);
				expect(
					within(yearViewTable).getByRole(ROLES.datepickerBodyTableCell, { current: "date" }),
				).toHaveAttribute("aria-selected", "true");
			});
		});

		await step("QuarterView", async () => {
			await userEvent.click(yearTag);
			const quarterView = within(picker).getByRole(ROLES.datepickerBody);
			const quarterViewNavigation = within(quarterView).getByRole(ROLES.datepickerNavigation);
			const currYearTag = within(quarterViewNavigation).getByRole(ROLES.tag);
			const quarterViewTable = within(quarterView).getByRole(ROLES.datepickerBodyTable);
			const years = within(quarterViewTable).getAllByRole(ROLES.datepickerBodyTableCell);
			const selectedYear = within(quarterViewTable).getByRole(ROLES.datepickerBodyTableCell, {
				current: "date",
			});
			navButtons = within(quarterViewNavigation).getAllByRole(ROLES.button);

			// Check head and navigation
			expect(yearTag).toHaveAttribute("aria-selected", "true");
			expect(currYearTag).toHaveTextContent("This year");
			expect(navButtons).toHaveLength(2);

			// Check years
			expect(years).toHaveLength(25);
			expect(selectedYear).toHaveAttribute("aria-selected", "true");

			await step("Select previous quarter", async () => {
				await userEvent.click(navButtons[0]);
				expect(onDisplayYearChangeTest).toHaveBeenCalledWith(today.getFullYear() - 25);
			});

			await step("Select next quarter", async () => {
				await userEvent.click(navButtons[1]);
				expect(onDisplayYearChangeTest).toHaveBeenCalledWith(today.getFullYear());
			});

			await step("Click on a year", async () => {
				await userEvent.click(
					within(quarterViewTable).getByRole(ROLES.datepickerBodyTableCell, {
						name: (today.getFullYear() - 5).toString(),
					}),
				);
				expect(onDateSelectTest).toHaveBeenCalled();
				expect(onDisplayYearChangeTest).toHaveBeenCalledWith(today.getFullYear() - 5);
				expect(
					within(quarterViewTable).getByRole(ROLES.datepickerBodyTableCell, { current: "date" }),
				).not.toHaveAttribute("aria-selected", "true");
			});

			await step("Click on 'This year' tag", async () => {
				await userEvent.click(currYearTag);
				expect(onDateSelectTest).toHaveBeenCalled();
				expect(
					within(quarterViewTable).getByRole(ROLES.datepickerBodyTableCell, { current: "date" }),
				).toHaveAttribute("aria-selected", "true");
			});
		});

		// For chromatic testing
		await step("Reset to 20th of June 2024", async () => {
			await ResetDatePicker(picker);
		});
	},
};

export const DatePickerWithTime: Story = {
	args: {
		withTime: true,
	},
	play: async ({ canvasElement, step }) => {
		const picker = within(canvasElement).getByRole(ROLES.datepicker);
		const timeTag = within(picker).getByRole(ROLES.datepickerHeadTab, {
			name: "04:13 AM",
		});

		expect(timeTag).toBeVisible();

		// For chromatic testing
		await step("Reset to 20th of June 2024", async () => {
			await ResetDatePicker(picker);
		});

		// Switching to time view
		await userEvent.click(timeTag);
		const datepickerBody = within(picker).getByRole(ROLES.datepickerBody);
		const datepickerBodyNavigation = within(datepickerBody).getByRole(ROLES.datepickerNavigation);
		const datepickerBodyTable = within(datepickerBody).getByRole(ROLES.datepickerBodyTable);
		const hours = within(datepickerBodyTable).getAllByRole(ROLES.datepickerBodyTableCell);
		const selectedHour = within(datepickerBodyTable).getByRole(ROLES.datepickerBodyTableCell, {
			current: "time",
		});
		const hoursInput = within(datepickerBodyNavigation).getByRole(ROLES.input, {
			name: "Enter hours",
		});
		const minutesInput = within(datepickerBodyNavigation).getByRole(ROLES.input, {
			name: "Enter minutes",
		});
		const AMPMButtons = within(datepickerBodyNavigation).getAllByRole(ROLES.button);

		await step("Check time table", async () => {
			expect(hoursInput).toHaveValue(4);
			expect(hoursInput).toHaveFocus();
			expect(hours).toHaveLength(12);
			expect(selectedHour).toHaveTextContent("04");
			expect(AMPMButtons).toHaveLength(2);
			expect(AMPMButtons[0]).toHaveAttribute("aria-selected", "true");

			await userEvent.click(hours[0]);
			expect(onDateSelectTest).toHaveBeenCalled();
			expect(hours[0]).toHaveAttribute("aria-current", "time");

			await userEvent.click(minutesInput);
			const minutes = within(datepickerBodyTable).getAllByRole(ROLES.datepickerBodyTableCell);
			const selectedMinute = within(datepickerBodyTable).getByRole(ROLES.datepickerBodyTableCell, {
				current: "time",
			});

			expect(minutes).toHaveLength(60);
			expect(selectedMinute).toHaveTextContent("13");

			await userEvent.click(minutes[0]);
			expect(onDateSelectTest).toHaveBeenCalled();
			expect(minutes[0]).toHaveAttribute("aria-current", "time");

			await userEvent.click(AMPMButtons[1]);
			expect(onDateSelectTest).toHaveBeenCalled();
			expect(AMPMButtons[1]).toHaveAttribute("aria-selected", "true");
			expect(timeTag).toHaveTextContent("01:01 PM");
		});
	},
};

export const DatePickerWithAllProps: Story = {
	args: {
		displayYear: 2024,
		startOfWeek: 0,
		changingType: "date",
		withTime: true,
		lastSelection: testLastSelection,
		dateLimits: testLimits,
	},
	play: async ({ canvasElement, step }) => {
		const picker = within(canvasElement).getByRole(ROLES.datepicker);
		const datepickerHead = within(picker).getByRole(ROLES.datepickerHead);
		const yearTag = within(datepickerHead).getByRole(ROLES.datepickerHeadTab, {
			name: "2024",
		});
		const datepickerBody = within(picker).getByRole(ROLES.datepickerBody);
		const datepickerBodyTable = within(datepickerBody).getByRole(ROLES.datepickerBodyTable);
		const weekDays = within(datepickerBodyTable).getAllByRole(ROLES.datepickerBodyTableHeadCell);
		const lastSelectionTag = within(datepickerBody).getByRole(ROLES.tag, {
			name: testLastSelection.toLocaleDateString("en-GB"),
		});

		await step("Check first day of week", async () => {
			expect(weekDays[0]).toHaveTextContent("Su");
		});

		await step("Check last selection", async () => {
			expect(lastSelectionTag).toBeVisible();
			await userEvent.click(lastSelectionTag);
			expect(onDateSelectTest).toHaveBeenCalled();
			expect(
				within(datepickerBodyTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: testLastSelection.toDateString(),
				}),
			).toHaveTextContent(testLastSelection.getDate().toString());
		});

		await step("Check date limits", async () => {
			await step("Select date before limit", async () => {
				await userEvent.click(yearTag);
				const yearView = within(picker).getByRole(ROLES.datepickerBody);
				const yearViewTable = within(yearView).getByRole(ROLES.datepickerBodyTable);
				const yearBackButton = within(yearView).getByRole(ROLES.button, {
					name: "Back to month selection",
				});
				const disabledYear = within(yearViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: "2015",
				});

				expect(disabledYear).toBeDisabled();

				await userEvent.click(
					within(yearViewTable).getByRole(ROLES.datepickerBodyTableCell, {
						name: "2016",
					}),
				);
				await userEvent.click(yearBackButton);

				const monthView = within(picker).getByRole(ROLES.datepickerBody);
				const monthViewTable = within(monthView).getByRole(ROLES.datepickerBodyTable);
				const disabledMonth = within(monthViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: "Select Jul 2016",
				});
				const selectedMonth = within(monthViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: "Select Aug 2016",
				});

				expect(disabledMonth).toBeDisabled();
				expect(selectedMonth).toHaveAttribute("aria-selected", "true");
				const monthBackButton = within(monthView).getByRole(ROLES.button, {
					name: "Back to day selection",
				});

				await userEvent.click(monthBackButton);

				const dateView = within(picker).getByRole(ROLES.datepickerBody);
				const dateViewTable = within(dateView).getByRole(ROLES.datepickerBodyTable);
				const disabledDay = within(dateViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: new Date(testLimits[0].setDate(14)).toDateString(),
				});

				expect(disabledDay).toBeDisabled();
			});

			await step("Select date after limit", async () => {
				await userEvent.click(yearTag);
				const yearView = within(picker).getByRole(ROLES.datepickerBody);
				const yearViewTable = within(yearView).getByRole(ROLES.datepickerBodyTable);
				const yearBackButton = within(yearView).getByRole(ROLES.button, {
					name: "Back to month selection",
				});
				const disabledYear = within(yearViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: "2025",
				});

				expect(disabledYear).toBeDisabled();

				await userEvent.click(
					within(yearViewTable).getByRole(ROLES.datepickerBodyTableCell, {
						name: "2024",
					}),
				);
				await userEvent.click(yearBackButton);

				const monthView = within(picker).getByRole(ROLES.datepickerBody);
				const monthViewTable = within(monthView).getByRole(ROLES.datepickerBodyTable);
				const disabledMonth = within(monthViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: "Select Jun 2024",
				});
				const selectedMonth = within(monthViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: "Select May 2024",
				});

				expect(disabledMonth).toBeDisabled();
				expect(selectedMonth).toHaveAttribute("aria-selected", "true");

				const monthBackButton = within(monthView).getByRole(ROLES.button, {
					name: "Back to day selection",
				});

				await userEvent.click(monthBackButton);

				const dateView = within(picker).getByRole(ROLES.datepickerBody);
				const dateViewTable = within(dateView).getByRole(ROLES.datepickerBodyTable);
				const lastAbleDay = within(dateViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: testLimits[1].toDateString(),
				});
				const disabledDay = within(dateViewTable).getByRole(ROLES.datepickerBodyTableCell, {
					name: new Date(testLimits[1].setDate(29)).toDateString(),
				});

				expect(disabledDay).toBeDisabled();
				expect(lastAbleDay).toHaveAttribute("aria-selected", "true");
			});
		});
	},
};
