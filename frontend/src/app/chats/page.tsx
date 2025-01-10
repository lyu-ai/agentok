import { Icons } from '@/components/icons';

export default function ChatsPage() {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-var(--header-height))]">
      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/50">
        <Icons.agent className="w-8 h-8" />
        <p>Let&apos;s start chatting!</p>
      </div>
    </div>
  );
}
