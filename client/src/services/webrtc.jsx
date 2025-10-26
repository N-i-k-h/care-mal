import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const JoinScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('https://cdn.pixabay.com/photo/2018/07/16/17/50/cow-3542489_640.jpg');
  background-size: cover;
  padding: 20px;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2D8CFF;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1A73E8;
  }
`;

const VideoRoom = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  z-index: 1000;
`;

// Home Component - For joining calls
export const WebRTCHome = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <Container>
      <JoinScreen>
        <FormCard>
          <Title>Veterinary Video Consultation</Title>
          <Description>Connect with certified pet doctors in real-time</Description>
          
          <InputField
            type="text"
            placeholder="Enter room code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          />
          
          <ActionButton onClick={handleJoin}>
            Join Consultation
          </ActionButton>
          
          <Description style={{ marginTop: '20px', fontSize: '14px' }}>
            Tip: Share the room code with your veterinarian to connect
          </Description>
        </FormCard>
      </JoinScreen>
    </Container>
  );
};

// Room Component - For active calls
export const WebRTCRoom = () => {
  const { roomId } = useParams();
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCall = async () => {
      try {
        const appID = 269557652;
        const serverSecret = "fa629121e0fcd4c7a65c5ba52bde2b20";
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          Date.now().toString(),
          "Caremal User"
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: videoRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          onLeaveRoom: () => {
            navigate('/video-call');
          },
        });
      } catch (error) {
        console.error("Video call failed:", error);
        navigate('/video-call');
      }
    };

    if (roomId) {
      initializeCall();
    }
  }, [roomId, navigate]);

  return (
    <VideoRoom>
      <div ref={videoRef} style={{ width: '100%', height: '100%' }} />
    </VideoRoom>
  );
};

// Default export (can be used if preferred)
const WebRTC = () => {
  return <WebRTCHome />;
};

export default WebRTC;