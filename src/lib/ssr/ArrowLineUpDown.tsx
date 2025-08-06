import { ArrowLineUpDownWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const ArrowLineUpDownIcon: Icon = (props) => (
	<IconBase {...props} weights={ArrowLineUpDownWeights} />
);

ArrowLineUpDownIcon.displayName = "ArrowLineUpDownIcon";
export { ArrowLineUpDownIcon };
