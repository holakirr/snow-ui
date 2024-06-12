import type { CustomIcon } from "../../../types";
import { AddWeights } from "../defs";
import { CustomIconBase } from "../lib";

const AddIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={AddWeights} />;

AddIcon.displayName = "AddIcon";
export { AddIcon };
