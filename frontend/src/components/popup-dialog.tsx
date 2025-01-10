import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

export const PopupDialog = ({
  className,
  classNameTitle,
  classNameBody,
  title,
  show,
  onClose,
  children,
}: any) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className={cn(className)}>
        <DialogHeader className={cn('flex justify-between', classNameTitle)}>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={cn(classNameBody)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
