import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AlertPage.css';

const severityColor = {
  High: '#ff4d4f',   // Red
  Medium: '#faad14', // Orange
  Low: '#1890ff'     // Blue
};

export default function AlertPage() {
  const [alerts, setAlerts] = useState([]);

  // Fetch alerts on component mount and every 30s
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:9090/api/alerts'); // Spring Boot backend URL
      setAlerts(res.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  return (
    <div className="alert-container">
      <h2>Tourist Alerts</h2>
      {alerts.length === 0 && <p>No active alerts.</p>}
      {alerts.map(alert => (
        <div
          className="alert-card"
          style={{ borderLeft: `5px solid ${severityColor[alert.severity]}` }}
          key={alert.alertId}
        >
          <h3>{alert.type} ({alert.severity})</h3>
          <p>{alert.description}</p>
          <p><strong>Location:</strong> {alert.location}</p>
          <p><small>{new Date(alert.timestamp).toLocaleString()}</small></p>
        </div>
      ))}
    </div>
  );
}
