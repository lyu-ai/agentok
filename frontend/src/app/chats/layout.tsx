'use client';

import Navbar from '@/components/navbar/navbar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ChatList } from '@/components/chat/chat-list';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-screen h-screen bg-muted">
      <Navbar />
      <div className="h-[calc(100vh-var(--header-height))] overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="h-full"
          >
            <ScrollArea className="h-full">
              <ChatList />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <ScrollArea className="h-full">{children}</ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
