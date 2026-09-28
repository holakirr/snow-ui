import { FourPointedStarWeights } from "../defs/FourPointedStar";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const FourPointedStarIcon: Icon = (props) => (
	<IconBase {...props} weights={FourPointedStarWeights} />
);

export { FourPointedStarIcon };
