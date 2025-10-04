// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://192.168.1.9:5000");

// export default function ChatBox({ chatId, sender }) {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState("");

//     useEffect(() => {
//         socket.emit("join", { chatId });

//         socket.on("new_message", (msg) => {
//             if (msg.chatId === chatId) setMessages((prev) => [...prev, msg]);
//         });

//         return () => socket.off("new_message");
//     }, [chatId]);

//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (!input.trim()) return;

//         const msg = {
//             id: Date.now(),
//             chatId,
//             sender, // "customer" or "admin"
//             message: input,
//         };

//         socket.emit("send_message", msg);
//         setInput("");
//     };


//     return (
//         <div className="flex flex-col h-[540px] w-full mx-auto rounded-2xl shadow-xl overflow-hidden">
//             {/* Messages */}
//             <div className="flex-1 p-4 overflow-y-auto">
//                 {messages.map((m) => (
//                     <div
//                         key={m.id}
//                         className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
//                     >
//                         <div
//                             className={`rounded-2xl mt-1 px-4 py-2 max-w-[75%] break-words shadow-md ${m.sender === "admin"
//                                 ? "bg-gray-200 text-gray-800"
//                                 : "bg-blue-500 text-white"
//                                 }`}
//                         >
//                             <p className="font-semibold text-[16px]">{m.message}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Input */}
//             <div className="flex items-center p-3 bg-white border-t">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400"
//                 />
//                 <button
//                     onClick={sendMessage}
//                     className="ml-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-[#000060]"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }
