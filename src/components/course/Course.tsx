import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import text from './course.md?raw';
import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import { BsLink45Deg } from 'react-icons/bs';

export default function Course() {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkToc]}
      rehypePlugins={[
        [rehypeExternalLinks, { target: '_blank' }],
        rehypeRaw,
        rehypeSlug,
        rehypeAutolinkHeadings,
      ]}
      components={{
        img: ({ node, ...props }) => (
          <img style={{ maxWidth: '50%' }} {...props} />
        ),
      }}
    >
      {text}
    </Markdown>
  );
}
