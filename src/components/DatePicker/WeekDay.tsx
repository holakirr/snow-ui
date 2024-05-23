import { Text } from "../Text";

type WeekDayProps = {
	label: string;
} & React.ComponentProps<"span">;

export const WeekDay = ({ label }: WeekDayProps) => (
	<Text as="span" className="px-4 py-2 text-black-40 text-center" size={12}>
		{label}
	</Text>
);
