/**
 * Some local storage helpers.
 */

/**
 * Retrieve a key/value pair from localStorage.
 *
 * @param key Key fo the key/value pair to load from local Storage.
 * @returns JSON parsed value of localStorage with key. Undefined if error of if the key does not exist.
 */
export const loadState = (key: string): object | undefined => {
  try {
    const serializedState: string | null = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err: unknown) {
    // TODO: Better error logging

    return undefined;
  }
};

export const saveState = (key: string, value: object): void => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (err: unknown) {
    // TODO: Better error logging
  }
};

export const removeState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (err: unknown) {
    // TODO: Better error logging
  }
};
