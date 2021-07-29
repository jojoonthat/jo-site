import Background from "./components/Background";
import React, { useState } from 'react';

import Content from './components/Content';


function App() {
  const [showContent, setShowContent] = useState(false)
  const handleWheel = e => {
    const down = e.deltaY >= 0 ? true : false;
    if (down && showContent === false) { setShowContent(true) }
  }
  document.addEventListener('wheel', handleWheel);
  return (
    <div className="App">
      {showContent && <Content />}
      <Background />
    </div>
  );

}

export default App;
