declare global {
  interface Window {
    electron: {
      setIgnoreMouseEvents: (
        ignore: boolean,
        options?: { forward: boolean }
      ) => void;
      on: (channel: string, listener: (...args: any[]) => void) => void;
      removeEventListener: (
        channel: string,
        listener: (...args: any[]) => void
      ) => void;
    };
  }
}

export {};
