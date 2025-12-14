import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const AlertMsg = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await axios.get("http://localhost:9090/api/alerts/all");
            setAlerts(res.data);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    };

    // DELETE ALERT
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this alert?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:9090/api/alerts/delete/${id}`);

            // remove from frontend immediately
            setAlerts(alerts.filter((a) => a.id !== id));
            alert("Alert deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete alert.");
        }
    };

    return (
        <div>
            <Navbar />

            {/* 🔴 Emergency Scrolling Marquee Added Here */}
            <marquee 
                direction="left"
                scrollAmount="8"
                style={{
                    background: "darkred",
                    color: "white",
                    padding: "10px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    display: "block",
                    width: "100%",
                    marginTop: "5px"
                }}
            >
                Primary All-India Emergency Numbers —  
                All-in-one Emergency Services: 112 | 
                Police: 100 / 112 | 
                Fire & Rescue: 101 | 
                Ambulance: 102 / 108 | 
                Women Helpline: 1091 / 181 | 
                Child Helpline: 1098 | 
                Senior Citizen Helpline: 14567 | 
                Disaster Management: 1078 / 1070 | 
                Railway Enquiry: 139 | 
                Tourist Helpline: 1363 / 1800-11-1363
            </marquee>

            {/* PAGE TITLE */}
            <h2 style={{ textAlign: "center", marginTop: 20 }}>All Alerts</h2>

            <div style={{ maxWidth: 700, margin: "20px auto" }}>
                {alerts.map(alert => (
                    <div
                        key={alert.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 10,
                            padding: 15,
                            marginBottom: 15,
                            background: "#f9f9f9"
                        }}
                    >
                        <h3>{alert.title}</h3>
                        <p><strong>Category:</strong> {alert.category}</p>
                        <p><strong>Location:</strong> {alert.location}</p>
                        <p>{alert.description}</p>

                        <p style={{ fontSize: 12, marginTop: 10, color: "gray" }}>
                            {alert.timestamp.replace("T", " | Time: ")}
                        </p>

                        {/* DELETE BUTTON */}
                        <button
                            onClick={() => handleDelete(alert.id)}
                            style={{
                                marginTop: 10,
                                background: "red",
                                color: "white",
                                border: "none",
                                padding: "7px 12px",
                                borderRadius: 6,
                                cursor: "pointer"
                            }}
                        >
                            Delete
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertMsg;
