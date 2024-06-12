import type { CustomIcon } from "../../../types";
import { RoundedCornerWeights } from "../defs";
import { CustomIconBase } from "../lib";

const RoundedCornerIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={RoundedCornerWeights} />
);

RoundedCornerIcon.displayName = "RoundedCornerIcon";
export { RoundedCornerIcon };
