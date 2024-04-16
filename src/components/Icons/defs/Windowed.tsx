import type { CustomIconWeights } from "@utils";
import { Fragment } from "react/jsx-runtime";

export const WindowedWeights: CustomIconWeights = new Map([
	[
		"regular",
		<Fragment key="WindowedRegular">
			<path d="M12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9H20C21.6569 9 23 10.3431 23 12V19.5C23 20.0523 23.4477 20.5 24 20.5C24.5523 20.5 25 20.0523 25 19.5V12C25 9.23858 22.7614 7 20 7H12Z" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7 13C7 11.8954 7.89543 11 9 11H19C20.1046 11 21 11.8954 21 13V23C21 24.1046 20.1046 25 19 25H9C7.89543 25 7 24.1046 7 23V13ZM9 13H19V23H9L9 13Z"
			/>
		</Fragment>,
	],
]);
