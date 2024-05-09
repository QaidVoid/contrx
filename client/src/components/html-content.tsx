import { TypographyStylesProvider } from '@mantine/core';
import type { HTMLContent } from '@tiptap/react';

type Props = {
  content: HTMLContent
}

export default function RenderHTML({ content }: Props) {
  return (
    <TypographyStylesProvider>
      <div
        dangerouslySetInnerHTML={{
          __html: content
        }}
      />
    </TypographyStylesProvider>
  );
}
