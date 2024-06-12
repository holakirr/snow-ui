import type { CustomIcon } from "../../../types";
import { SnowUIWeights } from "../defs";
import { CustomIconBase } from "../lib";

const SnowUIIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={SnowUIWeights} />;

SnowUIIcon.displayName = "SnowUIIcon";
export { SnowUIIcon };
