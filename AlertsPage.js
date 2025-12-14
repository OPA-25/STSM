import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./EmergencyMarquee.css"; // Create this CSS file

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const emergencyNumbers = [
        { department: "All-in-one Emergency Number (Police, Fire, Ambulance)", number: "112" },
        { department: "Police", number: "100" },
        { department: "Fire & Rescue Services", number: "101" },
        { department: "Ambulance (General)", number: "102" },
        { department: "Medical Helpline & Health Counseling (State Level)", number: "104" },
        { department: "Disaster Management (National)", number: "1078, 1077" },
        { department: "Women Helpline", number: "1091, 181" },
        { department: "Child Helpline", number: "1098" },
        { department: "LPG Leak Helpline", number: "1906" },
        { department: "Indian Railway Security/Accident Helpline", number: "1322, 1072" },
    ];

    useEffect(() => {
        axios.get("http://localhost:9090/api/alerts/approved")
            .then(response => {
                setAlerts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to load alerts.");
                setLoading(false);
                console.error("Error loading alerts:", error);
            });
    }, []);

    return (
        <div>
            <Navbar />

            {/* Emergency Numbers Marquee */}
            <div className="emergency-marquee">
                <div className="marquee-content">
                    {emergencyNumbers.map((item, index) => (
                        <span key={index} className="marquee-item">
                            {item.department}: {item.number} &nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                    ))}
                </div>
            </div>

            <div style={styles.container}>
                <h2 style={styles.title}>Recent Alerts</h2>
                {loading && <p>Loading alerts...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <ul style={styles.list}>
                    {alerts.map(alert => (
                        <li key={alert.id} style={styles.listItem}>
                            <strong>{alert.title} ({alert.category})</strong>
                            <br />
                            Location: {alert.location}
                            <br />
                            Message: {alert.description}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const styles = {
    container: {
        margin: "30px auto",
        padding: "20px",
        maxWidth: "600px",
        borderRadius: "12px",
        background: "#f8f9fa",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    list: {
        listStyle: "none",
        padding: 0,
    },
    listItem: {
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "10px",
    }
};

export default AlertsPage;
