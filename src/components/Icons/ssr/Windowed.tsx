import type { CustomIcon } from "@types";
import { WindowedWeights } from "../defs";
import { CustomIconBase } from "../lib";

const WindowedIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={WindowedWeights} />;

WindowedIcon.displayName = "WindowedIcon";
export { WindowedIcon };
