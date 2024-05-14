import type { Dayjs } from "dayjs";

export const getDate = (date: Dayjs) => {
	const day = date.date();
	const weekday = date.day();
	const month = date.month();
	const year = date.year();
	const hour = date.hour() > 12 ? date.hour() - 12 : date.hour();
	const minute = date.minute();
	const AMPM = date.format("A");

	return { day, weekday, month, year, hour, minute, AMPM };
};
