import './App.css'
import { useState } from 'react';
import { Box } from '@mui/material'
import ChatBox from './components/ChatBox';
import Description from './components/Description'
import Title from './components/Title'
import UploadDataButton from './components/UploadDataButton';
// import AudioInput from './components/AudioInput';

function App() {
  // タイトルの内容
  const title = "教えてずんだもん";

  // 説明文の内容
  const description = [
    `ずんだもんが会話形式で質問に答えるアプリです。`,
    ``,
  ];

  // chatをstateとして管理
  const [chat, setChat] = useState<string[]>([
    "ずんだもん: こんにちは！",
  ]);

  const handleUploadResult = (message: string) => {
    setChat((prevChat) => [...prevChat, `ずんだもん: ${message}`]);
  };

  return (
    <Box>
      <Title title={title}/>
      <Description description={description}/>
      <UploadDataButton callbackUploadResult={handleUploadResult}/>
      <ChatBox chat={chat}/>
    </Box>
  )
}

export default App
