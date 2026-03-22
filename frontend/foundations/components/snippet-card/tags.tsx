import { MAX_VISIBLE_TAGS, type Language } from "../../definitions";
import { LanguageBadge } from "../language-badge";
import { TagBadge } from "../tag-badge";

type TagsProps = {
  language: Language;
  tags: string[];
};

/**
 * 言語バッジと先頭のタグバッジを横並びで表示する
 */
export const Tags = ({ language, tags }: TagsProps) => (
  <div className="mt-2 flex flex-wrap items-center gap-1.5">
    <LanguageBadge language={language} />
    {tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
      <TagBadge key={tag} name={tag} />
    ))}
  </div>
);
