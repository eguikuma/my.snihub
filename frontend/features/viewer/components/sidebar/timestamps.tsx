import { toYYYYMMDDHHmm } from "@/foundations/libraries/date";

type TimestampsProps = {
  createdAt: string;
  updatedAt: string;
};

/**
 * 作成日時と更新日時を定義リスト形式で表示する
 */
export const Timestamps = ({ createdAt, updatedAt }: TimestampsProps) => (
  <section className="flex flex-col gap-2">
    <dl className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <dt className="text-xs font-medium text-ink-muted">作成日時</dt>
        <dd className="text-xs text-ink">{toYYYYMMDDHHmm(createdAt)}</dd>
      </div>
      <div className="flex items-center gap-2">
        <dt className="text-xs font-medium text-ink-muted">更新日時</dt>
        <dd className="text-xs text-ink">{toYYYYMMDDHHmm(updatedAt)}</dd>
      </div>
    </dl>
  </section>
);
