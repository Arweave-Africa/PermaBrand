import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/auth/Login';
import Profile from './pages/Profile';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import SignUp from './pages/auth/SignUp';

function App() {
  return (
    <div className='min-h-screen w-screen'>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
