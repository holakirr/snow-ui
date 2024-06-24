import { twMerge } from "tailwind-merge";
import { Text } from "../../components";

type CellData = {
	key: string;
	render: React.ReactNode;
};

type RowData = {
	key: string;
	cells: CellData[];
};

export type TableBProps = React.ComponentProps<"table"> & {
	caption: React.ReactNode;
	columns: string[];
	dataSource: RowData[];
};

const TableB = ({ caption, columns, dataSource, className, ...props }: TableBProps) => (
	<table
		className={twMerge("flex flex-col p-6 rounded-2xl bg-primary-light", className)}
		{...props}
	>
		<Text as="caption" size={14} semibold className={twMerge("text-black-100 mb-1", className)}>
			{caption}
		</Text>
		<tbody className={twMerge("table", className)}>
			<tr>
				{columns.map((col, i) => (
					<th
						key={col}
						className={twMerge(
							"text-xs text-black-40 text-left p-3 font-normal border-b border-black-20",
							i === 0 ? "pl-0 text-left" : "",
						)}
					>
						{col}
					</th>
				))}
			</tr>
			{dataSource.map(({ key, cells }) => (
				<tr key={key}>
					{cells.map(({ key, render }, j) => (
						<td
							key={key}
							className={twMerge("text-xs text-black-100 font-normal p-3", j === 0 ? "pl-0" : "")}
						>
							{render}
						</td>
					))}
				</tr>
			))}
		</tbody>
	</table>
);

TableB.displayName = "TableB";
export { TableB };
