import clsx from "clsx";
import { VisibilityOptions, type Visibility } from "@/foundations/definitions";

type VisibilitySelectorProps = {
  value: Visibility;
  onChange: (value: Visibility) => void;
};

/**
 * 3択カード形式で公開範囲を選択するセレクタを描画する
 */
export const VisibilitySelector = ({
  value,
  onChange,
}: VisibilitySelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-2 tablet:grid-cols-3 desktop:grid-cols-3">
      {VisibilityOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              "rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              isSelected
                ? "border-accent bg-accent/8 text-ink"
                : "border-edge bg-surface-raised text-ink-secondary hover:border-edge-strong",
            )}
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-ink-muted">
                {option.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
