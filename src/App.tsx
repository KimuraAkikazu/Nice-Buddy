import './App.css';
import { ReactNode, useState } from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';
import { Message } from './config/Interfaces';
import NewAudioInput from './components/NewAudioInput';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [chat, setChat] = useState<Message[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleUploadResult = (speechScript: string, textPart: string) => {
    if (speechScript) setChat([...chat, { role: 'assistant', content: speechScript, contentType: 'speech' }]);
    if (textPart) {
      setModalContent(textPart);
      setOpenModal(true);
    }
  };

  type CodeProps = {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  };
  
  const components = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={duotoneLight}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <Box>
      <NewAudioInput callbackUploadResult={handleUploadResult} chat={chat} />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '80%',
          overflow: 'auto',
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            テキストでの説明
          </Typography>
          <ReactMarkdown components={components}>
            {modalContent}
          </ReactMarkdown>
          <Button onClick={() => setOpenModal(false)}>閉じる</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default App;