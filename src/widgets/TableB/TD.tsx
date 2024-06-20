import { twMerge } from "tailwind-merge";

type TDProps = React.ComponentProps<"td">;

const TD = ({ className, ...props }: TDProps) => (
	<td className={twMerge("text-xs text-black-100 font-normal p-3", className)} {...props} />
);

TD.displayName = "TableB.TD";
export { TD };
