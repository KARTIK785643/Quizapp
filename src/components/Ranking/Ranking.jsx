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
                console.log("Fetched Leaderboard Data:", data); // ✅ Debugging log
                setUsers(data);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setError("Failed to fetch leaderboard.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchLeaderboard();
    
        // ✅ Listen for real-time leaderboard updates
        socket.on("leaderboardUpdated", (updatedLeaderboard) => {
            console.log("🔄 Real-time leaderboard update:", updatedLeaderboard);
            setUsers(updatedLeaderboard);
        });
    
        return () => {
            socket.off("leaderboardUpdated");
        };
    }, []);
    
    return (
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
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className={user.rank === 1 ? "top-1" : user.rank === 2 ? "top-2" : user.rank === 3 ? "top-3" : ""}>
                                <td>{user.rank}</td>  
                                <td>{user.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No completed quizzes available yet.</p>
            )}
        </div>
    );
};

export default RankingPage;
