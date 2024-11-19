/**
 * We use Fibonacci number for Fibonacci encoding / decoding.
 *  Do not need to re-calculate them, so we store them as a constant array.
 *
 * Fibonacci encoding limited by the biggest number in this array
 */
export const FIBONACCI_NUMBERS = [
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711,
  28657, 46368, 75025,
];
export const FIBONACCI_NUMBER_OF_ELEMENTS = FIBONACCI_NUMBERS.length;
