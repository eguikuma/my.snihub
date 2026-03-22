import { TagBadge } from "@/foundations/components/tag-badge";

type TagListProps = {
  tags: string[];
};

/**
 * タグバッジを横並びで表示する
 */
export const TagList = ({ tags }: TagListProps) => (
  <div className="flex flex-wrap gap-1.5">
    {tags.map((tag) => (
      <TagBadge key={tag} name={tag} />
    ))}
  </div>
);
