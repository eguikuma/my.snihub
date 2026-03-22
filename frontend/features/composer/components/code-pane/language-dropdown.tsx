import clsx from "clsx";
import { LanguageOptions, type Language } from "@/foundations/definitions";
import { useDismiss, useToggle } from "@/foundations/hooks";
import { toLanguageLabel } from "@/foundations/libraries/language";

type LanguageDropdownProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

/**
 * 言語セレクタのドロップダウンを描画する
 */
export const LanguageDropdown = ({
  language,
  onLanguageChange,
}: LanguageDropdownProps) => {
  const { opened, close, toggle } = useToggle();
  const dropdownRef = useDismiss<HTMLDivElement>(opened, close);

  const selectLanguage = (value: Language) => {
    onLanguageChange(value);
    close();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1 rounded bg-surface px-2 py-0.5 font-mono text-xs text-ink-secondary transition-colors hover:text-ink"
        aria-expanded={opened}
        aria-haspopup="listbox"
      >
        {toLanguageLabel(language)}
        <span className="text-[10px] text-ink-muted">▾</span>
      </button>

      {opened && (
        <div
          className="absolute left-0 top-full z-50 mt-1 max-h-[280px] w-40 overflow-y-auto rounded-lg border border-edge bg-surface-raised py-1 shadow-lg"
          role="listbox"
          aria-label="言語選択"
        >
          {LanguageOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={language === option.value}
              onClick={() => selectLanguage(option.value)}
              className={clsx(
                "flex w-full items-center px-3 py-1.5 text-left font-mono text-xs transition-colors",
                language === option.value
                  ? "bg-accent/10 text-accent"
                  : "text-ink-secondary hover:bg-surface-hover hover:text-ink",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
