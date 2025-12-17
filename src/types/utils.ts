export type ValueOf<T> = T[keyof T];

export type KeysOfUnion<T> = T extends T ? keyof T : never;
