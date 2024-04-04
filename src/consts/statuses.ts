import type { Status } from "../utils";

export const STATUSES: {
	[K in Status]: Status;
} = {
	success: "success",
	progress: "progress",
	error: "error",
} as const;
