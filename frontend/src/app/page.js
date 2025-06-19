"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");
  const [agentReply, setAgentReply] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/subscribe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Subscribed!');
    } else {
      alert('Error: ' + JSON.stringify(data));
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8">
      <main className="flex flex-col gap-8 items-center w-full max-w-lg">
        <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
          Hello, I'm Aerlos
        </h1>
        <p className="text-xl text-gray-300 mb-6 text-center max-w-md">
          Find out more here
        </p>
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700"
          >
            <label htmlFor="email" className="text-gray-200 font-semibold">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="border border-gray-700 bg-black text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 font-bold hover:bg-blue-700 transition shadow-lg"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="bg-green-900/80 text-green-300 rounded-xl p-6 w-full text-center shadow-lg border border-green-700">
            Thank you for signing up! We'll be in touch soon.
          </div>
        )}

        {/* Agent form below subscription form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setAgentLoading(true);
            setAgentReply("");
            try {
              const res = await fetch("http://localhost:8000/api/openai-agent/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: agentMessage }),
              });
              const data = await res.json();
              if (res.ok) {
                setAgentReply(data.reply);
              } else {
                setAgentReply("Error: " + JSON.stringify(data));
              }
            } catch (err) {
              setAgentReply("Error: " + err.message);
            }
            setAgentLoading(false);
          }}
          className="flex flex-col gap-4 w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700 mt-8"
        >
          <label htmlFor="agent-message" className="text-gray-200 font-semibold">
            Ask the Agent
          </label>
          <input
            id="agent-message"
            type="text"
            required
            value={agentMessage}
            onChange={(e) => setAgentMessage(e.target.value)}
            placeholder="Type your question..."
            className="border border-gray-700 bg-black text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-bold hover:bg-blue-700 transition shadow-lg"
            disabled={agentLoading}
          >
            {agentLoading ? "Thinking..." : "Ask Agent"}
          </button>
        </form>
        {agentReply && (
          <div className="bg-gray-900/80 text-blue-300 rounded-xl p-6 w-full text-center shadow-lg border border-blue-700 mt-4">
            <strong>Agent:</strong> {agentReply}
          </div>
        )}
      </main>
      <footer className="mt-12 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">Aerlos</span>. All rights
        reserved.
      </footer>
    </div>
  );
}
