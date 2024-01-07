declare namespace JSX {
  interface IntrinsicElements {
    redoc: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      theme?: string;
    };
  }
}
