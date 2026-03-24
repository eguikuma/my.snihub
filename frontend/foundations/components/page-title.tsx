"use client";

import { useEffect } from "react";

type PageTitleProps = {
  title: string;
};

/**
 * ブラウザタブのタイトルをクライアント側で更新する
 */
export const PageTitle = ({ title }: PageTitleProps) => {
  useEffect(() => {
    document.title = `${title} | SniHub`;
  }, [title]);

  return null;
};
