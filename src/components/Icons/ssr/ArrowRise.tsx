import type { CustomIcon } from "../../../types";
import { ArrowRiseWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowRiseIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowRiseWeights} />
);

ArrowRiseIcon.displayName = "ArrowRiseIcon";
export { ArrowRiseIcon };
