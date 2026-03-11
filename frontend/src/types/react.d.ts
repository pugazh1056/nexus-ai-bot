declare module 'react' {
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export type FC<P = any> = (props: P) => JSX.Element;
  export type ChangeEvent<T> = any;
  export type KeyboardEvent<T> = any;
  export const StrictMode: any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

