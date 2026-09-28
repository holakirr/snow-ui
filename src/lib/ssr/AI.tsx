import { AIWeights } from "../defs/AI";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const AIIcon: Icon = (props) => <IconBase {...props} weights={AIWeights} />;

export { AIIcon };
