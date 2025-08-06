import { CopyWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const CopyIcon: Icon = (props) => <IconBase {...props} weights={CopyWeights} />;

CopyIcon.displayName = "CopyIcon";
export { CopyIcon };
