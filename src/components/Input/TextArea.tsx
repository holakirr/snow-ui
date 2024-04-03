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
import "./TextArea.module.css";

type TextAreaProps = ComponentProps<"textarea"> & {
	status?: "progress" | "success" | "error";
	error?: string;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	({ className, id, status, error, onChange, ...props }, ref) => {
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
				<div className="relative">
					<textarea
						id={id}
						ref={ref}
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
