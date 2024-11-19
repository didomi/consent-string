import {
  BASE64_DICT,
  BASE64_REVERSE_DICT,
  BASE64_BIT_FIELD_TO_NUMBER,
  BASE64_NUMBER_TO_BIT_FIELD,
  BASE64_BASIS,
  BASE64_LCM,
} from '@/constants/base64';
import { UUID } from '@/types/uuid.type';
import {
  BASE16_BASIS,
  BASE16_DICT,
  BASE16_REVERSE_DICT,
  BASE16_NUMBER_TO_BIT_FIELD,
  BASE16_BIT_FIELD_TO_NUMBER,
} from '@/constants/base16';

/**
 * This class implements a vector of bits that grows as needed.
 *  - each component of the bit set has a boolean value;
 *  - the bits of a `BitSet` are indexed by nonnegative integers;
 *  - individual indexed bits can be examined, set, or cleared;
 *  - by default, all bits in the set initially have the value `false`.
 *
 * `BitSet` provides `toBase64` and `fromBase64` methods to convert
 *   and create `BitSet` to / from `Base64` string
 */
export class BitSet {
  /**
   * BitSet implemented as string of `0` - `false` and `1` - `true`
   */
  private bitString: string;

  /**
   * Creates BitSet with number of bits equal to `size`. All bits set to `false`
   * @param initialSize number of bits in BitSet, default value is `0`
   */
  constructor(initialSize = 0) {
    this.bitString = '0'.repeat(initialSize);
  }

  /**
   * Number of bits in BitSet
   */
  get size(): number {
    return this.bitString.length;
  }

  /**
   * `true` if BitSet is empty
   */
  get isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Set all bits values in BitSet equal to `bitSet` values
   * @param bitSet
   * @returns `this`
   */
  public clone(bitSet: BitSet): BitSet {
    this.bitString = bitSet.toString();
    return this;
  }

  /**
   * Returns bit value for given index
   * @param index nonnegative index to the component (bit) in BitSet
   * @returns bit value
   */
  public get(index: number): boolean {
    return this.bitString[index] === '1';
  }

  /**
   * Returns string with `0` and `1` for values in the BitSet
   * @returns `0` | `1` string, where `0` - `false` and `1` - `true`
   */
  public toString(): string {
    return this.bitString;
  }

  /**
   * Add (concatenate) `bitSet` values to the `this` values, returns `this`
   * @param bitSet BitSet to add to the end of the given BitSet
   * @returns `this`
   */
  public add(bitSet: BitSet): BitSet {
    this.bitString += bitSet;
    return this;
  }

  /**
   * Insert `bitSet` values before `this` values, returns `this`
   * @param bitSet BitSet to insert at the beginning of the given BitSet
   * @returns `this`
   */
  public insert(bitSet: BitSet): BitSet {
    this.bitString = bitSet + this.bitString;
    return this;
  }

  /**
   * Insert `shift` number of bits with `false` value at the beginning of `this` shifting left current bits, returns `this`
   * @param shift number of bits to insert
   * @returns `this`
   */
  public shiftRight(shift: number): BitSet {
    this.bitString = '0'.repeat(shift) + this.bitString;
    return this;
  }

  /**
   * Delete `shift` number of bits form the beginning of `this` shifting right all remaining bits, returns `this`
   * @param shift number of bits to remove
   * @returns `this`
   */
  public shiftLeft(shift: number): BitSet {
    this.bitString = this.bitString.substring(shift);
    return this;
  }

  /**
   * Delete bits from the end of the string
   * @param numberOfBits number of bits to trim form the end of the BitSet
   * @returns
   */
  public trim(numberOfBits: number): BitSet {
    this.bitString = this.bitString.substring(0, this.size - numberOfBits);
    return this;
  }

  /**
   * Create new `BitSet` form given `BitSet` form segment of bits
   * @param startIndex start index for the segment of bits
   * @param numberOfBits number of bits in the segment
   * @returns `BitSet` created form `BitSet[startIndex, startIndex + numberOfBits - 1]`
   */
  public subSet(startIndex: number, numberOfBits: number): BitSet {
    return new BitSet().fromBinaryString(
      this.bitString.substring(startIndex, startIndex + numberOfBits),
    );
  }

