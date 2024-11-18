import {JSX} from "solid-js";
import {IconTheme, Renderable, ToastPosition} from "solid-toast";

export type HandleToastPromiseProps = {
  status: "success" | "error";
  message: string;
};
export type PromiseToastProps = {
  handle: () => HandleToastPromiseProps;
  loadingClassname?: string;
  successClassname?: string;
  errorClassname?: string;
  loadingText?: string;
};

export type ToastProps = {
  msg?: string;
  duration?: number;
  className?: string;
};

export type ToastCustomProps = {
  is?: "success" | "error" | "loading" | "blank";
  style?: JSX.CSSProperties;
  iconTheme?: IconTheme;
  icon?: Renderable;
  position?: ToastPosition;
  ariaProps?:
    | {
        role: "status" | "alert";
        "aria-live": "assertive" | "off" | "polite";
      }
    | undefined;
  unmountDelay?: number | undefined;
  id?: string | undefined;
} & ToastProps;

export type ToastTimerProps = {
  containerClassName?: string | undefined;
  timerClassName?: string | undefined;
  unmountDelay?: number | undefined;
} & ToastProps;
