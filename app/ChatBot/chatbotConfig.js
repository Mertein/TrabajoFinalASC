import { createChatBotMessage } from 'react-chatbot-kit';
import LearningOptions from '../components/LearningOptions/LearningOptions';


const config = {
  initialMessages: [createChatBotMessage(`Hola, soy un bot. ¿En qué puedo ayudarte?`, {
    widget: "learningOptions",
  })],
  botName: 'Robot FAQS',
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
      textColor: "#FFFFFF",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  },
  widgets: [
    {
      widgetName: "learningOptions",
      widgetFunc: (props) => <LearningOptions {...props} categories={'Categories'} />,
    },
    {
      widgetName: "feedback",
      widgetFunc: (props) => <LearningOptions {...props}  payload={props.payload} categories={'feedback'} />,
    },
    {
      widgetName: "dynamicOptions",
      widgetFunc: (props) => <LearningOptions {...props} type={props.payload} />,
    },
    // {
    //   // widgetName: "inscripciones",
    //   widgetFunc: (props) => <LearningOptions {...props}  />,
    // },
    // {
    //   // widgetName: "inscripciones",
    //   widgetFunc: (props) => <LearningOptions {...props}  />,
    // },
    // {
    //   // widgetName: "inscripciones",
    //   widgetFunc: (props) => <LearningOptions {...props}  />,
    // },
  ],
};

export default config;