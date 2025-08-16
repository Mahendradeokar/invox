import { Edit, Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TooltipButtonProps extends ComponentProps<typeof Tooltip> {
  title: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}

const ToolTipButton = ({
  children,
  title,
  className,
  variant = "ghost",
  ...restProps
}: TooltipButtonProps) => {
  return (
    <Tooltip {...restProps}>
      <TooltipTrigger className={className}>
        <Button asChild className="h-9 w-9" variant={variant}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
};

export const ChatHeader = ({ className }: ComponentProps<"header">) => {
  return (
    <header
      role="chat-interface-header"
      className={cn(
        "h-13 flex items-center border-b shadow-xs inset-shadow-xs -mx-4 px-4",
        className
      )}
    >
      <Image
        src="http://acmelogos.com/images/logo-5.svg"
        alt="Acme Logo"
        width="64"
        height="32"
        className="h-8 w-8 mr-2"
      />

      <ToolTipButton title="New Project" className="ml-auto">
        <Link href="/project/create">
          <Edit className="h-5 w-5" />
        </Link>
      </ToolTipButton>

      <ToolTipButton title="View Projects">
        <Link href="/project">
          <Folder className="h-5 w-5" />
        </Link>
      </ToolTipButton>
    </header>
  );
};
