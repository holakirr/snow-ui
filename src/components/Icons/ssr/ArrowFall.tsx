import type { CustomIcon } from "@types";
import { ArrowFallWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowFallIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ArrowFallWeights} />
);

ArrowFallIcon.displayName = "ArrowFallIcon";
export { ArrowFallIcon };
