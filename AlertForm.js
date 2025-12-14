import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const AlertForm = () => {
    const [form, setForm] = useState({
        type: "",
        message: "",
        location: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:9090/api/alerts/report", {
                title: form.type,        // mapped correctly
                description: form.message,
                category: form.type,
                location: form.location,
                approved: true,
            });

            alert("✅ Alert submitted successfully!");
            setForm({ type: "", message: "", location: "" });

        } catch (error) {
            console.error("Error submitting alert:", error);
            alert("❌ Failed to submit alert. Check backend connection.");
        }
    };

    return (
        <div>   <><Navbar />
        </>     <div style={styles.container}>
                <h2 style={styles.title}>Submit New Alert</h2>

                <form style={styles.form} onSubmit={handleSubmit}>

                    <label>Alert Type:</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                        style={styles.select}
                    >
                        <option value="">Select Type</option>
                        <option value="Weather">Weather</option>
                        <option value="Flood">Flood</option>
                        <option value="Earthquake">Earthquake</option>
                        <option value="Road">Road</option>
                        <option value="Community">Community</option>
                    </select>

                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        placeholder="Enter location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <label>Message:</label>
                    <textarea
                        name="message"
                        placeholder="Enter alert message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        style={styles.textarea}
                    />

                    <button type="submit" style={styles.button}>
                        Submit Alert
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        margin: "30px auto",
        padding: "20px",
        maxWidth: "500px",
        borderRadius: "12px",
        background: "#f8f9fa",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    select: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    input: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    textarea: {
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        minHeight: "80px",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
};

export default AlertForm;
