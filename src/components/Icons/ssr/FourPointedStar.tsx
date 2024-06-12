import type { CustomIcon } from "../../../types";
import { FourPointedStarWeights } from "../defs";
import { CustomIconBase } from "../lib";

const FourPointedStarIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={FourPointedStarWeights} />
);

FourPointedStarIcon.displayName = "FourPointedStarIcon";
export { FourPointedStarIcon };
