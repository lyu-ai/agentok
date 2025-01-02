import Navbar from '@/components/navbar/navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col h-screen w-screen'>
      <Navbar />
      <ScrollArea className='flex-1 overflow-y-auto'>
        {children}
      </ScrollArea>
    </div>
  );
};

export default Layout;