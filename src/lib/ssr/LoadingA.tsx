import { LoadingAWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const LoadingAIcon: Icon = (props) => (
	<IconBase {...props} viewBox="0 0 24 24" weights={LoadingAWeights} />
);

LoadingAIcon.displayName = "LoadingAIcon";
export { LoadingAIcon };
