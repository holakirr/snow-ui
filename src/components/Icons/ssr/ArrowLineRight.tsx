import type { CustomIcon } from "@types";
import { ArrowLineRightWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineRightIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowLineRightWeights} />
);

ArrowLineRightIcon.displayName = "ArrowLineRightIcon";
export { ArrowLineRightIcon };
