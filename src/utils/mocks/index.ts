import {
	ArrowLineDownIcon,
	DefaultIcon,
	FourLeafCloverIcon,
} from "../../components/Icons/ssr";
import {
	BUTTON_VARIANTS,
	COLOR_SCHEME,
	ICON_WEIGHTS,
	SIZES,
	STATUSES,
} from "../../consts";

export const imageMocks = {
	man: "https://avatar.iran.liara.run/public/38",
	woman: "https://avatar.iran.liara.run/public/61",
	chef: "https://avatar.iran.liara.run/public/job/chef/female",
};

export const colorControl = {
	control: "select",
	options: Object.keys(COLOR_SCHEME.secondary),
};

export const imgControl = {
	control: "radio",
	options: [...Object.values(imageMocks), null],
};

export const iconControl = {
	control: "radio",
	options: [
		"Nothing",
		ArrowLineDownIcon.displayName,
		DefaultIcon.displayName,
		FourLeafCloverIcon.displayName,
	],
	mapping: {
		ArrowLineDownIcon,
		DefaultIcon,
		FourLeafCloverIcon,
		Nothing: undefined,
	},
};

export const sizeControl = {
	control: "radio",
	options: Object.values(SIZES),
	description: "The size of the button",
};

export const weightControl = {
	control: "radio",
	options: Object.values(ICON_WEIGHTS),
	description: "The weight of the icon",
};

export const buttonVariantControl = {
	control: "radio",
	options: Object.values(BUTTON_VARIANTS),
	description: "The style variant of the button",
};

export const statusControl = {
	control: "radio",
	options: [null, ...Object.values(STATUSES)],
};

export const badgeStatusControl = {
	control: "radio",
	options: ["default", "success", "info", "warning", "error"],
};
