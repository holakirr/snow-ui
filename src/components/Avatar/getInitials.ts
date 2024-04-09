export const getInitials = (username: string) =>
	username
		.split(" ")
		.map((word) => word[0])
		.join("");
