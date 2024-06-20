import { twMerge } from "tailwind-merge";

type TableProps = React.ComponentProps<"table">;

const TableB = ({ className, ...props }: TableProps) => (
	<table
		className={twMerge("flex flex-col p-6 gap-1 rounded-2xl bg-primary-light", className)}
		{...props}
	/>
);

TableB.displayName = "TableB";
export { TableB };
