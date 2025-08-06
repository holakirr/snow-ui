import { DotsThreeOutlineHorizontalWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const DotsThreeOutlineHorizontalIcon: Icon = (props) => (
	<IconBase {...props} weights={DotsThreeOutlineHorizontalWeights} />
);

DotsThreeOutlineHorizontalIcon.displayName = "DotsThreeOutlineHorizontalIcon";
export { DotsThreeOutlineHorizontalIcon };
