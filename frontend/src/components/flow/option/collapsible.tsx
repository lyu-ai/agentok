import clsx from 'clsx';

export const Collapsible = ({ children, collapsed }: any) => {
  return (
    <div
      className={clsx(
        'text-sm text-base-content/60 transition-all',
        collapsed ? 'expanding-height' : 'collapsing-height'
      )}
    >
      {children}
    </div>
  );
};
