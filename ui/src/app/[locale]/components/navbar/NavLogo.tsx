'use client';

const Logo = () => {
  return (
    <a href="/" className="flex shrink-0 gap-2 items-end">
      <img width={32} height={32} alt="logo" src={'/logo.svg'} />
      <div className="hidden md:block text-lg font-medium h-7 w-auto text-primary">
        Agentok Studio
      </div>
    </a>
  );
};

export default Logo;
