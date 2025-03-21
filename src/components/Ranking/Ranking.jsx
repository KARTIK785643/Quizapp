// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import "./ranking.css";
// import Navbar from "../firstpage/Navbar";

// // ✅ Connect to backend using Socket.io
// const socket = io("http://localhost:5000", {
//     transports: ["websocket"],
//     withCredentials: true
// });

// const RankingPage = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLeaderboard = async () => {
//             try {
//                 const response = await fetch("http://localhost:5000/api/leaderboard");
//                 const data = await response.json();
//                 console.log("Leaderboard Fetched:", data);  // ✅ Debugging log
//                 setUsers(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLeaderboard();

//         // ✅ Listen for live updates from backend
//         socket.on("leaderboardUpdated", (updatedLeaderboard) => {
//             console.log("🔄 Real-time leaderboard update:", updatedLeaderboard);
//             setUsers(updatedLeaderboard);
//         });

//         return () => {
//             socket.off("leaderboardUpdated");
//         };
//     }, []);
//     return (
//         <>
//             <Navbar />
//             <div className="ranking-container">
//                 <h2>Live Quiz Leaderboard</h2>

//                 {loading && <p>Loading rankings...</p>}
//                 {error && <p className="error-message">{error}</p>}

//                 {!loading && !error && users.length > 0 ? (
//                     <table className="ranking-table">
//                         <thead>
//                             <tr>
//                                 <th>Rank</th>
//                                 <th>Username</th>
//                                 <th>CORRECT </th>

//                             </tr>
//                         </thead>
//                         <tbody>
//     {users.map((user, index) => (
//         <tr key={index} className={index === 0 ? "top-1" : index === 1 ? "top-2" : index === 2 ? "top-3" : ""}>
//             <td>{index + 1}</td>  {/* ✅ Rank assigned based on correct answers */}
//             <td>{user.username}</td>
//             <td>{user.correctAnswers}</td> 

//              {/* ✅ Display correct answers */}

//         </tr>
//     ))}
// </tbody>


//                     </table>
//                 ) : (
//                     !loading && <p>No completed quizzes available yet.</p>
//                 )}
//             </div>
//         </>
//     );
// };

// export default RankingPage;


import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./ranking.css";




const socket = io(`http://localhost:5000`, {
    transports: ["websocket"],
    withCredentials: true
});

const RankingPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/leaderboard`);
                const data = await response.json();
                console.log("Leaderboard Fetched:", data);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // ✅ Listen for real-time updates
        socket.on("leaderboardUpdated", (updatedLeaderboard) => {
            console.log("🔄 Real-time leaderboard update:", updatedLeaderboard);
            setUsers(updatedLeaderboard);
        });

        return () => {
            socket.off("leaderboardUpdated");
        };
    }, []);

    
    return (
        <>
            <div className="ranking-container">
                <h2>Live Quiz Leaderboard</h2>

                {loading && <p>Loading rankings...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && users.length > 0 ? (
                    <table className="ranking-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Correct Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className={index === 0 ? "top-1" : index === 1 ? "top-2" : index === 2 ? "top-3" : ""}>
                                    <td>{index + 1}</td>  
                                    <td>{user.username}</td>
                                    <td>{user.correctAnswer}</td> 
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p>No completed quizzes available yet.</p>
                )}
            </div>
        </>
    );
};

export default RankingPage;
