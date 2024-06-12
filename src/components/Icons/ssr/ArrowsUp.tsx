import type { CustomIcon } from "../../../types";
import { ArrowsUpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ArrowsUpIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={ArrowsUpWeights} />;

ArrowsUpIcon.displayName = "ArrowsUpIcon";
export { ArrowsUpIcon };
