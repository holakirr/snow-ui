import type { CustomIcon } from "../../../types";
import { DefaultIconWeights } from "../defs";
import { CustomIconBase } from "../lib";

const DefaultIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={DefaultIconWeights} />
);

DefaultIcon.displayName = "DefaultIcon";
export { DefaultIcon };
