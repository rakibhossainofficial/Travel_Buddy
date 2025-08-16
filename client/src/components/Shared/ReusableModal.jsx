// components/ui/ReusableModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ReusableModal({
  isOpen,
  onClose,
  title = "Modal Title",
  description,
  children,
  size = "sm", // accepts sm | md | lg
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-${size}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="mt-4 space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
