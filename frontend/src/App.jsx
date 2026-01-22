import { useState } from 'react'
import axios from 'axios';
// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import { LuSendHorizontal } from "react-icons/lu";
import { useEffect } from 'react';
import { FaStopCircle } from "react-icons/fa";

function App() {
  const [dt, setDt] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQuestion("");

    if (question.trim() === "") {
      setLoading(false);
      return;
    }

    setLoading(true)
    console.log(question)

    try {
      const respons = await axios.get(`https://fullstack-codewave.onrender.com/ask?question=${question}`);
      console.log(respons.data);
      setDt(prev => [...prev, respons.data]);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (question !== "") {
      setTyping(true);
    } else {
      setTyping(false);
    }
  }, [question]);

  return (
    <div className="flex flex-col items-start min-w-full min-h-screen p-10">

      <div className='p-2 min-h-[75vh] max-h-[75vh] w-full overflow-auto'>
        {
          dt?.map((qa, idx) => (
            <div key={idx} className="my-6 rounded-lg p-4 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-700">{qa?.question}</h2>
              <p className="text-gray-600 mt-2">{qa?.answer}</p>
            </div>
          ))
        }

        {loading && <div className="mt-6 font-bold rounded-lg p-4 w-full max-w-md flex items-center space-x-1">
          <p className="text-gray-600 mt-1.5">thinking</p>
          <span className='animate-pulse [animation-duration:1s] font-bold text-2xl'>.</span>
          <span className='animate-pulse [animation-duration:1.7s] font-bold text-2xl'>.</span>
          <span className='animate-pulse [animation-duration:2.5s] font-bold text-2xl'>.</span>
        </div>}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 flex fixed bottom-10 left-4 right-4 shadow-md rounded-xl p-2 focus-within:border-indigo-500 focus-within:[box-shadow:0_0_3px_indigo] focus-within:shadow-indigo-100"
      >
        <input
          type="text"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent transition-all mr-2"
        />

        <button
          type="submit"
          className={`bg-indigo-400 ${typing && "bg-indigo-500"} text-white font-semibold px-4 text-lg rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all`}
        >
          {loading ? <FaStopCircle />
            : <LuSendHorizontal />}
        </button>
      </form>

      {/* <Routes>
        <Route path="/logged" element={<Home />} />
      </Routes> */}
    </div>
  );
}

export default App;
