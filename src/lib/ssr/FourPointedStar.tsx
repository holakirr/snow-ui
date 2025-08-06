import { FourPointedStarWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const FourPointedStarIcon: Icon = (props) => (
	<IconBase {...props} weights={FourPointedStarWeights} />
);

FourPointedStarIcon.displayName = "FourPointedStarIcon";
export { FourPointedStarIcon };
