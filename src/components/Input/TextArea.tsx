import {
	type ChangeEvent,
	type ComponentProps,
	forwardRef,
	useEffect,
	useState,
} from "react";
import { twMerge } from "tailwind-merge";
import {
	Text,
	basicInputClasses,
	disabledInputClasses,
	focusInputClasses,
	statusInputClasses,
} from "..";
import { InputStatusIcon } from "./InputStatusIcon";

type TextAreaProps = ComponentProps<"textarea"> & {
	status?: "progress" | "success" | "error";
	error?: string;
	textLimit?: number;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	(
		{ className, id, status, error, textLimit, onChange, value, ...props },
		ref,
	) => {
		const [hideStatus, setHideStatus] = useState<boolean>(false);

		useEffect(() => {
			setHideStatus(!status);
		}, [status]);

		const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
			setHideStatus(true);
			onChange?.(e);
		};

		return (
			<div className="flex flex-col gap-2">
				<div className="relative flex">
					<textarea
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
						onChange={onChangeHandler}
						{...props}
					/>
					{status && !hideStatus && (
						<InputStatusIcon
							status={status}
							className="absolute right-5 top-4"
							size={20}
						/>
					)}
					{textLimit && (
						<Text
							size={12}
							className="absolute text-black-20 bottom-1 right-6 w-min text-right"
						>{`${value ? value.toString().length : 0}/${textLimit}`}</Text>
					)}
				</div>
				{!hideStatus && error && (
					<Text className="text-secondary-red">{error}</Text>
				)}
			</div>
		);
	},
);

TextArea.displayName = "TextArea";
export { TextArea };
