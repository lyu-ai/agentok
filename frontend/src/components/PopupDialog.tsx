import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { RiCloseLine } from "react-icons/ri";

const PopupDialog = ({
  className,
  classNameTitle,
  classNameBody,
  title,
  show,
  onClose,
  children,
}: any) => {
  return (
    <Dialog
      open={show}
      onClose={() => onClose()}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-md transition duration-300 ease-in-out data-[closed]:opacity-0"
    >
      <div className="flex items-center justify-center min-h-screen ">
        <DialogPanel
          className={clsx(
            "relative z-10 bg-base-100 text-base-content dark:bg-gray-800/80 rounded-md border border-base-content/10 transition duration-300 ease-in-out data-[closed]:scale-0",
            className
          )}
          transition
        >
          <DialogTitle
            className={clsx(
              "font-bold p-2 flex items-center justify-between",
              classNameTitle
            )}
          >
            {title}
            <RiCloseLine
              className="h-5 w-5 hover:text-red-500 cursor-pointer"
              onClick={() => onClose()}
            />
          </DialogTitle>
          <div className={clsx(classNameBody)}>{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PopupDialog;
