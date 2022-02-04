export const pipe =
  <T>(...fns: ((mpf: T) => T)[]) =>
  (input: T) =>
    fns.reduce((output, f) => f(output), input);
