import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../Text";

type CheckboxProps = React.ComponentProps<"input"> & {
	indeterminate?: boolean;
};

/**
 * Checkbox component displays a checkbox with a label.
 */
const Checkbox = ({
	id,
	checked,
	disabled,
	indeterminate = false,
	onChange,
	className,
	ref,
	...props
}: CheckboxProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		onChange?.(e);
	};

	return (
		<Text as="label" className="group block relative p-0.5">
			<input
				id={id}
				ref={inputRef}
				type="checkbox"
				className="absolute top-0 left-0 w-8 h-8 opacity-0 hover:cursor-pointer disabled:cursor-not-allowed"
				checked={checked}
				disabled={disabled}
				onChange={handleOnChange}
				{...props}
			/>
			<div
				className={twMerge(
					"flex justify-center items-center w-7 h-7 rounded-lg border-black-20 bg-transparent border-2 transition-colors",
					"group-hover:bg-black-5 group-hover:border-black-40",
					disabled && "border-black-10 bg-transparent",
					(checked || indeterminate) &&
						"bg-primary-brand border-0 group-hover:bg-primary-brandHover",
					(checked || indeterminate) &&
						disabled &&
						"bg-black-10 group-hover:bg-black-20 group-hover:border-black-20",
					className,
				)}
			>
				{checked && (
					<svg
						width="13"
						height="10"
						viewBox="0 0 13 10"
						fill="none"
						className="fill-white-100"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Checked {id}</title>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.0174 0.397802C12.6262 0.959708 12.6641 1.9087 12.1022 2.51743L6.47957 8.60864C5.67328 9.48212 4.2876 9.4637 3.50481 8.56909L0.371156 4.98776C-0.174368 4.36431 -0.111191 3.41667 0.512264 2.87114C1.13572 2.32562 2.08336 2.3888 2.62889 3.01225L5.02985 5.75621L9.89782 0.482587C10.4597 -0.126144 11.4087 -0.164103 12.0174 0.397802Z"
						/>
					</svg>
				)}
				{indeterminate && !checked && (
					<svg
						width="14"
						height="4"
						viewBox="0 0 14 4"
						fill="none"
						className="fill-white-100"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Indeterminate {id}</title>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H12C12.8284 0.5 13.5 1.17157 13.5 2C13.5 2.82843 12.8284 3.5 12 3.5H2C1.17157 3.5 0.5 2.82843 0.5 2Z"
						/>
					</svg>
				)}
			</div>
		</Text>
	);
};

Checkbox.displayName = "Checkbox";
export { Checkbox };
