import { Avatar } from "../../components";
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

export const imageSrcMocks = {
	man: "https://avatar.iran.liara.run/public/38",
	woman: "https://avatar.iran.liara.run/public/61",
	chef: "https://avatar.iran.liara.run/public/job/chef/female",
};

export const imageMocks = {
	woman: <img alt="woman" width={24} height={24} src={imageSrcMocks.woman} />,
	flowerIcon: <FourLeafCloverIcon size={16} alt="flower icon" />,
	avatar: <Avatar img={imageSrcMocks.man} username="" />,
};

export const colorControl = {
	control: "select",
	options: Object.keys(COLOR_SCHEME.secondary),
};

export const imgSourceControl = {
	control: "radio",
	options: [...Object.values(imageSrcMocks), null],
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

export const imageControl = {
	control: "radio",
	options: ["woman", "flowerIcon", "avatar", "Nothing"],
	mapping: {
		...imageMocks,
		Nothing: null,
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

export const keyBindingsControl = {
	control: "radio",
	options: ["CTRL+C", "CMD+/", "RETURN", "CMD+SHIFT+C", "Nothing"],
	mapping: {
		"CTRL+C": ["Ctrl", "C"],
		"CMD+/": ["⌘", "/"],
		RETURN: ["↩︎"],
		"CMD+SHIFT+C": ["Cmd", "Shift", "C"],
		Nothing: [],
	},
};
