'use client'
import { Button } from '@/components/ui/button';
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, $getNearestNodeOfType, $isEditorIsNestedEditor, mergeRegister } from '@lexical/utils';
import { $isTableNode } from '@lexical/table';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, ChevronDown,
  Code, Heading1, Heading2, Heading3, Italic, List, ListChecks, ListOrdered,
  Redo, Strikethrough, Text, TextQuote, Underline, Undo
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { $setBlocksType } from '@lexical/selection';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { $isLinkNode } from '@lexical/link';
import clsx from 'clsx';
import { getSelectedNode } from '@/lib/getSelectedNode';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const LowPriority = 1;
const blockTypeToBlockName = {
  bullet: 'Lista',
  check: 'Lista de verificación',
  code: 'Bloque de código',
  h1: 'Título 1',
  h2: 'Título 2',
  h3: 'Título 3',
  h4: 'Título 4',
  h5: 'Título 5',
  h6: 'Título 6',
  number: 'Lista numerada',
  paragraph: 'Normal',
  quote: 'Cita',
};
const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root');
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isImageCaption, setIsImageCaption] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        setIsImageCaption(
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container',
          ),
        );
      } else {
        setIsImageCaption(false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);
      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      let matchingParent;
      if ($isLinkNode(parent)) {
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
    }
  }, [activeEditor, editor]);


  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor]);


  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const canViewerSeeInsertDropdown = !isImageCaption;
  const canViewerSeeInsertCodeButton = !isImageCaption;

  return (
    <div className="flex flex-wrap items-center gap-1 mb-4 p-2 lg:flex-nowrap" ref={toolbarRef}>
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <div className="flex items-center mr-2 mb-2 lg:mb-0">
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={activeEditor}
          />
        </div>
      )}
      {blockType === 'code' ? (
        <div className="flex-grow min-w-[200px] mb-2 lg:mb-0">
          <Select
            aria-label="Select language"
            onValueChange={(value) => onCodeLanguageSelect(value)}>
            <SelectTrigger className='w-full lg:w-44'>
              <SelectValue>
                {codeLanguage !== "" ? getLanguageFriendlyName(codeLanguage) : "Seleccioná un lenguaje"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
                return (
                  <SelectItem
                    value={value}
                    key={value}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>)
        :
        (<>
          <div className="flex flex-wrap gap-1 mb-2 lg:mb-0 lg:mr-2">
            <Button
              disabled={!canUndo}
              onClick={() => {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
              }}
              variant={"outline"}
              size={"icon"}
              aria-label="Undo">
              <Undo />
            </Button>
            <Button
              disabled={!canRedo}
              onClick={() => {
                editor.dispatchCommand(REDO_COMMAND, undefined);
              }}
              variant={"outline"}
              size={"icon"}
              aria-label="Redo">
              <Redo />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mb-2 lg:mb-0 lg:mr-2">
            <Button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
              }}
              variant={"outline"}
              size={"icon"}
              className={clsx("p-2", {
                "bg-primary/20": isBold
              })}
              aria-label="Format Bold">
              <Bold />
            </Button>
            <Button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
              variant={"outline"}
              size={"icon"}
              className={clsx("p-2", {
                "bg-primary/20": isItalic
              })}
              aria-label="Format Italics">
              <Italic />
            </Button>
            <Button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
              variant={"outline"}
              size={"icon"}
              className={clsx("p-2", {
                "bg-primary/20": isUnderline
              })}
              aria-label="Format Underline">
              <Underline />
            </Button>
            <Button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
              }}
              variant={"outline"}
              size={"icon"}
              className={clsx("p-2", {
                "bg-primary/20": isStrikethrough
              })}
              aria-label="Format Strikethrough">
              <Strikethrough />
            </Button>
          </div>
        </>)}
      <div className="flex flex-wrap gap-1 mb-2 lg:mb-0 lg:mr-2">
        <Button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          }}
          variant={"outline"}
          size={"icon"}
          aria-label="Left Align">
          <AlignLeft className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          }}
          variant={"outline"}
          size={"icon"}
          aria-label="Center Align">
          <AlignCenter className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
          }}
          variant={"outline"}
          size={"icon"}
          aria-label="Right Align">
          <AlignRight className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
          }}
          variant={"outline"}
          size={"icon"}
          aria-label="Justify Align">
          <AlignJustify className='h-4 w-4' />
        </Button>
      </div>
    </div >
  );
}

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Formatting options for text style">
        <Button className='flex justify-between w-44' variant={"outline"}>
          {blockTypeToBlockName[blockType]}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'paragraph' })}
          onClick={formatParagraph}>
          <Text />
          <span>Normal</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'h1' })}
          onClick={() => formatHeading('h1')}>
          <Heading1 />
          <span>Título 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'h2' })}
          onClick={() => formatHeading('h2')}>
          <Heading2 />
          <span>Título 2</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'h3' })}
          onClick={() => formatHeading('h3')}>
          <Heading3 />
          <span>Título 3</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'bullet' })}
          onClick={formatBulletList}>
          <List />
          <span>Lista</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'number' })}
          onClick={formatNumberedList}>
          <ListOrdered />
          <span>Lista numerada</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'check' })}
          onClick={formatCheckList}>
          <ListChecks />
          <span>Lista de verificación</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'quote' })}
          onClick={formatQuote}>
          <TextQuote />
          <span>Cita</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={clsx("hover:bg-slate-100 flex", { 'bg-slate-100': blockType === 'code' })}
          onClick={formatCode}>
          <Code />
          <span>Bloque de código</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  );
}