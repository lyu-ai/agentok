import { Icons } from './icons';

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Icons.logoSimple className="h-10 w-10 animate-pulse text-muted-foreground/20" />
    </div>
  );
};
