import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Post from './components/Post/Post';
import User from './components/User/User';
import Auth from './components/Auth/Auth';

function App() {
  return (
    <div className="App">


      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/users/:userId" element={<User />} />
          <Route path='/auth' element={localStorage.getItem("currentUser") != null ? <Navigate to='/' /> : <Auth />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
