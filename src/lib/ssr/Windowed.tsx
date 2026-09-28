import { WindowedWeights } from "../defs/Windowed";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const WindowedIcon: Icon = (props) => <IconBase {...props} weights={WindowedWeights} />;

export { WindowedIcon };
