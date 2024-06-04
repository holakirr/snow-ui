import type { CustomIcon } from "@types";
import { VerticalScreenWeights } from "../defs";
import { CustomIconBase } from "../lib";

const VerticalScreenIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={VerticalScreenWeights} />
);

VerticalScreenIcon.displayName = "VerticalScreenIcon";
export { VerticalScreenIcon };
