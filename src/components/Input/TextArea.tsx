import {
	StatusIcon,
	Text,
	basicInputClasses,
	disabledInputClasses,
	focusInputClasses,
	statusInputClasses,
} from "@components";
import { ROLES } from "@constants";
import type { Status } from "@utils";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type TextAreaProps = ComponentProps<"textarea"> & {
	status?: Status;
	error?: string;
	textLimit?: number;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	(
		{ className, id, status, error, textLimit, onChange, value, ...props },
		ref,
	) => (
		<div className="flex flex-col gap-2">
			<div className="relative flex">
				<textarea
					role={ROLES.textarea}
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
				{status && (
					<StatusIcon
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
			{error && <Text className="text-secondary-red">{error}</Text>}
		</div>
	),
);

TextArea.displayName = "TextArea";
export { TextArea };
