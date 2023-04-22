import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {
  return (
    <div className=" w-screen flex flex-row items-center flex-wrap justify-center min-h-screen bg-blue-400 overflow-x-hidden">
        <Sidebar />
        <Chat />
    </div>
  );
}

export default Home