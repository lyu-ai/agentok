"use client";

import { useTheme } from "next-themes";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ThemeButtonProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function ThemeButton({ icon, isActive, onClick }: ThemeButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        'p-1 rounded-full',
        isActive ? 'bg-primary text-primary-foreground hover:bg-primary/80' : 'hover:bg-muted/50'
      )}
    >
      {icon}
    </button>
  );
}

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex border rounded-full p-1 gap-2" role="group">
      <ThemeButton
        icon={<Icons.sun className="h-4 w-4" />}
        isActive={theme === 'light'}
        onClick={() => setTheme('light')}
      />
      <ThemeButton
        icon={<Icons.moon className="h-4 w-4" />}
        isActive={theme === 'dark'}
        onClick={() => setTheme('dark')}
      />
      <ThemeButton
        icon={<Icons.laptop className="h-4 w-4" />}
        isActive={theme === 'system'}
        onClick={() => setTheme('system')}
      />
    </div>
  );
}
