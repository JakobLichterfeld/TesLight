export const decode = (base64: string): Uint8Array =>
  Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

export const encode = (binary: Uint8Array): string =>
  btoa(String.fromCharCode.apply(null, Array.from<number>(binary)));
