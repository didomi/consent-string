import { MAX_ID } from '@/constants/constants';
import { BitSet } from './bit-set';
import { FibonacciNumber } from './fibonacci-number';

describe('FibonacciNumber', () => {
  describe('largestFibonacciIndexLessOrEqual', () => {
    it('returns right values', () => {
      const fibonacci = new FibonacciNumber(1);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(1)).toEqual(0);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(2)).toEqual(1);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(3)).toEqual(2);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(4)).toEqual(2);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(5)).toEqual(3);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(6)).toEqual(3);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(7)).toEqual(3);
      expect(fibonacci.largestFibonacciIndexLessOrEqual(8)).toEqual(4);
    });
  });
  describe('constructor', () => {
    it('construct an object for id 0', () => {
      const fibonacci = new FibonacciNumber(0);
      expect(fibonacci.number).toEqual(0);
      expect(fibonacci.codeword.toString()).toEqual('');
      expect(fibonacci.size).toEqual(0);
      expect(fibonacci.toString()).toEqual('');
      expect(fibonacci.toNumber()).toEqual(0);
    });
    it('construct an object for id 1', () => {
      const fibonacci = new FibonacciNumber(1);
      expect(fibonacci.number).toEqual(1);
      expect(fibonacci.codeword.toString()).toEqual('11');
      expect(fibonacci.size).toEqual(2);
      expect(fibonacci.toString()).toEqual('11');
      expect(fibonacci.toNumber()).toEqual(1);
    });
    it('construct an object for id 2', () => {
      const fibonacci = new FibonacciNumber(2);
      expect(fibonacci.number).toEqual(2);
      expect(fibonacci.codeword.toString()).toEqual('011');
      expect(fibonacci.size).toEqual(3);
      expect(fibonacci.toString()).toEqual('011');
      expect(fibonacci.toNumber()).toEqual(2);
    });
    it('construct an object for id 3', () => {
      const fibonacci = new FibonacciNumber(3);
      expect(fibonacci.number).toEqual(3);
      expect(fibonacci.codeword.toString()).toEqual('0011');
      expect(fibonacci.size).toEqual(4);
      expect(fibonacci.toString()).toEqual('0011');
      expect(fibonacci.toNumber()).toEqual(3);
    });
    it('construct an object for id 4', () => {
      const fibonacci = new FibonacciNumber(4);
      expect(fibonacci.number).toEqual(4);
      expect(fibonacci.codeword.toString()).toEqual('1011');
      expect(fibonacci.size).toEqual(4);
      expect(fibonacci.toString()).toEqual('1011');
      expect(fibonacci.toNumber()).toEqual(4);
    });
    it('construct an object for id 5', () => {
      const fibonacci = new FibonacciNumber(5);
      expect(fibonacci.number).toEqual(5);
      expect(fibonacci.codeword.toString()).toEqual('00011');
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.toString()).toEqual('00011');
      expect(fibonacci.toNumber()).toEqual(5);
    });
    it('construct an object for id 6', () => {
      const fibonacci = new FibonacciNumber(6);
      expect(fibonacci.number).toEqual(6);
      expect(fibonacci.codeword.toString()).toEqual('10011');
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.toString()).toEqual('10011');
      expect(fibonacci.toNumber()).toEqual(6);
    });
    it('construct an object for id 7', () => {
      const fibonacci = new FibonacciNumber(7);
      expect(fibonacci.number).toEqual(7);
      expect(fibonacci.codeword.toString()).toEqual('01011');
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.toString()).toEqual('01011');
      expect(fibonacci.toNumber()).toEqual(7);
    });
    it('construct an object for id 8', () => {
      const fibonacci = new FibonacciNumber(8);
      expect(fibonacci.number).toEqual(8);
      expect(fibonacci.codeword.toString()).toEqual('000011');
      expect(fibonacci.size).toEqual(6);
      expect(fibonacci.toString()).toEqual('000011');
      expect(fibonacci.toNumber()).toEqual(8);
    });
    it('construct an object for maximum id', () => {
      const fibonacci = new FibonacciNumber(MAX_ID);
      expect(fibonacci.number).toEqual(0);
      expect(fibonacci.codeword.toString()).toEqual('');
      expect(fibonacci.size).toEqual(0);
      expect(fibonacci.toString()).toEqual('');
      expect(fibonacci.toNumber()).toEqual(0);
    });
  });
  describe('fromBitSet', () => {
    it('creates fibonacci from empty codeword', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet());

      expect(fibonacci.number).toEqual(0);
      expect(fibonacci.size).toEqual(0);
      expect(fibonacci.codeword.toString()).toEqual('');
    });
    it('creates fibonacci from valid codeword for id 1', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('11'));

      expect(fibonacci.number).toEqual(1);
      expect(fibonacci.size).toEqual(2);
      expect(fibonacci.codeword.toString()).toEqual('11');
    });
    it('creates fibonacci from codeword for id 1 when codeword is longer then 2 bits', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('1100011'));

      expect(fibonacci.number).toEqual(1);
      expect(fibonacci.size).toEqual(2);
      expect(fibonacci.codeword.toString()).toEqual('11');
    });
    it('creates fibonacci from codeword for id 1 when bitSet is longer then 2 bits with offset', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('1100011'), 5);

      expect(fibonacci.number).toEqual(1);
      expect(fibonacci.size).toEqual(2);
      expect(fibonacci.codeword.toString()).toEqual('11');
    });
    it('creates fibonacci from invalid codeword for id 1', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('1'));

      expect(fibonacci.number).toEqual(1);
      expect(fibonacci.size).toEqual(1);
      expect(fibonacci.codeword.toString()).toEqual('1');
    });
    it('creates fibonacci from valid codeword for id 2', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('011'));

      expect(fibonacci.number).toEqual(2);
      expect(fibonacci.size).toEqual(3);
      expect(fibonacci.codeword.toString()).toEqual('011');
    });
    it('creates fibonacci from very long codeword', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(
        new BitSet().fromBinaryString(
          '01000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        ),
      );

      expect(fibonacci.number).toEqual(2);
      expect(fibonacci.size).toEqual(25);
      expect(fibonacci.codeword.toString()).toEqual('0100000000000000000000000');
    });
    it('creates fibonacci from valid codeword for id 3', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('0011'));

      expect(fibonacci.number).toEqual(3);
      expect(fibonacci.size).toEqual(4);
      expect(fibonacci.codeword.toString()).toEqual('0011');
    });
    it('creates fibonacci from valid codeword for id 4', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('1011'));

      expect(fibonacci.number).toEqual(4);
      expect(fibonacci.size).toEqual(4);
      expect(fibonacci.codeword.toString()).toEqual('1011');
    });
    it('creates fibonacci from valid codeword for id 4 with offset', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('111011'), 2);

      expect(fibonacci.number).toEqual(4);
      expect(fibonacci.size).toEqual(4);
      expect(fibonacci.codeword.toString()).toEqual('1011');
    });
    it('creates fibonacci from valid codeword for id 4 with offset with long bitSet', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('11101100000'), 2);

      expect(fibonacci.number).toEqual(4);
      //expect(fibonacci.size).toEqual(4);
      expect(fibonacci.codeword.toString()).toEqual('1011');
    });
    it('creates fibonacci from valid codeword for id 5', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('00011'));

      expect(fibonacci.number).toEqual(5);
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.codeword.toString()).toEqual('00011');
    });
    it('creates fibonacci from valid codeword for id 5 with offset', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('011000110000011'), 3);

      expect(fibonacci.number).toEqual(5);
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.codeword.toString()).toEqual('00011');
    });
    it('creates fibonacci from valid codeword for id 6', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('10011'));

      expect(fibonacci.number).toEqual(6);
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.codeword.toString()).toEqual('10011');
    });
    it('creates fibonacci from valid codeword for id 6 with offset', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('1001110011'), 5);

      expect(fibonacci.number).toEqual(6);
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.codeword.toString()).toEqual('10011');
    });
    it('creates fibonacci from valid codeword for id 7', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('01011'));

      expect(fibonacci.number).toEqual(7);
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.codeword.toString()).toEqual('01011');
    });
    it('creates fibonacci from valid codeword for id 7 with offset', () => {
      const fibonacci = new FibonacciNumber();
      fibonacci.fromBitSet(new BitSet().fromBinaryString('1101011'), 2);

      expect(fibonacci.number).toEqual(7);
      expect(fibonacci.size).toEqual(5);
      expect(fibonacci.codeword.toString()).toEqual('01011');
    });
  });
});
