/// <reference types="react-scripts" />

// This file is used to provide type definitions for JSX elements
// and other global types used in the application

// This helps TypeScript understand .module.css imports
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// This helps TypeScript understand image imports
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// JSX namespace is now handled by @types/react
// No need to redeclare it here
