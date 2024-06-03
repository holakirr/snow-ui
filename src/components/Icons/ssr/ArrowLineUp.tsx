import type { CustomIcon } from "@types";
import { ArrowLineUpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineUpIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowLineUpWeights} />
);

ArrowLineUpIcon.displayName = "ArrowLineUpIcon";
export { ArrowLineUpIcon };
