import type { CustomIcon } from "@types";
import { ArrowRightWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowRightIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowRightWeights} />
);

ArrowRightIcon.displayName = "ArrowRightIcon";
export { ArrowRightIcon };
