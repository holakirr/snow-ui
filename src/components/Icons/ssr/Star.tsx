import type { CustomIcon } from "@types";
import { StarWeights } from "../defs";
import { CustomIconBase } from "../lib";

const StarIcon: CustomIcon = (props) => <CustomIconBase {...props} weights={StarWeights} />;

StarIcon.displayName = "StarIcon";
export { StarIcon };
