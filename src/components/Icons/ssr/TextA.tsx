import type { CustomIcon } from "../../../types";
import { TextAWeights } from "../defs";
import { CustomIconBase } from "../lib";

const TextAIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={TextAWeights} />;

TextAIcon.displayName = "TextAIcon";
export { TextAIcon };
