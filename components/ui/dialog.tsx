import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

function Dialog({
  open,
  onOpenChange,
  dismissible = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
  dismissible?: boolean;
}) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (!dismissible && !nextOpen) {
          const reason = details?.reason as string | undefined;
          if (
            reason === "escape-key" ||
            reason === "outside-press" ||
            reason === "focus-out" ||
            reason === "close-watcher"
          ) {
            return;
          }
        }
        onOpenChange?.(nextOpen, details);
      }}
      {...props}
    />
  )
}

function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>
) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function DialogPanel({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-panel"
      className={cn(
        "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl shadow-black/10 outline-none transition-all duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogClose({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  DialogClose,
}