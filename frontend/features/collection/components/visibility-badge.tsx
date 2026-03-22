import clsx from "clsx";
import {
  Visibilities,
  VisibilityLabels,
  type Visibility,
} from "@/foundations/definitions";

const Styles: Record<Visibility, { text: string; dot: string; label: string }> =
  {
    [Visibilities.Public]: {
      text: "text-success",
      dot: "bg-success",
      label: VisibilityLabels[Visibilities.Public],
    },
    [Visibilities.Unlisted]: {
      text: "text-warning",
      dot: "bg-warning",
      label: VisibilityLabels[Visibilities.Unlisted],
    },
    [Visibilities.Private]: {
      text: "text-ink-muted",
      dot: "bg-ink-muted",
      label: VisibilityLabels[Visibilities.Private],
    },
  };

type VisibilityBadgeProps = {
  visibility: Visibility;
};

/**
 * 公開範囲をドットとテキストで色分け表示する
 */
export const VisibilityBadge = ({ visibility }: VisibilityBadgeProps) => {
  const style = Styles[visibility];

  return (
    <span
      className={clsx(
        "flex shrink-0 items-center gap-1 whitespace-nowrap text-xs",
        style.text,
      )}
    >
      <span className={clsx("inline-block h-2 w-2 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
};
