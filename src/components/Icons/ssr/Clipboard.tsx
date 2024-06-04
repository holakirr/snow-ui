import type { CustomIcon } from "@types";
import { ClipboardWeights } from "../defs";
import { CustomIconBase } from "../lib";

const ClipboardIcon: CustomIcon = (props) => (
	<CustomIconBase {...props} weights={ClipboardWeights} />
);

ClipboardIcon.displayName = "ClipboardIcon";
export { ClipboardIcon };
