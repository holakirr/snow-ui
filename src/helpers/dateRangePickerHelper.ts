import type { DateLimitsType, DateTypeEnum } from "../types";

type GetNewDateProps = {
	changingDate: Date;
	date: Date;
	changingType: DateTypeEnum;
	dateLimits: DateLimitsType;
};

export const getNewDate = ({
	changingDate,
	date,
	changingType,
	dateLimits,
}: GetNewDateProps): Date => {
	const newDate = new Date(
		["year", "month", "date"].includes(changingType)
			? date.getFullYear()
			: changingDate.getFullYear(),
		["month", "date"].includes(changingType) ? date.getMonth() : changingDate.getMonth(),
		changingType === "date" ? date.getDate() : changingDate.getDate(),
		["hours", "minutes"].includes(changingType) ? date.getHours() : changingDate.getHours(),
		["hours", "minutes"].includes(changingType) ? date.getMinutes() : changingDate.getMinutes(),
	);

	if (dateLimits) {
		const [minDate, maxDate] = dateLimits;
		if (minDate && newDate.valueOf() < minDate.valueOf()) {
			return minDate;
		}
		if (maxDate && newDate.valueOf() > maxDate.valueOf()) {
			return maxDate;
		}
	}

	return newDate;
};

type GetNewRangeProps = {
	from: Date;
	to: Date;
	date: Date;
	changingType: DateTypeEnum;
	dateLimits: DateLimitsType;
	changingFromOrTo: "from" | "to";
};

export const getNewRange = ({
	from,
	to,
	date,
	changingType,
	dateLimits,
	changingFromOrTo,
}: GetNewRangeProps): {
	from: Date;
	to: Date;
} => {
	const newDate = getNewDate({ changingDate: from, date, changingType, dateLimits });

	if (changingFromOrTo === "from") {
		if (newDate > to) {
			return { from: to, to: newDate };
		}

		return { from: newDate, to };
	}

	if (newDate < from) {
		return { from: newDate, to: from };
	}

	return { from, to: newDate };
};
