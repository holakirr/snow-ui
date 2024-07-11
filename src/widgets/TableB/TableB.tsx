import { twMerge } from "tailwind-merge";
import { Text } from "../../components";
import { ROLES, TEXT_SIZES } from "../../constants";

type CellData = {
	key: string;
	render: React.ReactNode;
};

type RowData = {
	key: string;
	cells: CellData[];
};

export type TableBProps = React.ComponentProps<"table"> & {
	caption?: React.ReactNode;
	columns?: string[];
	dataSource: RowData[];
};

const TableB = ({
	caption,
	columns,
	dataSource,
	className,
	"aria-label": label,
	...props
}: TableBProps) => (
	<div className={twMerge("p-6 rounded-2xl bg-primary-light", className)}>
		{caption && typeof caption !== "string" && <div className="mb-1">{caption}</div>}
		<table aria-label={caption || label ? `Table ${caption || label}` : "Table"} {...props}>
			{caption && typeof caption === "string" && (
				<Text
					as="caption"
					role={ROLES.caption}
					size={TEXT_SIZES[14]}
					semibold
					className="text-black-100 mb-1"
				>
					{caption}
				</Text>
			)}
			{columns && (
				<thead
					className="border-b border-black-20"
					aria-label={caption || label ? `Head of table ${caption || label}` : "Head of table"}
				>
					<tr>
						{columns.map((col, i) => (
							<th
								key={col}
								className={twMerge(
									"text-xs text-black-40 text-left h-10 font-normal px-3",
									i === 0 ? "pl-0 text-left" : "",
								)}
							>
								{col}
							</th>
						))}
					</tr>
				</thead>
			)}
			<tbody aria-label={caption || label ? `Body of table ${caption || label}` : "Body of table"}>
				{dataSource.map(({ key, cells }) => (
					<tr key={key}>
						{cells.map(({ key, render }, j) => (
							<td
								key={key}
								className={twMerge(
									"text-xs text-black-100 font-normal h-10 px-3",
									j === 0 ? "pl-0" : "",
								)}
							>
								{render}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

TableB.displayName = "TableB";
export { TableB };
