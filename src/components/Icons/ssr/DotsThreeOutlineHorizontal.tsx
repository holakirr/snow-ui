import type { CustomIcon } from "@types";
import { DotsThreeOutlineHorizontalWeights } from "../defs";
import { CustomIconBase } from "../lib";

const DotsThreeOutlineHorizontalIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={DotsThreeOutlineHorizontalWeights} />
);

DotsThreeOutlineHorizontalIcon.displayName = "DotsThreeOutlineHorizontalIcon";
export { DotsThreeOutlineHorizontalIcon };
