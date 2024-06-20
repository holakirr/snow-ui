import { twMerge } from "tailwind-merge";

type THProps = React.ComponentProps<"th">;

const TH = ({ className, ...props }: THProps) => (
	<th
		className={twMerge(
			"text-xs text-black-40 text-left p-3 font-normal border-b border-black-20",
			className,
		)}
		{...props}
	/>
);

TH.displayName = "TableB.TH";
export { TH };
