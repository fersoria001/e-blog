import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function SetEditableStatePlugin({ serializedPrevState }: { serializedPrevState: string }) {
    const [editor] = useLexicalComposerContext();
    editor.setEditorState(editor.parseEditorState(serializedPrevState));
    return (
        <></>
    )

}