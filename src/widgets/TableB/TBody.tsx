import { twMerge } from "tailwind-merge";

type TBodyProps = React.ComponentProps<"tbody">;

const TBody = ({ className, ...props }: TBodyProps) => (
	<tbody className={twMerge("table", className)} {...props} />
);

TBody.displayName = "TableB.TBody";
export { TBody };
