
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ChatPage from './pages/Chat';
import SignIn from './pages/Sign-in';
import SignUp from './pages/Sign-up';
import Home from './pages/Home';
import MessageInput from './pages/test';

function App() {


  return (
    <>
     <Router>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/test" element={<MessageInput/>}/>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
