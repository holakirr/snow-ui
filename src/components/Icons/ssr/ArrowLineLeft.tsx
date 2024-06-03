import type { CustomIcon } from "@types";
import { ArrowLineLeftWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowLineLeftIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowLineLeftWeights} />
);

ArrowLineLeftIcon.displayName = "ArrowLineLeftIcon";
export { ArrowLineLeftIcon };
