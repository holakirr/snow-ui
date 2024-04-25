import { CustomIconBase, DotsThreeOutlineHorizontalWeights } from "@components";
import type { CustomIconProps } from "@types";
import { forwardRef } from "react";

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
