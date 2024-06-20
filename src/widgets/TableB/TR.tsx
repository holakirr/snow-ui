type TRProps = React.ComponentProps<"tr">;

const TR = ({ ...props }: TRProps) => <tr {...props} />;

TR.displayName = "TableB.TR";
export { TR };
