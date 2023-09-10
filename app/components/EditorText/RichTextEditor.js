import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { toast } from 'react-hot-toast';

const RichTextEditor = () => {

  // EditorState.createWithContent(): esta es una función de utilidad que crea un estado de editor con el contenido especificado.
  // EditorState.createFromRaw(): esta es una función de utilidad que crea un estado de editor a partir de un objeto JavaScript sin procesar.
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const onSave = async () => {
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    console.log(JSON.parse(content));
  
    // Save content to database or send to server
    
    try {
      const resultFetch = await fetch('/api/saveTextEditor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: content,
      });
      const body = await resultFetch.json()
      toast.success('Saved successfully');
      
    } catch (error) {
      console.log(error);
      toast.error('Error saving');
    }
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
      <button onClick={onSave}>Save</button>
    </div>
  );
};

export default RichTextEditor;