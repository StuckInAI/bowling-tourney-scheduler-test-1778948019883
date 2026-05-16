import clsx from 'clsx';
import styles from './Input.module.css';

type SelectOption = { value: string; label: string };

type SelectProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  className,
}: SelectProps) {
  return (
    <div className={clsx(styles.group, className)}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.req}> *</span>}</label>}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={styles.input}
        style={{ cursor: 'pointer' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
