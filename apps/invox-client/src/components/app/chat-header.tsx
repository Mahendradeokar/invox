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
        "basis-[var(--header-height)] flex items-center border-b shadow-xs inset-shadow-xs -mx-4 px-4",
        className
      )}
    >
      <div className="flex items-center justify-center px-3 mr-8 gap-1.5">
        <Image
          src="/main-logo.png"
          alt="Invox Logo"
          width="20"
          height="20"
          className="h-5 w-5"
        />
        <span className="text-lg font-semibold flex items-center">Invox</span>
      </div>

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
