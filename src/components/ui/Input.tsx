import clsx from 'clsx';
import styles from './Input.module.css';

type InputProps = {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  min?: string;
  max?: string;
};

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled,
  error,
  className,
  min,
  max,
}: InputProps) {
  return (
    <div className={clsx(styles.group, className)}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.req}> *</span>}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={clsx(styles.input, error && styles.inputError)}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
