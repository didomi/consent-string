import { BitSet } from './bit-set';
import { BASE64_LCM } from '@/constants/base64';

describe('BitSet', () => {
  describe('constructor', () => {
    it('creates empty BitSet', () => {
      const bitSet = new BitSet();
      expect(bitSet.size).toEqual(0);
      expect(bitSet.isEmpty).toBeTruthy();
    });
    it('creates BitSet for given size', () => {
      const bitSet = new BitSet(1024);
      expect(bitSet.size).toEqual(1024);
      expect(bitSet.isEmpty).toBeFalsy();
    });
  });

  describe('clone', () => {
    it('update correctly empty BitSet', () => {
      const bitSetOne = new BitSet();
      const bitSetTwo = new BitSet(10);

      expect(bitSetOne.isEmpty).toBeTruthy();
      bitSetOne.clone(bitSetTwo);
      expect(bitSetOne.isEmpty).toBeFalsy();

      expect(bitSetOne.toString()).toEqual('0000000000');
    });
    it('update correctly not empty BitSet', () => {
      const bitSetOne = new BitSet(5);
      const bitSetTwo = new BitSet(10);

      expect(bitSetOne.isEmpty).toBeFalsy();
      expect(bitSetOne.size).toEqual(5);

      bitSetOne.clone(bitSetTwo);
      expect(bitSetOne.isEmpty).toBeFalsy();

      expect(bitSetOne.toString()).toEqual('0000000000');
    });
  });

  describe('set', () => {
    it('set bit for empty BitSet updating size', () => {
      const bitSet = new BitSet();
      bitSet.set(10);
      expect(bitSet.size).toEqual(11);
      expect(bitSet.toString()).toEqual('00000000001');
    });
    it('unset bit for empty BitSet updating size', () => {
      const bitSet = new BitSet();
      bitSet.set(10, false);
      expect(bitSet.size).toEqual(11);
      expect(bitSet.toString()).toEqual('00000000000');
    });
    it('set bit for not empty BitSet', () => {
      const bitSet = new BitSet(12);
      bitSet.set(10);
      expect(bitSet.size).toEqual(12);
      expect(bitSet.toString()).toEqual('000000000010');
    });
    it('unset bit for not empty BitSet', () => {
      const bitSet = new BitSet(12);
      bitSet.set(10);
      expect(bitSet.size).toEqual(12);
      expect(bitSet.toString()).toEqual('000000000010');
      bitSet.set(10, false);
      expect(bitSet.toString()).toEqual('000000000000');
    });
    it('set the first bit for empty BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(0);
      expect(bitSet.size).toEqual(1);
      expect(bitSet.toString()).toEqual('1');
    });
    it('unset the first bit for empty BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(0, false);
      expect(bitSet.size).toEqual(1);
      expect(bitSet.toString()).toEqual('0');
    });
    it('set last first bit for not empty BitSet', () => {
      const bitSet = new BitSet(7);
      bitSet.set(6);
      expect(bitSet.size).toEqual(7);
      expect(bitSet.toString()).toEqual('0000001');
    });
    it('unset last first bit for not empty BitSet', () => {
      const bitSet = new BitSet(7);
      bitSet.set(6);
      expect(bitSet.size).toEqual(7);
      expect(bitSet.toString()).toEqual('0000001');
      bitSet.set(6, false);
      expect(bitSet.size).toEqual(7);
      expect(bitSet.toString()).toEqual('0000000');
    });
  });

  describe('get', () => {
    it('returns false for bit that not set', () => {
      const bitSet = new BitSet(7);
      expect(bitSet.get(10)).toBeFalsy();
    });
    it('returns false for bit that was set to false when BitSet was created', () => {
      const bitSet = new BitSet(7);
      expect(bitSet.get(0)).toBeFalsy();
      expect(bitSet.get(9)).toBeFalsy();
    });
    it('returns false for bit that was unset', () => {
      const bitSet = new BitSet();
      bitSet.set(100, false);
      expect(bitSet.get(100)).toBeFalsy();
    });
    it('returns true for bit that was set', () => {
      const bitSet = new BitSet();
      bitSet.set(40000);
      expect(bitSet.get(40000)).toBeTruthy();
    });
  });

  describe('add', () => {
    it('updates correctly empty bitSet', () => {
      const bitSetOne = new BitSet();
      bitSetOne.set(9);
      bitSetOne.set(0);
      const bitSetTwo = new BitSet().add(bitSetOne);
      expect(bitSetTwo.toString()).toEqual('1000000001');
    });
    it('updates correctly not empty bitSet', () => {
      const bitSetOne = new BitSet();
      bitSetOne.set(9);
      bitSetOne.set(0);
      const bitSetTwo = new BitSet();
      bitSetTwo.set(5);
      expect(bitSetTwo.add(bitSetOne).toString()).toEqual('0000011000000001');
    });
  });

  describe('insert', () => {
    it('updates correctly empty bitSet', () => {
      const bitSetOne = new BitSet();
      bitSetOne.set(9);
      bitSetOne.set(0);
      const bitSetTwo = new BitSet().insert(bitSetOne);
      expect(bitSetTwo.toString()).toEqual('1000000001');
    });
    it('updates correctly not empty bitSet', () => {
      const bitSetOne = new BitSet();
      bitSetOne.set(9);
      bitSetOne.set(0);
      const bitSetTwo = new BitSet();
      bitSetTwo.set(5);
      expect(bitSetTwo.insert(bitSetOne).toString()).toEqual('1000000001000001');
    });
  });

  describe('shiftLeft', () => {
    it('updates correctly empty bitSet', () => {
      const bitSet = new BitSet();
      expect(bitSet.shiftLeft(10).toString()).toEqual('');
    });
    it('updates correctly not empty bitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.shiftLeft(5).toString()).toEqual('00001');
    });
    it('0 shift does not change BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.shiftLeft(0).toString()).toEqual('1000000001');
    });
  });

  describe('shiftRight', () => {
    it('updates correctly empty bitSet', () => {
      const bitSet = new BitSet();
      expect(bitSet.shiftRight(10).toString()).toEqual('0000000000');
    });
    it('updates correctly not empty bitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.shiftRight(5).toString()).toEqual('000001000000001');
    });
    it('0 shift does not change BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.shiftRight(0).toString()).toEqual('1000000001');
    });
  });

  describe('trim', () => {
    it('updates correctly empty bitSet', () => {
      const bitSet = new BitSet();
      expect(bitSet.trim(5).size).toEqual(0);
    });
    it('does nothing if numberOfBits is set to 0', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.trim(0).size).toEqual(10);
    });
    it('makes BitSet empty if numberOfBits is set to BitSet size', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.trim(bitSet.size).size).toEqual(0);
    });
    it('makes BitSet empty if numberOfBits is set above the to BitSet size', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.trim(20).size).toEqual(0);
    });
    it('updates correctly BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.trim(5).size).toEqual(5);
      expect(bitSet.toString()).toEqual('10000');
    });
  });

  describe('subSet', () => {
    it('works correctly with empty BitSet', () => {
      const bitSet = new BitSet();
      expect(bitSet.subSet(0, 10).size).toEqual(0);
    });
    it('returns empty BitSet if numberOfBits is 0', () => {
      const bitSet = new BitSet().fromBinaryString('1010101010');
      expect(bitSet.subSet(0, 0).isEmpty).toBeTruthy();
    });
    it('returns the copy of BitSet if numberOfBits is equal to size and startIndex is 0', () => {
      const binaryString = '1010101010';
      const bitSet = new BitSet().fromBinaryString(binaryString);
      expect(bitSet.subSet(0, bitSet.size).toString()).toEqual(binaryString);
    });
    it('returns empty BitSet if startIndex is equal to size', () => {
      const binaryString = '1010101010';
      const bitSet = new BitSet().fromBinaryString(binaryString);
      expect(bitSet.subSet(bitSet.size, bitSet.size).toString()).toEqual('');
    });
    it('return correct sub set for startIndex is 0', () => {
      const binaryString = '1110101110';
      const bitSet = new BitSet().fromBinaryString(binaryString);
      expect(bitSet.subSet(0, 4).toString()).toEqual('1110');
    });
    it('return correct sub set', () => {
      const binaryString = '1110101110';
      const bitSet = new BitSet().fromBinaryString(binaryString);
      expect(bitSet.subSet(3, 4).toString()).toEqual('0101');
    });
  });

  describe('toBase64', () => {
    it('return correct string for empty BitSet', () => {
      const bitSet = new BitSet();
      expect(bitSet.toBase64()).toEqual('');
    });
    it('return correct string for short BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(9);
      bitSet.set(0);
      expect(bitSet.toBase64()).toEqual('gEAA');
      // 1000000001 -> g:100000, E:000100, A:000000, A:000000
    });
    it('return correct string', () => {
      const bitSet = new BitSet();
      bitSet.set(30);
      bitSet.set(0);
      expect(bitSet.toBase64()).toEqual('gAAAAgAA');
      // 1000000000000000000000000000001 ->  g:100000, A:000000, A:000000, A:000000, A:000000, g:1000000, A:000000, A:000000
    });
  });

  describe('fromBase64', () => {
    const createRandomBitSet = (size: number, numberOfBitsSet: number): BitSet => {
      const bitSet = new BitSet(size);
      for (let i = 0; i < numberOfBitsSet; i++) {
        const index = Math.floor(Math.random() * size);
        bitSet.set(index);
      }
      return bitSet;
    };

    const shouldBeGood = (bitSet: BitSet): void => {
      it(`should encode and decode BitSet ${bitSet.size} bit long`, (): void => {
        const encoded = bitSet.toBase64();
        const decoded = new BitSet().fromBase64(encoded);

        let expected = bitSet.toString();
        const padding = expected.length % BASE64_LCM;
        /* istanbul ignore next */
        expected += padding ? '0'.repeat(BASE64_LCM - padding) : '';
        /* istanbul ignore next */
        expect(decoded?.toString()).toEqual(expected);
      });
    };

    it('returns null if string is not base64 encoded', () => {
      const decoded = new BitSet().fromBase64('€%%/|ASDF');
      expect(decoded).toBeNull;
    });

    shouldBeGood(createRandomBitSet(10, 2));
    shouldBeGood(createRandomBitSet(100, 20));
    shouldBeGood(createRandomBitSet(1000, 200));
    shouldBeGood(createRandomBitSet(10240, 5120));
    shouldBeGood(createRandomBitSet(102400, 51200));
  });

  describe('fromBinaryString', () => {
    it('create BitSet with right values', () => {
      expect(new BitSet().fromBinaryString('1010101111000101').toString()).toEqual(
        '1010101111000101',
      );
    });
  });

  describe('fromUUID / toUUID', () => {
    it('works correctly', () => {
      const uuid = '1875afe1-461b-6b9f-9d66-700174abbffc';
      const bitSet = new BitSet().fromUUID(uuid);
      expect(bitSet.size).toEqual(128);
      expect(bitSet.toUUID()).toEqual(uuid);
    });
  });

  describe('addBoolean', () => {
    it('appends true value correctly to empty BitSet', () => {
      const bitSet = new BitSet();
      bitSet.addBoolean(true);
      expect(bitSet.toString()).toEqual('1');
      expect(bitSet.size).toEqual(1);
    });

    it('appends false value correctly to empty BitSet', () => {
      const bitSet = new BitSet();
      bitSet.addBoolean(false);
      expect(bitSet.toString()).toEqual('0');
      expect(bitSet.size).toEqual(1);
    });

    it('appends values correctly to non-empty BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(2);
      bitSet.addBoolean(true);
      bitSet.addBoolean(false);
      expect(bitSet.toString()).toEqual('00110');
      expect(bitSet.size).toEqual(5);
    });
  });

  describe('addBinaryString', () => {
    it('appends binary string correctly to empty BitSet', () => {
      const bitSet = new BitSet();
      bitSet.addBinaryString('1010');
      expect(bitSet.toString()).toEqual('1010');
      expect(bitSet.size).toEqual(4);
    });

    it('appends binary string correctly to non-empty BitSet', () => {
      const bitSet = new BitSet();
      bitSet.set(2);
      bitSet.addBinaryString('1010');
      expect(bitSet.toString()).toEqual('0011010');
      expect(bitSet.size).toEqual(7);
    });

    it('can append multiple binary strings', () => {
      const bitSet = new BitSet();
      bitSet.addBinaryString('101');
      bitSet.addBinaryString('0');
      bitSet.addBinaryString('11');
      expect(bitSet.toString()).toEqual('101011');
      expect(bitSet.size).toEqual(6);
    });
  });

  describe('padLeft', () => {
    it('pads empty BitSet correctly', () => {
      const bitSet = new BitSet();
      bitSet.padLeft(5);
      expect(bitSet.toString()).toEqual('00000');
      expect(bitSet.size).toEqual(5);
    });

    it('pads BitSet with custom fill string', () => {
      const bitSet = new BitSet();
      bitSet.set(0);
      bitSet.padLeft(5, '1');
      expect(bitSet.toString()).toEqual('11111');
      expect(bitSet.size).toEqual(5);
    });

    it('pads non-empty BitSet correctly', () => {
      const bitSet = new BitSet(2);
      bitSet.set(0, true);
      bitSet.padLeft(5);
      expect(bitSet.toString()).toEqual('00010');
      expect(bitSet.size).toEqual(5);
    });

    it('does nothing when maxLength is less than current size', () => {
      const bitSet = new BitSet();
      bitSet.fromBinaryString('1010');
      bitSet.padLeft(2);
      expect(bitSet.toString()).toEqual('1010');
      expect(bitSet.size).toEqual(4);
    });

    it('pads correctly when maxLength equals current size', () => {
      const bitSet = new BitSet();
      bitSet.fromBinaryString('1010');
      bitSet.padLeft(4);
      expect(bitSet.toString()).toEqual('1010');
      expect(bitSet.size).toEqual(4);
    });
  });
});
