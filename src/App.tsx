import './App.css'
import { useState } from 'react';
import { Box } from '@mui/material'
import { Message } from './config/Interfaces';
// import ChatBox from './components/ChatBox';
// import Title from './components/Title'
import NewAudioInput from './components/NewAudioInput';

function App() {
  // タイトルの内容
  // const title = "NICE BUDDY";

  // chatをstateとして管理
  const [chat, setChat] = useState<Message[]>([
  ]);

  const handleUploadResult = (speechScript: string, textPart: string) => {
    // chatAPIの回答をchatに追加
    if (speechScript) setChat([...chat, { role: 'assistant', content: speechScript, contentType: 'speech' }]);
    if (textPart) {
      setChat([...chat, { role: 'assistant', content: textPart, contentType: 'text' }]);
      // 新しいウインドウを開いてtext_partを表示
      const newWindow = window.open('', '_blank', 'width=400,height=400');
      if (newWindow) {
        newWindow.document.write(`<h1>Response Text Part</h1><p>${textPart}</p>`);
      }
  }
};

return (
  <Box>
    {/* <Title title={title} /> */}
    <NewAudioInput callbackUploadResult={handleUploadResult} chat={chat} />
    {/* <ChatBox chat={chat} /> */}
  </Box>
)
}

export default App
