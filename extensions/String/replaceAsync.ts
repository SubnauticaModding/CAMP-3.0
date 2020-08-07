export { }; // Export nothing to mark this file as a module

declare global {
  interface String {
    replaceAsync(regexp: RegExp, func: (substring: string, ...args: any[]) => Promise<string>): Promise<string>;
  }
}

String.prototype.replaceAsync = async function (regex: RegExp, func: (substring: string, ...args: any[]) => Promise<string>): Promise<string> {
  const promises: Promise<string>[] = [];
  this.replace(regex, (substring, ...args) => {
    const promise = func(substring, ...args);
    promises.push(promise);
    return substring;
  });
  const data = await Promise.all(promises);
  return this.replace(regex, (substring) => data.shift() ?? substring);
}
