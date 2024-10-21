import './App.css'
import { useState } from 'react';
import { Box } from '@mui/material'
import ChatBox from './components/ChatBox';
import Description from './components/Description'
import Title from './components/Title'
// import UploadDataButton from './components/UploadDataButton';
// import AudioInput from './components/AudioInput';
import NewAudioInput from './components/NewAudioInput';

function App() {
  // タイトルの内容
  const title = "教えてずんだもん";

  // 説明文の内容
  const description = [
    `ずんだもんが会話形式で質問に答えるアプリです。`,
    ``,
  ];

  // chatをstateとして管理
  const [chat, setChat] = useState<string[][]>([
    ['assistant', 'こんにちは！なにかお手伝いできることはありますか？'],
    ['user', 'こんにちは！あなたはカレー作りの名人です。それを踏まえてこれからの回答に答えてください。'],
  ]);

  const handleUploadResult = (speechScript: string, answer: string) => {
    // chatAPIの回答をchatに追加
    if(speechScript) setChat((prevChat) => [...prevChat, ['assistant', speechScript]]);
    if(answer) setChat((prevChat) => [...prevChat, ['assistant', answer]]);
    // Base64エンコードされたMP3を再生する処理
    // playAudioFromBase64(speechBase64);
  };

  // Base64エンコードされたMP3を再生する関数
  // const playAudioFromBase64 = (base64Audio: string) => {
  //   // Base64文字列からバイナリデータに変換
  //   const binaryString = window.atob(base64Audio);
  //   const len = binaryString.length;
  //   const bytes = new Uint8Array(len);

  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }

  //   const blob = new Blob([bytes], { type: 'audio/mp3' });
  //   const url = URL.createObjectURL(blob);

  //   // Audioオブジェクトを使って音声を再生
  //   const audio = new Audio(url);
  //   audio.play().catch((error) => console.error('音声の再生に失敗しました:', error));

  //   // 音声の再生が終了したら次の音声入力を開始
  //   audio.onended = () => {
  //     console.log('音声の再生が終了しました');
  //     document.querySelector('button')?.click(); // 次の音声入力を開始
  //   };
  // };

  return (
    <Box>
      <Title title={title} />
      <Description description={description} />
      {/* <UploadDataButton callbackUploadResult={handleUploadResult} chat={chat} /> */}
      <NewAudioInput callbackUploadResult={handleUploadResult} chat={chat} />
      <ChatBox chat={chat} />
    </Box>
  )
}

export default App
