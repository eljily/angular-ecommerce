declare module 'bootoast' {
  interface BootoastOptions {
    message: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    timeout?: number;
    animationDuration?: number;
  }

  function toast(options: BootoastOptions): void;

  export = toast;
}