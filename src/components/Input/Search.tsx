import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { SearchIcon } from "../Icons";
import { KBD } from "../KBD";

const searchClassnames = cva(
	"peer text-black-100 rounded-lg ps-7 pe-1 py-1 min-w-40 w-40 text-sm transition-all focus:ring-4 focus:ring-black-5 focus:outline-none",
	{
		variants: {
			variant: {
				gray: "bg-black-5 placeholder:text-black-20 hover:bg-black-10",
				outline: "bg-white-40 border-1 border-black-10 hover:border-black-40",
			},
		},
		defaultVariants: {
			variant: "outline",
		},
	},
);

type SearchProps = React.ComponentProps<"input"> &
	VariantProps<typeof searchClassnames> & {
		keyBindings?: string[];
		iconSize?: number;
	};

const Search = ({
	id,
	variant,
	className,
	keyBindings,
	value,
	iconSize,
	ref,
	...props
}: SearchProps) => (
	<div className="relative">
		<input
			{...props}
			ref={ref}
			className={twMerge(searchClassnames({ variant, className }), "peer")}
			type="search"
			id={id}
			role={ROLES.search}
		/>
		<SearchIcon
			weight="regular"
			alt={`Icon for search input ${id}`}
			className="absolute left-2 top-1/2 -translate-y-1/2 fill-black-20 peer-hover:fill-black-40 peer-focus:fill-primary-brand"
			size={iconSize || 16}
		/>
		{keyBindings && keyBindings.length > 0 && !value && (
			<KBD className="absolute right-2 top-1/2 -translate-y-1/2 " keyBindings={keyBindings} />
		)}
	</div>
);

Search.displayName = "Search";
export { Search };
