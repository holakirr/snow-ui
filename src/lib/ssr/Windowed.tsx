import { WindowedWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const WindowedIcon: Icon = (props) => <IconBase {...props} weights={WindowedWeights} />;

WindowedIcon.displayName = "WindowedIcon";
export { WindowedIcon };
