import './App.css'
import { useState } from 'react';
import { Box } from '@mui/material'
import ChatBox from './components/ChatBox';
import Title from './components/Title'
import NewAudioInput from './components/NewAudioInput';

function App() {
  // タイトルの内容
  const title = "NICE BUDDY";

  // chatをstateとして管理
  const [chat, setChat] = useState<string[][]>([
  ]);

  const handleUploadResult = (speechScript: string, answer: string) => {
    // chatAPIの回答をchatに追加
    if(speechScript) setChat((prevChat) => [...prevChat, ['assistant', speechScript]]);
    if(answer) setChat((prevChat) => [...prevChat, ['assistant', answer]]);
  };

  return (
    <Box>
      <Title title={title} />
      <NewAudioInput callbackUploadResult={handleUploadResult} chat={chat} />
      <ChatBox chat={chat} />
    </Box>
  )
}

export default App
