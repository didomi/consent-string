import { BitSet } from '@/common/bit-set';
import { FIBONACCI_NUMBERS, FIBONACCI_NUMBER_OF_ELEMENTS } from '@/constants/fibonacci';
import { MAX_ID, MIN_ID } from '@/constants/constants';

/**
 * Fibonacci Number Class
 */
export class FibonacciNumber {
  private bitSet = new BitSet();
  private value = 0;

  /**
   * Returns index for largest Fibonacci number less or equal to ID
   * @param id
   * @returns index in `FIBONACCI_NUMBERS` array
   */
  public largestFibonacciIndexLessOrEqual(id: number): number {
    let i = 2;

    while (FIBONACCI_NUMBERS[i - 1] <= id) {
      i++;
    }

    return i - 2;
  }

  /**
   * Create Fibonacci number object from ID
   * @param id number between `MIN_ID` and `MAX_ID`
   * @returns Fibonacci number object
   */
  constructor(id = 0) {
    if (id <= MIN_ID || id >= MAX_ID) {
      return;
    }

    let n = id;
    const index = this.largestFibonacciIndexLessOrEqual(n);
    let i = index;

    while (n > 0) {
      this.bitSet.set(i);
      n -= FIBONACCI_NUMBERS[i];
      i -= 1;

      while (i >= 0 && FIBONACCI_NUMBERS[i] > n) {
        i -= 1;
      }
    }

    this.bitSet.set(index + 1);
    this.value = id;
  }

  /**
   * Set value for Fibonacci number object form BitSet codeword
   * @param bitSet `bitset` with fibonacci number codeword
   * @param offset index in `bitSet` for codeword start
   * @returns this
   */
  public fromBitSet(bitSet: BitSet, offset = 0): FibonacciNumber {
    this.value = 0;

    let index = 0;
    let position = offset;

    while (position < bitSet.size) {
      if (index >= FIBONACCI_NUMBER_OF_ELEMENTS) {
        break;
      }

      const current = bitSet.get(position);
      const next =
        position + 1 === bitSet.size || index + 1 === FIBONACCI_NUMBER_OF_ELEMENTS
          ? current
          : bitSet.get(position + 1);

      if (current) {
        this.value += FIBONACCI_NUMBERS[index];

        if (next) {
          position++;
          break;
        }
      }

      index++;
      position++;
    }

    this.bitSet = bitSet.subSet(offset, position - offset + 1);

    return this;
  }

  /**
   * Returns Fibonacci number codeword size
   */
  public get size(): number {
    return this.bitSet.size;
  }

  /**
   * Returns Fibonacci number numeric value
   */
  public get number(): number {
    return this.value;
  }

  /**
   * Returns Fibonacci number `bitSet` with codeword
   */
  public get codeword(): BitSet {
    return this.bitSet;
  }

  /**
   * Returns Fibonacci number codeword
   * @returns Fibonacci number codeword
   */
  public toString(): string {
    return this.bitSet.toString();
  }

  /**
   * Returns Fibonacci number value
   * @returns Fibonacci number value
   */
  public toNumber(): number {
    return this.value;
  }
}
