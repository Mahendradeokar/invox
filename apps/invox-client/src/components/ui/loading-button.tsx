import { Loader2 } from "lucide-react";
import { Button } from "./button";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  isLoading?: boolean;
  loadingLabel?: React.ReactNode;
};

const LoadingButton = ({
  isLoading,
  loadingLabel = "Saving",
  children,
  disabled,
  ...props
}: LoadingButtonProps) => (
  <Button disabled={isLoading || disabled} {...props}>
    {isLoading ? (
      <>
        <Loader2 className="mr-1 size-4 animate-spin" />
        {loadingLabel}
      </>
    ) : (
      children
    )}
  </Button>
);

export { LoadingButton };
