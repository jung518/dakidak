import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './ClayButton.module.css';

export type ClayButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ClayButtonSize = 'sm' | 'md' | 'lg';

interface ClayButtonBaseProps {
  variant?: ClayButtonVariant;
  size?: ClayButtonSize;
  /** 텍스트 앞에 표시할 아이콘 (이모지 또는 요소) */
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  /** true 이면 스피너를 보여주고 클릭을 막음 */
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ClayButtonBaseProps>;
type NativeAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ClayButtonBaseProps>;

/** 일반 버튼 */
export type ClayButtonAsButton = ClayButtonBaseProps & NativeButtonProps & { href?: undefined };
/** href 를 넘기면 외부 링크(<a target="_blank">)로 렌더링 */
export type ClayButtonAsLink = ClayButtonBaseProps & NativeAnchorProps & { href: string };

export type ClayButtonProps = ClayButtonAsButton | ClayButtonAsLink;

function getClassName(props: ClayButtonBaseProps): string {
  const { variant = 'primary', size = 'md', fullWidth, loading, disabled, className } = props;
  return cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    disabled && styles.disabled,
    className,
  );
}

function Content({ icon, loading, children }: Pick<ClayButtonBaseProps, 'icon' | 'loading' | 'children'>) {
  return (
    <>
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )
      )}
      {children && <span className={styles.label}>{children}</span>}
    </>
  );
}

export function ClayButton(props: ClayButtonProps) {
  const className = getClassName(props);

  if (props.href !== undefined) {
    const {
      variant: _v, size: _s, icon, fullWidth: _f, disabled, loading, className: _c, children,
      href, target = '_blank', rel = 'noopener noreferrer', onClick, ...rest
    } = props;
    const inactive = disabled || loading;
    return (
      <a
        {...rest}
        className={className}
        href={inactive ? undefined : href}
        target={target}
        rel={rel}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        onClick={inactive ? (e) => e.preventDefault() : onClick}
      >
        <Content icon={icon} loading={loading}>
          {children}
        </Content>
      </a>
    );
  }

  const {
    variant: _v, size: _s, icon, fullWidth: _f, disabled, loading, className: _c, children,
    href: _h, type = 'button', ...rest
  } = props;
  return (
    <button
      {...rest}
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <Content icon={icon} loading={loading}>
        {children}
      </Content>
    </button>
  );
}
