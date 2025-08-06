import { DocXWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const DocXIcon: Icon = (props) => <IconBase {...props} weights={DocXWeights} />;

DocXIcon.displayName = "DocXIcon";
export { DocXIcon };
