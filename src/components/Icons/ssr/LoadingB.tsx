import { twMerge } from "tailwind-merge";
import type { CustomIcon } from "../../../types";
import { LoadingBWeights } from "../defs";
import { CustomIconBase } from "../lib";

const LoadingBIcon: CustomIcon = (props) => (
	<CustomIconBase
		{...props}
		weights={LoadingBWeights}
		className={twMerge("animate-loaderB", props.className)}
	/>
);

LoadingBIcon.displayName = "LoadingBIcon";
export { LoadingBIcon };
