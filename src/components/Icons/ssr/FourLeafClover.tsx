import { CustomIconBase, FourLeafCloverWeights } from "@components";
import type { CustomIcon } from "@types";
import { forwardRef } from "react";

const FourLeafCloverIcon: CustomIcon = forwardRef((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FourLeafCloverWeights} />
));

FourLeafCloverIcon.displayName = "FourLeafCloverIcon";
export { FourLeafCloverIcon };
