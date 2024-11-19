import { FIBONACCI_NUMBER_OF_ELEMENTS, FIBONACCI_NUMBERS } from './fibonacci';

describe('Fibonacci numbers constant array', () => {
  it('should be generated correctly', () => {
    const fib = [1, 2];
    for (let i = 2; i < FIBONACCI_NUMBER_OF_ELEMENTS; i++) {
      fib.push(fib[i - 2] + fib[i - 1]);
      expect(fib[i]).toEqual(FIBONACCI_NUMBERS[i]);
    }
  });
});
