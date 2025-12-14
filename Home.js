import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "./Navbar";
import MapView from "./MapView";
import { Link } from 'react-router-dom';


export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9090/api/destinations")
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-root">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-badge">Trusted Tourism Platform</span>

          <h1 className="hero-title">
            Discover <span>Beautiful</span><br />
            Tourist Destinations
          </h1>

          <p className="hero-subtitle">
            Plan smarter journeys with verified destinations, live maps,
            and a seamless travel experience.
          </p>

          <div className="hero-actions">
            {/* <button className="btn-primary">Explore Destinations</button>
            <button className="btn-outline">View Live Map</button> */}
            <Link to="/explore" className="btn-primary">Explore Destinations</Link>
            <Link to="/mapview" className="btn-outline">View Live Map</Link>

          </div>
        </div>

        {/* Floating Cards */}
        {/* Floating Tourism Tags */}
        <div className="hero-float float-1">🏔️ Mountains</div>
        <div className="hero-float float-2">🏖️ Beaches</div>
        <div className="hero-float float-3">🛕 Heritage</div>

        <div className="hero-float float-4">🌊 Waterfalls</div>
        <div className="hero-float float-5">🧗 Adventure</div>
        <div className="hero-float float-6">🧘 Spiritual</div>
        <div className="hero-float float-7">🦁 Wildlife</div>
        <div className="hero-float float-8">🌄 Hill Stations</div>
        <div className="hero-float float-9">🏜️ Desert</div>
        <div className="hero-float float-10">🏞️ Nature Trails</div>

      </section>

      {/* ================= DESTINATION STRIP ================= */}
      <section className="destination-strip">
        <h2>Popular Places</h2>

        <div className="destination-row">
          {loading ? (
            <div className="loader">Loading destinations...</div>
          ) : (
            destinations.slice(0, 6).map(dest => {
              const img = dest.imageUrl?.startsWith("http")
                ? dest.imageUrl
                : `http://localhost:9090${dest.imageUrl}`;

              return (
                <div className="destination-card" key={dest.id}>
                  <div
                    className="dest-image"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  <div className="dest-info">
                    <h3>{dest.name}</h3>
                    <span>{dest.location}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ================= MAP SECTION ================= */}
      <section className="map-section">
        <div className="map-text">
          <h2>Explore on Interactive Map</h2>
          <p>
            Navigate destinations visually, check nearby attractions,
            and plan routes efficiently.
          </p>
        </div>

        <div className="map-box">
          <MapView destinations={destinations} />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <p>© 2025 Smart Tourism Platform</p>
      </footer>
    </div>
  );
}
