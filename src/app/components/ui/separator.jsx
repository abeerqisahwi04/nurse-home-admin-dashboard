import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "./utils";

function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <div
      data-slot="separator"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
