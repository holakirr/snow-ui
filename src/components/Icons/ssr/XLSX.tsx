import type { CustomIcon } from "../../../types";
import { XLSXWeights } from "../defs";
import { CustomIconBase } from "../lib";

const XLSXIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={XLSXWeights} />;

XLSXIcon.displayName = "XLSXIcon";
export { XLSXIcon };
