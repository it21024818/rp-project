export class ArrayUtils {
  /**
   * Return a random element from the given array.
   * @param arr Array of any length
   * @return An element. Undefined if array is empty.
   */
  public static selectRandomOne = <T>(arr: T[]): T | undefined => {
    if (arr.length === 0) return undefined;
    const randomIdx = Math.round(Math.random() * (arr.length - 1));
    return arr[randomIdx];
  };
}
