import './App.css'
import ChatBox from './components/ChatBox';
import Discription from './components/Discription'
import Title from './components/Title'
import UploadDataButton from './components/UploadDataButton';

function App() {
  // タイトルの内容
  const title = "教えてずんだもん";

  // 説明文の内容
  const discription = [
    `ずんだもんが会話形式で質問に答えるアプリです。`,
    ``,
  ];

  return (
    <div>
      <Title title={title}/>
      <Discription discription={discription}/>
      <UploadDataButton />
      <ChatBox chat={[
        "ずんだもん: こんにちは！",
        "ずんだもん: 何か質問ある？",
      ]} />
    </div>
  )
}

export default App
