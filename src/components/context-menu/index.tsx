import React, {useState, useRef, ReactNode} from "react";

type ContextMenuProps = {
  options?: {
    label: string;
    icon?: ReactNode;
    className?: string;
    handle: () => void;
  }[];
  triggerElement: ReactNode;
  children?: ReactNode;
  id: any;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  children,
  triggerElement,
  id,
}) => {
  const [position, setPosition] = useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });
  const [show, setShow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({x: event.clientX, y: event.clientY});
    setShow(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div onContextMenu={handleContextMenu}>{triggerElement}</div>

      {show && (
        <div
          ref={menuRef}
          style={{
            top: position.y,
            left: position.x,
          }}
          className="border z-50 border-gray-200 max-w-64 w-full p-4 shadow-lg rounded-2xl flex flex-col gap-1.5 absolute bg-white"
        >
          {children}
          {options &&
            options?.map((option, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  option.handle();
                  setShow(false);
                }}
                className={`h-10 w-full select-none bg-white ${option.className} rounded-xl flex items-center justify-start text-white font-medium tracking-tight hover:saturate-150 cursor-pointer transition-all duration-500 px-4 gap-4`}
              >
                {option.icon}
                <p>{option.label}</p>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
