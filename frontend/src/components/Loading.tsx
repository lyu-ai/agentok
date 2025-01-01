import { Icons } from "./icons";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Icons.spinner className="animate-spin" />
    </div>
  );
};
