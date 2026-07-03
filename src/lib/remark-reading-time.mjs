import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin that injects `minutesRead` into every entry's frontmatter,
 * so layouts can show "X min read" without any manual work per post.
 */
export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesRead = Math.max(1, Math.round(readingTime.minutes));
  };
}
