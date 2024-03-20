import { forwardRef } from "react";
import {
	CustomIconBase,
	type CustomIconProps,
	DotsThreeOutlineHorizontalWeights,
} from "..";

const DotsThreeOutlineHorizontalIcon = forwardRef<
	SVGSVGElement,
	CustomIconProps
>((props, ref) => (
	<CustomIconBase
		ref={ref}
		{...props}
		weights={DotsThreeOutlineHorizontalWeights}
	/>
));

DotsThreeOutlineHorizontalIcon.displayName = "DotsThreeOutlineHorizontalIcon";
export { DotsThreeOutlineHorizontalIcon };
