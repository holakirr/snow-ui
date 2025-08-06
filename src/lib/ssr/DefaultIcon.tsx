import { DefaultIconWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const DefaultIcon: Icon = (props) => <IconBase {...props} weights={DefaultIconWeights} />;

DefaultIcon.displayName = "DefaultIcon";
export { DefaultIcon };
