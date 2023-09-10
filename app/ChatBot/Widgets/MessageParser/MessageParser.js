import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const messageLowerCase = message.toLowerCase();
    if (messageLowerCase.includes('hola' || 'hi' || 'hello' || 'hey' || 'hola!')) {
      actions.handleHello();
    }

    if (messageLowerCase.includes("cursos")) {
      actions.handleCourse();
    }

    if (messageLowerCase.includes("inscripciones" || "inscribirme" || "inscribir" || "inscripcion" || "anotarme")) {
      actions.handleInscription();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
