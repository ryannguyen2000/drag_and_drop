import clsx from "clsx";
import {Component, createEffect, createSignal, JSX, onCleanup} from "solid-js";
import {render} from "solid-js/web";
import toast, {
  IconTheme,
  Renderable,
  Toast,
  Toaster,
  ToastPosition,
} from "react-hot-toast";
import {useEffect, useState} from "react";

export type HandleToastPromiseProps = {
  status: "success" | "error";
  message: string;
};
type PromiseToastProps = {
  handle: () => HandleToastPromiseProps;
  loadingClassname?: string;
  successClassname?: string;
  errorClassname?: string;
  loadingText?: string;
};

type ToastProps = {
  msg?: string;
  duration?: number;
  className?: string;
};

type ToastCustomProps = {
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

type ToastTimerProps = {
  containerClassName?: string | undefined;
  timerClassName?: string | undefined;
  unmountDelay?: number | undefined;
  duration?: number;
} & ToastProps;

export const ToastBlank = ({
  className,
  msg = "Blank",
  duration = 4000,
}: ToastProps) => {
  toast(msg, {
    duration: duration,
    className: className,
  });
};
export const ToastSuccess = ({
  className,
  msg = "Success",
  duration = 4000,
}: ToastProps) => {
  toast.success(msg, {
    duration: duration,
    className: className,
  });
};

export const ToastError = ({
  className,
  msg = "Error",
  duration = 4000,
}: ToastProps) => {
  toast.error(msg, {
    duration: duration,
    className: className,
  });
};

export const ToastLoading = ({
  className,
  msg = "Loading...",
  duration = 4000,
}: ToastProps) => {
  toast.loading(msg, {
    duration: duration,
    className: className,
  });
};
export const ToastDismiss = () => {
  toast.dismiss();
};
export const ToastCustom = ({
  is = "blank",
  className,
  msg = "This is a custom toast",
  duration = 4000,
  iconTheme,
  style,
  ariaProps,
  position,
  unmountDelay,
  id,
  icon,
}: ToastCustomProps) => {
  if (is === "blank") {
    toast(msg, {
      iconTheme: iconTheme,
      className: className,
      style: style,
      duration: duration,
      icon: icon,
      position: position,
      ariaProps: ariaProps,
      id: id,
    });
  }
  if (is === "error") {
    toast.error(msg, {
      iconTheme: iconTheme,
      className: className,
      style: style,
      duration: duration,
      icon: icon,
      position: position,
      ariaProps: ariaProps,
      id: id,
    });
  }
  if (is === "loading") {
    toast.loading(msg, {
      iconTheme: iconTheme,
      className: className,
      style: style,
      duration: duration,
      icon: icon,
      position: position,
      ariaProps: ariaProps,
      id: id,
    });
  }
  if (is === "success") {
    toast.success(msg, {
      iconTheme: iconTheme,
      className: className,
      style: style,
      duration: duration,
      icon: icon,
      position: position,
      ariaProps: ariaProps,
      id: id,
    });
  }
};
const ToastContent = ({
  className,
  containerClassName,
  timerClassName,
  msg,
  duration = 4000,
  t,
}: ToastTimerProps & {t: Toast}) => {
  const [life, setLife] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setLife((l) => {
        if (l <= 0) {
          clearInterval(interval);
          return 0;
        }
        return l - 100 / (duration / 10);
      });
    }, 10);

    // Cleanup interval when the component unmounts or the toast is dismissed
    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    if (life <= 0) {
      // Dismiss the toast once the timer runs out, outside of the rendering phase
      toast.dismiss(t.id);
    }
  }, [life, t.id]);

  return (
    <div className={clsx("relative", containerClassName)}>
      <div
        style={{width: `${life}%`, height: "100%"}}
        className={clsx("absolute", timerClassName)}
      ></div>
      <span className={clsx("relative", className)}>{msg}</span>
    </div>
  );
};

export const ToastTimer = ({
  className,
  containerClassName = "bg-pink-100 shadow-md px-4 py-3 rounded overflow-hidden text-pink-700",
  timerClassName = "bg-pink-200 h-full top-0 left-0",
  msg = "Timer In The Background",
  duration = 4000,
}: ToastTimerProps) => {
  toast.custom(
    (t) => (
      <ToastContent
        className={className}
        containerClassName={containerClassName}
        timerClassName={timerClassName}
        msg={msg}
        duration={duration}
        t={t}
      />
    ),
    {duration}
  );

  return null; // The component itself does not render anything directly
};

export const ToastPromise = ({
  handle,
  errorClassname,
  loadingClassname,
  successClassname,
  loadingText = "Loading...",
}: PromiseToastProps) => {
  toast.promise(
    new Promise((resolve, rejects) => {
      if (handle().status === "success") {
        resolve(handle().message);
      }
      if (handle().status === "error") {
        rejects(handle().message);
      }
    }),
    {
      loading: (
        <div
          className={clsx(
            "text-yellow-600 text-center min-w-44",
            loadingClassname
          )}
        >
          {loadingText}
        </div>
      ) as unknown as string,
      success: (msg: any) =>
        (
          <div
            className={clsx(
              "text-green-600 text-center min-w-44",
              successClassname
            )}
          >
            {msg}
          </div>
        ) as unknown as string,
      error: (err: any) =>
        (
          <div
            className={clsx(
              "text-green-600 text-center min-w-44",
              errorClassname
            )}
          >
            {err}
          </div>
        ) as unknown as string,
    }
  );
};

export default Toaster;
