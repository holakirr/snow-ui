import { forwardRef } from "react";
import { FourLeafCloverWeights } from "../defs";
import { CustomIconBase } from "../lib";
import type { CustomIcon } from "../types";

const FourLeafCloverIcon: CustomIcon = forwardRef((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FourLeafCloverWeights} />
));

FourLeafCloverIcon.displayName = "FourLeafCloverIcon";
export { FourLeafCloverIcon };
