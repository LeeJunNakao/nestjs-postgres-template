export default class DefaultException extends Error {
  constructor(
    public name: string,
    public description: string,
    public module: string,
  ) {
    super();
  }
}