  /**
   * Set bit value at the given `index`
   * @param index nonnegative integer index for bit in BitSet
   * @param value value to set `true` or `false`, default is `true`
   */
  public set(index: number, value = true) {
    const stringValue = value ? '1' : '0';

    if (index >= this.bitString.length) {
      this.bitString += '0'.repeat(index - this.size) + stringValue;
    } else {
      this.bitString =
        this.bitString.substring(0, index) + stringValue + this.bitString.substring(index + 1);
    }
  }

  /**
   * Append a bit value to the end of the BitSet
   *
   * @param value value to append
   */
  public addBoolean(value: boolean) {
    const stringValue = value ? '1' : '0';
    this.bitString += stringValue;
  }

  /**
   * Append a binary string to the end of the BitSet
   *
   * @param binaryString binary string to append
   */
  public addBinaryString(binaryString: string) {
    this.bitString += binaryString;
  }

  /**
   * Encode `BitSet` to `Base64` string
   * @returns `Base64` string representation of `BitSet`
   */
  public toBase64(): string {
    let toEncode = this.bitString;
    const padding = this.size % BASE64_LCM;

    toEncode += padding ? '0'.repeat(BASE64_LCM - padding) : '';

    let result = '';

    for (let i = 0; i < toEncode.length; i += BASE64_BASIS) {
      const base64BitField = toEncode.substring(i, i + BASE64_BASIS);
      const base64Index = BASE64_BIT_FIELD_TO_NUMBER.get(base64BitField);
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      const base64Character = BASE64_DICT[base64Index!];
      result += base64Character;
    }

    return result;
  }

  /**
   * Decode `Base64` string to `BitSet`, returns `this` if decoding is successful and `null` if input string has invalid format
   * @param base64string `Base64` string to decode
   * @returns `this`
   */
  public fromBase64(base64string: string): BitSet | null {
    /**
     * should contain only characters from the BASE64_DICT
     */
    if (!/^[A-Za-z0-9\-_]+$/.test(base64string)) {
      return null;
    }

    this.bitString = '';

    for (let i = 0; i < base64string.length; i++) {
      const base64Index = BASE64_REVERSE_DICT.get(base64string[i]);
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      const base64BitField = BASE64_NUMBER_TO_BIT_FIELD.get(base64Index!);
      this.bitString += base64BitField;
    }

    return this;
  }

  /**
   * Create `BitSet` from the binary string
   * @param binaryString string with `0` and `1` characters
   * @returns `this`
   */
  public fromBinaryString(binaryString: string): BitSet {
    this.bitString = '';
    for (let i = 0; i < binaryString.length; i++) {
      if (binaryString[i] === '1' || binaryString[i] === '0') {
        this.bitString += binaryString[i];
      }
    }
    return this;
  }

  /**
   * Create `BitSet` from UUID string
   * @param uuid Base16 segmented string
   * @returns `this`
   */
  public fromUUID(uuid: UUID): BitSet {
    this.bitString = '';
    for (let i = 0; i < uuid.length; i++) {
      const base16Index = BASE16_REVERSE_DICT.get(uuid[i]);
      if (base16Index !== undefined) {
        const base16BitField = BASE16_NUMBER_TO_BIT_FIELD.get(base16Index);
        this.bitString += base16BitField;
      }
    }
    return this;
  }

  /**
   * Decode `BitSet` to `UUID` string
   * @returns `UUID` Base16 string with the following format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   */
  public toUUID(): UUID {
    let result = '';

    for (let i = 0; i < this.size; i += BASE16_BASIS) {
      const base16BitField = this.bitString.substring(i, i + BASE16_BASIS);
      const base16Index = BASE16_BIT_FIELD_TO_NUMBER.get(base16BitField);
      /* eslint-disable  @typescript-eslint/no-non-null-assertion */
      const base16Character = BASE16_DICT[base16Index!];
      result += base16Character;
    }
    /**
     * UUID format
     * 0        8    12   16   20          32 | 128 bit
     * 1875afe1-461b-6b9f-9d66-700174abbffc
     *     8      4   4    4       12
     */
    return `${result.substring(0, 8)}-${result.substring(8, 12)}-${result.substring(
      12,
      16,
    )}-${result.substring(16, 20)}-${result.substring(20)}`;
  }
}
