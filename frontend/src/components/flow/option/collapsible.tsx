import { cn } from '@/lib/utils';

export const Collapsible = ({ children, collapsed }: any) => {
  return (
    <div
      className={cn(
        'text-sm text-primary/60 transition-all',
        collapsed ? 'expanding-height' : 'collapsing-height'
      )}
    >
      {children}
    </div>
  );
};
