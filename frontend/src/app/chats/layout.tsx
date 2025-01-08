import Navbar from '@/components/navbar/navbar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-screen h-screen bg-muted">
      <Navbar />
      <div className="h-[calc(100vh-var(--header-height))] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
