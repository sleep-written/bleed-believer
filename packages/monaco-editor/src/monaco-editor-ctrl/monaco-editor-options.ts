import * as monaco from 'monaco-editor';

export type MonacoEditorOptions = Omit<
    monaco.editor.IEditorOptions,
    'readOnly' | 'domReadOnly'
>;