import type { Status, StatusExpanded, StatusNotify } from "@utils";

export const STATUSES_NOTIFY: {
	[K in StatusNotify]: StatusNotify;
} = {
	success: "success",
	error: "error",
} as const;

export const STATUSES: {
	[K in Status]: Status;
} = {
	...STATUSES_NOTIFY,
	progress: "progress",
} as const;

export const STATUSES_EXPANDED: {
	[K in StatusExpanded]: StatusExpanded;
} = {
	...STATUSES_NOTIFY,
	warning: "warning",
	default: "default",
	info: "info",
} as const;
