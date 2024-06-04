import type { CustomIcon } from "@types";
import { RectangleWeights } from "../defs";
import { CustomIconBase } from "../lib";

const RectangleIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={RectangleWeights} />
);

RectangleIcon.displayName = "RectangleIcon";
export { RectangleIcon };
