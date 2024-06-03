import type { CustomIcon } from "@types";
import { FourLeafCloverWeights } from "../defs";
import { CustomIconBase } from "../lib";

const FourLeafCloverIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={FourLeafCloverWeights} />
);

FourLeafCloverIcon.displayName = "FourLeafCloverIcon";
export { FourLeafCloverIcon };
