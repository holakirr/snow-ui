import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../..";
import { SearchIcon } from "../Icons";

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

type SearchProps = ComponentProps<"input"> &
	VariantProps<typeof searchClassnames> & {
		keys?: string[];
	};

const Search = forwardRef<HTMLInputElement, SearchProps>(
	({ variant, className, keys, value, onChange, onSubmit, ...props }, ref) => (
		<div className="relative">
			<input
				{...props}
				value={value}
				onChange={onChange}
				onSubmit={onSubmit}
				ref={ref}
				className={twMerge(searchClassnames({ variant, className }), "peer")}
				type="search"
			/>
			<SearchIcon
				weight="regular"
				alt="search icon"
				className="absolute left-2 top-1/2 -translate-y-1/2 fill-black-20 peer-hover:fill-black-40 peer-focus:fill-primary-brand"
				size={16}
			/>
			{keys && keys.length > 0 && !value && (
				<Text
					size={14}
					className="absolute right-2 top-1/2 -translate-y-1/2 w-min text-black-20"
				>
					{keys.join("")}
				</Text>
			)}
		</div>
	),
);

Search.displayName = "Search";
export { Search };
