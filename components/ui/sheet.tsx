"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

// Use os componentes do próprio Radix para satisfazer acessibilidade
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;

export function SheetHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", props.className)} {...props} />;
}

export function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: "left" | "right" | "top" | "bottom";
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-primary-900 border border-primary-700 p-6 shadow-lg outline-none",
          side === "right" && "top-0 right-0 h-full w-80",
          side === "left" && "top-0 left-0 h-full w-80",
          side === "top" && "top-0 left-0 right-0 h-1/2",
          side === "bottom" && "bottom-0 left-0 right-0 h-1/2",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
