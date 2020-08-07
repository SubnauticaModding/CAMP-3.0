export { }; // Export nothing to mark this file as a module

declare global {
  interface String {
    matchAll(regexp: RegExp): IterableIterator<string>;
  }
}