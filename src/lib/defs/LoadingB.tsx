import type { CustomIconWeights } from "../types";

const x = 11;
const y = 1;
const width = 2;
const height = 5;

export const LoadingBWeights: CustomIconWeights = new Map([
	[
		"regular",
		<g key="LoadingBRegular" stroke="none">
			<rect x={x} y={y} width={width} height={height} transform="rotate(30 12 12)" opacity=".08" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(60 12 12)" opacity=".17" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(90 12 12)" opacity=".25" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(120 12 12)" opacity=".33" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(150 12 12)" opacity=".42" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(180 12 12)" opacity=".5" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(210 12 12)" opacity=".58" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(240 12 12)" opacity=".67" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(270 12 12)" opacity=".75" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(300 12 12)" opacity=".83" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(330 12 12)" opacity=".92" />
			<rect x={x} y={y} width={width} height={height} transform="rotate(360 12 12)" opacity="1" />
			<animateTransform
				attributeName="transform"
				type="rotate"
				calcMode="discrete"
				dur="0.75s"
				values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
				repeatCount="indefinite"
			/>
		</g>,
	],
]);
