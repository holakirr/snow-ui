import { forwardRef } from "react";
import { type CustomIcon, CustomIconBase, FourLeafCloverWeights } from "..";

const FourLeafCloverIcon: CustomIcon = forwardRef((props, ref) => (
	<CustomIconBase ref={ref} {...props} weights={FourLeafCloverWeights} />
));

FourLeafCloverIcon.displayName = "FourLeafCloverIcon";
export { FourLeafCloverIcon };
