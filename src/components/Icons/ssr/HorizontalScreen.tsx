import type { CustomIcon } from "../../../types";
import { HorizontalScreenWeights } from "../defs";
import { CustomIconBase } from "../lib";

const HorizontalScreenIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={HorizontalScreenWeights} />
);

HorizontalScreenIcon.displayName = "HorizontalScreenIcon";
export { HorizontalScreenIcon };
