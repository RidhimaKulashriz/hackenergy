declare module 'xss-clean' {
  import { RequestHandler } from 'express';
  
  interface XssCleanOptions {
    replace?: (s: string) => string;
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedStyles?: Record<string, Record<string, RegExp[]>>;
    allowedClasses?: Record<string, string[] | boolean>;
    allowedIframeHostnames?: string[];
    allowVulnerableTags?: boolean;
    stripIgnoreTag?: boolean;
    stripIgnoreTagBody?: boolean | string[];
    allowProtocolRelative?: boolean;
    parser?: {
      decodeEntities?: boolean;
      lowerCaseTags?: boolean;
      lowerCaseAttributeNames?: boolean;
      recognizeCDATA?: boolean;
      recognizeSelfClosing?: boolean;
    };
  }
  
  function xssClean(options?: XssCleanOptions): RequestHandler;
  
  export = xssClean;
}
