import { TypographyStylesProvider } from '@mantine/core';
import { generateHTML } from "@tiptap/core";
import type { JSONContent } from '@tiptap/react';
import { useMemo } from 'react';
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import HardBreak from '@tiptap/extension-hard-break';

type Props = {
  content: JSONContent
}

export default function RenderHTML({ content }: Props) {
  console.log("CONTENT", content);

  const output = useMemo(() => {
    return generateHTML(content, [
      Document,
      Paragraph,
      Text,
      Bold,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Superscript,
      SubScript,
      Highlight,
      Italic,
      Heading,
      HardBreak
    ])
  }, [content])

  return (
    <TypographyStylesProvider>
      <div
        dangerouslySetInnerHTML={{
          __html: output
        }}
      />
    </TypographyStylesProvider>
  );
}
