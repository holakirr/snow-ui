import { twMerge } from "tailwind-merge";
import { ROLES, TEXT_SIZES } from "../../constants";
import type { Status } from "../../types";
import { StatusIcon } from "../Icons";
import { Text } from "../Text";
import { statusInputClasses } from "./Input";
import { basicInputClasses, disabledInputClasses, focusInputClasses } from "./InputBase";

/**
 * Props for the TextArea component.
 */
type TextAreaProps = React.ComponentProps<"textarea"> & {
	/**
	 * The status of the TextArea.
	 */
	status?: Status;

	/**
	 * The error message to display for the TextArea.
	 */
	error?: string;

	/**
	 * The maximum number of characters allowed in the TextArea.
	 */
	textLimit?: number;
};

/**
 * TextArea component displays a text area input field.
 */
const TextArea = ({
	className,
	id,
	status,
	error,
	textLimit,
	onChange,
	value,
	ref,
	...props
}: TextAreaProps) => (
	<div className="flex flex-col gap-2">
		<div className="relative flex">
			<textarea
				role={ROLES.textbox}
				id={id}
				ref={ref}
				maxLength={textLimit}
				className={twMerge(
					basicInputClasses,
					disabledInputClasses,
					focusInputClasses,
					"pt-4 pb-7 resize text-sm",
					status && statusInputClasses,
					className,
				)}
				onChange={onChange}
				{...props}
			/>
			{status && <StatusIcon status={status} className="absolute right-5 top-4" size={20} />}
			{textLimit && (
				<Text
					size={TEXT_SIZES[12]}
					className="absolute text-black-20 bottom-1 right-6 w-min text-right"
				>{`${value ? value.toString().length : 0}/${textLimit}`}</Text>
			)}
		</div>
		{error && (
			<Text className="text-secondary-red" size={TEXT_SIZES[12]}>
				{error}
			</Text>
		)}
	</div>
);

TextArea.displayName = "TextArea";
export { TextArea };
