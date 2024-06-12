import type { CustomIcon } from "../../../types";
import { ArrowsDownWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowsDownIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowsDownWeights} />
);

ArrowsDownIcon.displayName = "ArrowsDownIcon";
export { ArrowsDownIcon };
