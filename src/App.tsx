import './App.css'
import { Box } from '@mui/material'
import ChatBox from './components/ChatBox';
import Description from './components/Description'
import Title from './components/Title'
import UploadDataButton from './components/UploadDataButton';

function App() {
  // タイトルの内容
  const title = "教えてずんだもん";

  // 説明文の内容
  const description = [
    `ずんだもんが会話形式で質問に答えるアプリです。`,
    ``,
  ];

  return (
    <Box>
      <Title title={title}/>
      <Description description={description}/>
      <UploadDataButton />
      <ChatBox chat={[
        "ずんだもん: こんにちは！",
        "ずんだもん: 何か質問ある？",
      ]} />
    </Box>
  )
}

export default App
