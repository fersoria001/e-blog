import theme from "./EditorTheme";
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { OverflowNode } from '@lexical/overflow'
import { AutoLinkNode } from '@lexical/link'
import { CodeHighlightNode, CodeNode } from '@lexical/code';
const editorConfig = {
    namespace: 'eBlog',
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        AutoLinkNode,
        OverflowNode
    ],
    onError(error: Error) {
        throw error;
    },
    theme: theme,
};
export default editorConfig