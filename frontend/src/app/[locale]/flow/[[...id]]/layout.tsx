import { PropsWithChildren } from 'react';

export default async function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="flex-1 w-full overflow-y-auto">
      <title>Flow | FlowGen</title>
      {children}
    </div>
  );
}
