import type { CustomIcon } from "@types";
import { TXTWeights } from "../defs";
import { CustomIconBase } from "../lib";

const TXTIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={TXTWeights} />;

TXTIcon.displayName = "TXTIcon";
export { TXTIcon };
