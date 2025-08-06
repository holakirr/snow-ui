import { FormWeights } from "../defs";
import { IconBase } from "../IconBase";
import type { Icon } from "../types";

const FormIcon: Icon = (props) => <IconBase {...props} weights={FormWeights} />;

FormIcon.displayName = "FormIcon";
export { FormIcon };
