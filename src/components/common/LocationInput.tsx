import { useId, useState, type FormEvent } from 'react';
import { cx } from '../../utils/cx';
import { ClayButton } from './ClayButton';
import { ClayCard } from './ClayCard';
import styles from './LocationInput.module.css';

export interface LocationInputProps {
  /** 입력한 지역명(앞뒤 공백 제거)을 전달 */
  onSubmit: (query: string) => void;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  /** 좌표 변환 중일 때 */
  loading?: boolean;
  /** 외부에서 전달하는 오류 메시지 (예: "그런 곳을 찾지 못했어요") */
  errorMessage?: string;
  defaultValue?: string;
  className?: string;
}

/** 위치 권한이 없을 때 동네/역 이름을 직접 입력받는 폼 */
export function LocationInput({
  onSubmit,
  label = '동네나 역 이름을 입력해 주세요',
  placeholder = '예) 강남역, 성수동',
  submitLabel = '이 근처로 찾기',
  loading = false,
  errorMessage,
  defaultValue = '',
  className,
}: LocationInputProps) {
  const inputId = useId();
  const errorId = useId();
  const [value, setValue] = useState(defaultValue);
  const [localError, setLocalError] = useState<string>();

  const error = localError ?? errorMessage;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = value.trim();
    if (!query) {
      setLocalError('지역 이름을 입력해 주세요.');
      return;
    }
    setLocalError(undefined);
    onSubmit(query);
  };

  return (
    <ClayCard color="white" padding="md" className={cx(styles.card, className)}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <div className={styles.row}>
          <input
            id={inputId}
            className={cx(styles.input, error && styles.invalid)}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (localError) setLocalError(undefined);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            disabled={loading}
          />
          <ClayButton type="submit" variant="primary" size="md" loading={loading} className={styles.submit}>
            {submitLabel}
          </ClayButton>
        </div>
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </ClayCard>
  );
}
