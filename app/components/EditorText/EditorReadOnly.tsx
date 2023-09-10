import { EditorState, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface EditorReadOnlyProps {
  editorState: EditorState;
}

const EditorReadOnly: React.FC<EditorReadOnlyProps> = ({ editorState }) => {
  const contentState: ContentState = editorState.getCurrentContent();
  const contentHTML: string = stateToHTML(contentState);

  return <div dangerouslySetInnerHTML={{ __html: contentHTML }} />;
};

export default EditorReadOnly;