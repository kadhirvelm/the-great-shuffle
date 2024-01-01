export interface PushBack {
  velocity: number;
  duration: number;
}

export type RecursivePartial<T> = {
  [Key in keyof T]?: RecursivePartial<T[Key]>;
};
