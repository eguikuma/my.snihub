import { toYYYYMMDDHHmm } from "@/foundations/libraries/date";

type TimestampsProps = {
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
};

/**
 * 作成日時・更新日時・有効期限を定義リスト形式で表示する
 */
export const Timestamps = ({
  createdAt,
  updatedAt,
  expiresAt,
}: TimestampsProps) => (
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
      <div className="flex items-center gap-2">
        <dt className="text-xs font-medium text-ink-muted">有効期限</dt>
        <dd className="text-xs text-ink">
          {expiresAt ? toYYYYMMDDHHmm(expiresAt) : "無期限"}
        </dd>
      </div>
    </dl>
  </section>
);
