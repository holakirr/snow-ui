import type { CustomIconProps } from "@utils";
import { forwardRef } from "react";
import { DotsThreeOutlineHorizontalWeights } from "../defs";
import { CustomIconBase } from "../lib";

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
