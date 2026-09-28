import { SnowUIWeights } from "../defs/SnowUI";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const SnowUIIcon: Icon = (props) => <IconBase {...props} weights={SnowUIWeights} />;

export { SnowUIIcon };
