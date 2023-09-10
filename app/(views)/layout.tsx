'use client'
import { CssBaseline} from "@mui/material";
import {ThemeProvider} from '@mui/material/styles';
import {SmartToy as SmartToyIcon} from '@mui/icons-material';
import { useState } from 'react';
import {useMode, ColorModeContext} from './../theme';
import './layout.css'
import config from '../ChatBot/chatbotConfig.js';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import ActionProvider from '../ChatBot/Widgets/ActionProvider/ActionProviderDocs';
import MessageParser from '../ChatBot/Widgets/MessageParser/MessageParser';
import useSWR from "swr";
import axios from "axios";
 
export default function MainLayout({children}: {children: React.ReactNode}) {
  const [theme, colorMode] = useMode();
  const [showChatbot, setShowChatbot] = useState(false); 
  const fetcher = (url: any) => axios.get(url).then((res: { data: any; }) => res.data)
  const { data: faqsCategories, error, isLoading } = useSWR('/api/faqs/categories', fetcher)
  const { data: faqs, error: errorFaqs, isLoading: isLoadingFaqs } = useSWR('/api/faqs', fetcher)
  return (
    <>
      {/* Include shared UI here e.g. a header or sidebar */}
      <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <div className="fixed bottom-5 right-5">
          {showChatbot && (
            <div>
              <button className="cursor-pointer bg-blue-700 border-none rounded-3xl h-14 w-14 p-3" onClick={() => setShowChatbot(!showChatbot)}>
                <SmartToyIcon className="text-white" />
              </button>
              <div className="mt-2 text-black">
                <Chatbot
                  config={config}
                  messageParser={MessageParser}
                  actionProvider={ActionProvider}
                  faqsCategories={faqsCategories}
                  faqs={faqs}
                />
              </div>
            </div>
          )}
          {!showChatbot && (
            <button className="cursor-pointer bg-blue-700 border-none rounded-3xl h-14 w-14 p-3" onClick={() => setShowChatbot(!showChatbot)}>
              <SmartToyIcon className="text-white" />
            </button>
          )}
          </div>
      </ThemeProvider>
      </ColorModeContext.Provider> 
      
    </>
  );
}