import { FourLeafCloverWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const FourLeafCloverIcon: Icon = (props) => <IconBase {...props} weights={FourLeafCloverWeights} />;

FourLeafCloverIcon.displayName = "FourLeafCloverIcon";
export { FourLeafCloverIcon };
