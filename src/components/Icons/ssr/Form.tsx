import type { CustomIcon } from "../../../types";
import { FormWeights } from "../defs";
import { CustomIconBase } from "../lib";

const FormIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={FormWeights} />;

FormIcon.displayName = "FormIcon";
export { FormIcon };
