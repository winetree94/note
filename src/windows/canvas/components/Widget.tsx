import React, { createContext, forwardRef, useEffect, useState } from 'react';

interface WidgetContainerContextValue {
  focused: string | null;
}

const WidgetContainerContext = createContext<WidgetContainerContextValue>({
  focused: null,
});

export function WidgetContainerProvider(props: { children: React.ReactNode }) {
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const widget = element?.closest('.widget');
      if (widget) {
        window.electron?.setIgnoreMouseEvents?.(false);
      } else {
        window.electron?.setIgnoreMouseEvents?.(true, { forward: true });
      }
    };

    const onFocusIn = () => {
      const element = document.activeElement;
      const widget = element?.closest('.widget') as HTMLDivElement | null;
      if (!widget) {
        setFocused(null);
        return;
      }
      setFocused(widget.dataset.widgetId!);
    };

    const onWindowFocus = (e: any, hasFocus: boolean) => {
      if (!hasFocus) {
        setFocused(null);
      }
    };

    // input, textarea 외에는 드래그를 허용하지 않음
    const onSelectionStart = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) {
        return;
      }
      if (
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        !target.isContentEditable
      ) {
        event.preventDefault();
      }
    };

    const onBlur = () => {
      setFocused(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.electron?.on?.('window-focus', onWindowFocus);
    document.addEventListener('selectionstart', onSelectionStart);
    document.addEventListener('blur', onBlur);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.electron?.removeEventListener?.('window-focus', onWindowFocus);
      document.removeEventListener('selectionstart', onSelectionStart);
      document.removeEventListener('blur', onBlur);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, []);

  return (
    <WidgetContainerContext.Provider
      value={{
        focused,
      }}
    >
      {props.children}
    </WidgetContainerContext.Provider>
  );
}

export function useWidgetContainerContext() {
  return React.useContext(WidgetContainerContext);
}

interface WidgetContextValue {
  focused: boolean;
}

const WidgetContext = createContext<WidgetContextValue>({
  focused: false,
});

export function useWidgetContext() {
  return React.useContext(WidgetContext);
}

export interface WidgetProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
}

export const Widget = forwardRef<HTMLDivElement, WidgetProps>(
  function Widget(props, ref) {
    const containerContext = useWidgetContainerContext();
    console.log(
      containerContext.focused,
      props.id,
      containerContext.focused === props.id
    );
    return (
      <WidgetContext.Provider
        value={{
          focused: containerContext.focused === props.id,
        }}
      >
        <div
          data-widget-id={props.id}
          tabIndex={0}
          ref={ref}
          className='tw-shadow-md tw-flex tw-flex-col tw-bg-white tw-pointer-events-auto tw-absolute widget'
          style={{
            left: props.x,
            top: props.y,
            width: props.width,
            height: props.height,
          }}
        >
          {props.children}
        </div>
      </WidgetContext.Provider>
    );
  }
);
