/** 조건부 className 결합 유틸 (falsy 값은 무시) */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
