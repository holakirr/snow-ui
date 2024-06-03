import type { CustomIcon } from "@types";
import { HelpWeights } from "../defs";
import { CustomIconBase } from "../lib";

const HelpIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={HelpWeights} />;

HelpIcon.displayName = "HelpIcon";
export { HelpIcon };
