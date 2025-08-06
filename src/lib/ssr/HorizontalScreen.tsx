import { HorizontalScreenWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const HorizontalScreenIcon: Icon = (props) => (
	<IconBase {...props} weights={HorizontalScreenWeights} />
);

HorizontalScreenIcon.displayName = "HorizontalScreenIcon";
export { HorizontalScreenIcon };
