import { forwardRef } from "react";
import {
	CustomIconBase,
	DotsThreeOutlineVerticalWeights,
	type CustomIconProps,
} from "..";

export const DotsThreeOutlineVerticalIcon = forwardRef<
	SVGSVGElement,
	CustomIconProps
>((props, ref) => (
	<CustomIconBase
		ref={ref}
		{...props}
		weights={DotsThreeOutlineVerticalWeights}
	/>
));
