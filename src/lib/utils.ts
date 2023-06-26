
export class Utils {
  static between = (source: number, start: number, end: number): boolean =>
    source >= start && source < end;

  static is = (source: number, numbers: number[]) =>
    numbers.some((n) => n === source);
}
