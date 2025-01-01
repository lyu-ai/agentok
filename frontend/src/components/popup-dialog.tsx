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
      <DialogContent
        className={cn(
          'bg-base-100 text-base-content dark:bg-gray-800/80 border-base-content/10',
          className
        )}
      >
        <DialogHeader className={cn('flex justify-between', classNameTitle)}>
          <DialogTitle>{title}</DialogTitle>
          <Icons.close
            className="h-5 w-5 hover:text-red-500 cursor-pointer"
            onClick={() => onClose()}
          />
        </DialogHeader>
        <div className={cn(classNameBody)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
