import React from 'react';

function TestVideo() {
  return (
    <div>
      <h1>Hello, this is a test page.</h1>
      <video width="640" height="360" controls autoPlay muted>
        <source src="/puppy.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default TestVideo;
