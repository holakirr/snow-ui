import type { CustomIcon } from "../../../types";
import { ArrowsDownUpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowsDownUpIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowsDownUpWeights} />
);

ArrowsDownUpIcon.displayName = "ArrowsDownUpIcon";
export { ArrowsDownUpIcon };
