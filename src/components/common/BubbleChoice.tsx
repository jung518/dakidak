import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import styles from './BubbleChoice.module.css';

export type BubbleSize = 'sm' | 'md' | 'lg';

export interface BubbleOption {
  value: string;
  label: string;
}

export interface BubbleChoiceProps {
  options: readonly BubbleOption[];
  /** 현재 선택된 값 (이전 단계로 돌아왔을 때 표시) */
  selectedValue?: string;
  /** 톡 튀는 애니메이션이 끝난 뒤 호출 */
  onSelect: (value: string) => void;
  /** 흰색으로 구분해서 보여줄 값 (예: '상관없음') */
  mutedValue?: string;
  /** 그룹 제목 요소 id (스크린 리더용) */
  labelledBy?: string;
  className?: string;
}

/** 크기가 섞이도록 순서별 기본 크기를 정하고, 글자가 길면 더 큰 버블로 */
const SIZE_PATTERN: BubbleSize[] = ['lg', 'md', 'sm', 'md', 'lg', 'sm'];
const POP_MS = 220;

function getBubbleSize(label: string, index: number): BubbleSize {
  const length = Array.from(label.replace(/\s/g, '')).length;
  if (length > 5) return 'lg';
  const base = SIZE_PATTERN[index % SIZE_PATTERN.length] ?? 'md';
  if (length > 3 && base === 'sm') return 'md';
  return base;
}

/** 동글동글한 버블 모양 선택지 묶음 */
export function BubbleChoice({
  options,
  selectedValue,
  onSelect,
  mutedValue,
  labelledBy,
  className,
}: BubbleChoiceProps) {
  const reduceMotion = useReducedMotion();
  const [popping, setPopping] = useState<string>();
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleClick = (value: string) => {
    if (popping) return;
    if (reduceMotion) {
      onSelect(value);
      return;
    }
    setPopping(value);
    timerRef.current = window.setTimeout(() => {
      setPopping(undefined);
      onSelect(value);
    }, POP_MS);
  };

  return (
    <div className={cx(styles.group, className)} role="group" aria-labelledby={labelledBy}>
      {options.map((option, index) => {
        const selected = (popping ?? selectedValue) === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={cx(
              styles.bubble,
              styles[getBubbleSize(option.label, index)],
              styles[`tone${index % 3}`],
              option.value === mutedValue && styles.muted,
              selected && styles.selected,
              popping === option.value && styles.popping,
            )}
            // 버블마다 둥실거리는 박자를 다르게
            style={{ animationDelay: `${(index % 4) * -0.7}s` }}
            aria-pressed={selected}
            onClick={() => handleClick(option.value)}
          >
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
