import { useEffect, useState } from 'react';
import { COMMON_UNITS, isCommonUnit } from '../lib/units';
import { useTranslation } from 'react-i18next';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function UnitPicker({ value, onChange }: Props) {
  const { t } = useTranslation();
  const initialIsCustom = !!value && !isCommonUnit(value);
  const [customMode, setCustomMode] = useState(initialIsCustom);

  useEffect(() => {
    setCustomMode(!!value && !isCommonUnit(value));
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {COMMON_UNITS.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => {
              onChange(u);
              setCustomMode(false);
            }}
            className={`chip ${value === u ? 'chip-active' : ''}`}
          >
            {u}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setCustomMode(true);
            if (isCommonUnit(value)) onChange('');
          }}
          className={`chip ${customMode ? 'chip-active' : ''}`}
        >
          {t('unit.other')}
        </button>
      </div>
      {customMode && (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('unit.customPlaceholder')}
          className="input"
        />
      )}
    </div>
  );
}
