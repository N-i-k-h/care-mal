import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from '../authentication/userlogin';
import UserRegister from '../authentication/userregister';
import DoctorRegister from '../authentication/doctorregister';
import DoctorLogin from '../authentication/doctorlogin';
import UserHome from '../pages/userhome';
import DoctorHome from '../pages/doctorhome';
import OnlineChat from '../services/onlinechat';
import AIVoice from '../services/aivoice';
import { WebRTCHome, WebRTCRoom } from '../services/webrtc';

function UserRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/register-doctor" element={<DoctorRegister />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
        <Route path="/doctorhome" element={<DoctorHome />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/online-chat" element={<OnlineChat />} />
        <Route path="/ai-voice" element={<AIVoice />} />
        <Route path="/video-call" element={<WebRTCHome />} />
        <Route path="/room/:roomId" element={<WebRTCRoom />} />
        <Route path="*" element={<h2 className="text-center mt-10 text-red-600 text-xl">404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default UserRouter;