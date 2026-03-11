declare module 'react' {
  export function useState<T>(initialValue: T): [T, (value: T) => void];
  export type FC<P = any> = (props: P) => JSX.Element;
  export type ChangeEvent<T> = any;
  export type KeyboardEvent<T> = any;
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
