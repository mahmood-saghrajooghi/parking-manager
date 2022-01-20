import React, { useEffect } from "react";
import {} from "react-dom";
import VisuallyHidden from "@reach/visually-hidden";

const callAll =
  (...fns: any[]) =>
  (...args: any[]) =>
    fns.forEach((fn) => fn && fn(...args));

const callAllAsync =
  (...fns: any[]) =>
  async (...args: any[]) => {
    for (const fn of fns) {
      fn && (await fn(...args));
    }
  };

const ModalContext = React.createContext<any>([false, () => {}]);

function Modal(props: any) {
  const [isOpen, setIsOpen] = React.useState(false);
  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />;
}

function ModalDismissButton({ children: child }: any) {
  const [, setIsOpen] = React.useContext<any>(ModalContext);
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  });
}

function ModalDismissButtonAsync({ children: child }: any) {
  const [, setIsOpen] = React.useContext<any>(ModalContext);
  return React.cloneElement(child, {
    onClick: callAllAsync(child.props.onClick, () => setIsOpen(false)),
  });
}

function ModalOpenButton({ children: child }: any) {
  const [, setIsOpen] = React.useContext<any>(ModalContext);
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  });
}

function ModalContentsBase(props: any) {
  const [isOpen, setIsOpen] = React.useContext<any>(ModalContext);
  return (
    <div
      aria-hidden={isOpen ? "false" : "true"}
      className={`${
        isOpen ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 bottom-0 bg-gray-800/75 z-50 h-modal md:h-full md:inset-0`}
    >
      <div className="relative flex items-center justify-center px-4 w-full h-full">
        <div className="relative w-2/3 bg-white rounded-lg shadow border dark:border-gray-600 dark:bg-gray-800 text-white">
          {props.children}
        </div>
      </div>
    </div>
  );
}

function ModalContents({ title, children, onClose, ...props }: any) {
  return (
    <ModalContentsBase {...props}>
      <ModalDismissButton>
        <button onClick={onClose} className="p-3">
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>❌</span>
        </button>
      </ModalDismissButton>
      {children}
    </ModalContentsBase>
  );
}

export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContents,
  ModalDismissButtonAsync,
};
