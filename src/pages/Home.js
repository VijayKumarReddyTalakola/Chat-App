import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  return (
    <div className="min-w-screen flex flex-row items-center flex-wrap justify-center min-h-screen bg-blue-400 overflow-x-hidden">
      {overlayVisible && (
        <div className="fixed inset-0 bg-black opacity-50 pointer-events-auto z-40"></div>
      )}
      <Sidebar />
      <Chat setOverlayVisible={setOverlayVisible} />
    </div>
  );
};

export default Home;
