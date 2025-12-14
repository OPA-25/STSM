// src/components/MapView.js
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvent } from "react-leaflet";
import L from "leaflet";
import Navbar from "./Navbar";
// import "./Home.css";
import "./MapView.css";

/*
  Full MapView component (React + react-leaflet)
  - Restricts map to India bounds
  - Restricts geocoding to India
  - Keeps weather (OpenWeather), photos (Unsplash), safety & nearby from backe nd
  - Replace OPENWEATHER_KEY and UNSPLASH_KEY with your keys
*/

const OPENWEATHER_KEY = "d6a8b725615056ffb78df1d99853b05e"; // replace with yours
const UNSPLASH_KEY = "AqrTCvrp-LaXURfx-wmY3z7d-HCTlVcR8gINzofa-X4"; // optional, replace or set to ""
const NEWS_API_KEY = "d5ffd6adbbce45cda387ce674c18b0e5"; // add your NewsAPI.org key here

const INDIA_BOUNDS = [
  [6.5546079, 68.1113787],   // south-west (lat, lon)
  [37.097, 97.39535869999999] // north-east (lat, lon)
];

function MapView() {
  // UI / Map states
  const [query, setQuery] = useState("");
  const [center, setCenter] = useState({ lat: 20.5937, lon: 78.9629 }); // India center default
  const [zoom, setZoom] = useState(5.5);
  const [radiusKm, setRadiusKm] = useState(10);

  // Data states
  const [searchResults, setSearchResults] = useState([]); // multiple geocode results
  const [selectedPlace, setSelectedPlace] = useState(null); // the place currently "active"
  const [nearby, setNearby] = useState([]);
  const [safety, setSafety] = useState(null);
  const [userZone, setUserZone] = useState(null);
  const [weather, setWeather] = useState({ user: null, destination: null });
  const [userLoc, setUserLoc] = useState(null);
  const [placeImage, setPlaceImage] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]); // news articles state

  const mapRef = useRef(null);

  // Leaflet icon (default blue marker)
  const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Utility functions
  function deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }
  function distanceKm(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Safe fetch wrapper returning JSON or null
  async function safeFetchJson(url, opts) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error("safeFetchJson error:", err, url);
      return null;
    }
  }

  // Fetch news for a place using NewsAPI.org
  async function fetchNewsForPlace(placeName) {
    if (!NEWS_API_KEY || !placeName) {
      setNews([]);
      console.warn("News API key or place name missing.");
      return;
    }
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(placeName)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
    try {
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        console.error("News API responded with error:", json);
        setNews([]);
        return;
      }

      if (json.articles && json.articles.length > 0) {
        setNews(json.articles);
        console.log(`Fetched ${json.articles.length} news articles for ${placeName}`);
      } else {
        setNews([]);
        console.info(`No news articles found for ${placeName}`);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setNews([]);
    }
  }


  // On load: attempt to get user location; fetch user weather and user zone
  useEffect(() => {
    let mounted = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (!mounted) return;
          const { latitude, longitude } = pos.coords;
          setUserLoc({ lat: latitude, lon: longitude });
          if (OPENWEATHER_KEY && OPENWEATHER_KEY !== "YOUR_OPENWEATHER_KEY") {
            fetchWeather(latitude, longitude, true);
          }
          const userZoneJson = await safeFetchJson(`http://localhost:9090/api/map/safety?lat=${latitude}&lon=${longitude}&radiusKm=3`);
          if (userZoneJson) setUserZone(userZoneJson);
        },
        (err) => {
          console.warn("Geolocation not available or denied:", err?.message);
        }
      );
    }
    return () => (mounted = false);
  }, []);

  // fetch weather for lat/lon (isUser toggles which slot)
  async function fetchWeather(lat, lon, isUser = false) {
    if (!OPENWEATHER_KEY || OPENWEATHER_KEY === "YOUR_OPENWEATHER_KEY") return;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric`;
    const json = await safeFetchJson(url);
    if (!json) return;
    setWeather(prev => ({ ...prev, [isUser ? "user" : "destination"]: json }));
  }

  // fetch optional place image from Unsplash
  async function fetchPlaceImage(place) {
    if (!UNSPLASH_KEY || UNSPLASH_KEY === "YOUR_UNSPLASH_KEY") {
      setPlaceImage(null);
      return;
    }
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(place)}&client_id=${UNSPLASH_KEY}&orientation=landscape&per_page=1`;
    const json = await safeFetchJson(url);
    if (json && Array.isArray(json.results) && json.results.length > 0) {
      setPlaceImage(json.results[0].urls.regular);
    } else {
      setPlaceImage(null);
    }
  }

  // Fetch full details (safety, nearby, weather, image) for a place (lat, lon, displayName)
  async function fetchDetailsForPlace(latNum, lonNum, displayNameForPlace) {
    setLoading(true);
    setSafety(null);
    setNearby([]);
    setPlaceImage(null);
    setWeather(prev => ({ ...prev, destination: null }));
    setDisplayName(displayNameForPlace || "");
    setNews([]); // clear news before loading new

    try {
      const safetyPromise = safeFetchJson(`http://localhost:9090/api/map/safety?lat=${latNum}&lon=${lonNum}&radiusKm=${radiusKm}`);
      const nearbyPromise = safeFetchJson(`http://localhost:9090/api/destinations/near?lat=${latNum}&lon=${lonNum}&radiusKm=${radiusKm}`);
      const weatherPromise = (OPENWEATHER_KEY && OPENWEATHER_KEY !== "YOUR_OPENWEATHER_KEY")
        ? safeFetchJson(`https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}&appid=${OPENWEATHER_KEY}&units=metric`)
        : Promise.resolve(null);
      const imagePromise = (UNSPLASH_KEY && UNSPLASH_KEY !== "YOUR_UNSPLASH_KEY")
        ? safeFetchJson(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(displayNameForPlace || "")}&client_id=${UNSPLASH_KEY}&orientation=landscape&per_page=1`)
        : Promise.resolve(null);

      const [safetyJson, nearbyJson, weatherJson, imageJson] = await Promise.all([safetyPromise, nearbyPromise, weatherPromise, imagePromise]);

      if (safetyJson && typeof safetyJson.classification === "string") {
        setSafety(safetyJson);
      } else {
        setSafety({ classification: "SAFE", incidentCount: 0, severitySum: 0 });
      }

      if (Array.isArray(nearbyJson)) {
        const enrichedNearby = nearbyJson.map(d => {
          const dist = distanceKm(latNum, lonNum, d.latitude, d.longitude);
          return { ...d, distanceKm: dist };
        });
        setNearby(enrichedNearby);
      } else {
        setNearby([]);
      }

      if (weatherJson && weatherJson.main) {
        setWeather(prev => ({ ...prev, destination: weatherJson }));
      } else {
        if (OPENWEATHER_KEY && OPENWEATHER_KEY !== "YOUR_OPENWEATHER_KEY") {
          await fetchWeather(latNum, lonNum, false);
        }
      }

      if (imageJson && imageJson.results && imageJson.results.length > 0) {
        setPlaceImage(imageJson.results[0].urls.regular);
      } else {
        setPlaceImage(null);
      }

      // Fetch latest news for the place
      await fetchNewsForPlace(displayNameForPlace);
    } catch (err) {
      console.error("fetchDetailsForPlace error:", err);
    } finally {
      setLoading(false);
    }
  }

  // MAIN: geocode (India-only) + handle multiple results
  async function geocodeAndSearch(e) {
    if (e) e.preventDefault();
    if (!query || !query.trim()) return;

    setLoading(true);
    setSafety(null);
    setNearby([]);
    setPlaceImage(null);
    setWeather(prev => ({ ...prev, destination: null }));
    setDisplayName("");
    setSearchResults([]);
    setSelectedPlace(null);
    setNews([]); // clear news on new search

    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`;
      const geo = await safeFetchJson(nomUrl);

      if (!geo || geo.length === 0) {
        alert("Place not found in India. Try searching an Indian place (e.g., 'Ooty', 'Goa', 'Kedarnath').");
        setLoading(false);
        return;
      }

      const indiaResults = geo.filter(item => {
        const isIndia = (item?.address?.country_code === "in") || (item.display_name && item.display_name.toLowerCase().includes("india"));
        return isIndia;
      });

      if (!indiaResults || indiaResults.length === 0) {
        alert("No India result found for that query. Please refine your search for an Indian location.");
        setLoading(false);
        return;
      }

      setSearchResults(indiaResults);

      const found = indiaResults[0];
      const latNum = parseFloat(found.lat);
      const lonNum = parseFloat(found.lon);
      setCenter({ lat: latNum, lon: lonNum });
      setZoom(11);
      setDisplayName(found.display_name || query);
      setSelectedPlace({ lat: latNum, lon: lonNum, display_name: found.display_name || query, address: found.address || {} });

      if (mapRef.current && typeof mapRef.current.setView === "function") {
        try {
          mapRef.current.setView([latNum, lonNum], 11);
        } catch (err) { }
      }

      await fetchDetailsForPlace(latNum, lonNum, found.display_name || query);
    } catch (err) {
      console.error("geocodeAndSearch error:", err);
      alert("Search failed — check console for details.");
    } finally {
      setLoading(false);
    }
  }

  // Component to enforce bounds on map movement
  function MapBoundsEnforcer() {
    useMapEvent('moveend', () => {
      if (!mapRef.current) return;
      const map = mapRef.current;
      const bounds = L.latLngBounds(INDIA_BOUNDS);
      const current = map.getBounds();
      if (!bounds.contains(current)) {
        map.fitBounds(bounds, { animate: false });
      }
    });
    return null;
  }

  // Zone badge helper
  function ZoneBadge({ classification }) {
    const bg = classification === "DANGER" ? "#ffe9e9" : classification === "WARNING" ? "#fff7e6" : "#e9ffef";
    const color = classification === "DANGER" ? "#ef4444" : classification === "WARNING" ? "#f59e0b" : "#10b981";
    return (
      <span style={{ display: "inline-block", padding: "6px 10px", borderRadius: 20, background: bg, color, fontWeight: 700, fontSize: 13 }}>
        {classification || "UNKNOWN"}
      </span>
    );
  }

  // Helper when user clicks a search result to select place
  async function handleSelectResult(result) {
    const latNum = parseFloat(result.lat);
    const lonNum = parseFloat(result.lon);
    setCenter({ lat: latNum, lon: lonNum });
    setZoom(11);
    setSelectedPlace({ lat: latNum, lon: lonNum, display_name: result.display_name || "", address: result.address || {} });
    if (mapRef.current && typeof mapRef.current.setView === "function") {
      try {
        mapRef.current.setView([latNum, lonNum], 11);
      } catch (err) { }
    }
    await fetchDetailsForPlace(latNum, lonNum, result.display_name || "");
  }

  // JSX - entire UI
  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "18px auto", padding: "0 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <h2 style={{ color: "#004aad", margin: 0 }}>🌍 Map View — Safety, Weather & Photos (India only)</h2>
          <div style={{ marginLeft: "auto", color: "#666", fontSize: 14 }}>
            {displayName && <span style={{ marginRight: 8 }}>{displayName}</span>}
            {safety?.classification && <ZoneBadge classification={safety.classification} />}
          </div>
        </div>

        {/* Search bar & results list */}
        <form onSubmit={geocodeAndSearch} style={{ display: "flex", gap: 8, margin: "8px 0 6px 0", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search place inside India (e.g., Goa, Ooty, Kedarnath)"
            style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />
          <input
            type="number"
            min={1}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            title="Radius in km"
            style={{ width: 110, padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1" }}
          />
          <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, background: "#004aad", color: "#fff", border: "none" }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Multiple results list */}
        {searchResults && searchResults.length > 1 && (
          <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {searchResults.map((r, idx) => {
              const stateName = r?.address?.state || r?.address?.county || "";
              return (
                <div key={`${r.place_id || idx}-${r.lat}-${r.lon}`} style={{ background: "#fff", padding: "8px 10px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ fontWeight: 700 }}>{r.display_name.split(",")[0]}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{stateName}</div>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <button
                      onClick={(ev) => { ev.preventDefault(); handleSelectResult(r); }}
                      style={{ padding: "6px 10px", borderRadius: 8, background: "#004aad", color: "#fff", border: "none" }}
                    >
                      Show
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Image preview */}
        {placeImage ? (
          <div style={{ marginBottom: 12, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 22px rgba(2,6,23,0.08)", position: "relative" }}>
            <img src={placeImage} alt={displayName || query} style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", left: 16, bottom: 16, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.6)", background: "rgba(0,0,0,0.25)", padding: "8px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{displayName || query}</div>
              {safety?.classification && <div style={{ marginLeft: 8 }}><ZoneBadge classification={safety.classification} /></div>}
              {weather.destination?.main && <div style={{ marginLeft: 12, fontWeight: 600 }}>{Math.round(weather.destination.main.temp)}°C • {weather.destination.weather[0]?.main}</div>}
            </div>
          </div>
        ) : null}

        {/* Map */}
        <div style={{ height: 520, borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
          <MapContainer
            center={[center.lat, center.lon]}
            zoom={zoom}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
              try {
                mapInstance.setMaxBounds(L.latLngBounds(INDIA_BOUNDS));
              } catch (err) { }
            }}
            style={{ height: "100%", width: "100%" }}
            maxBounds={INDIA_BOUNDS}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            worldCopyJump={false}
            zoomSnap={0.1}
            minZoom={4.5}
            maxZoom={12}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
            <MapBoundsEnforcer />

            {/* safety circle */}
            {safety && selectedPlace && (
              <Circle
                center={[selectedPlace.lat, selectedPlace.lon]}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: safety.classification === "DANGER" ? "#ef4444" : safety.classification === "WARNING" ? "#f59e0b" : "#10b981",
                  fillColor: safety.classification === "DANGER" ? "rgba(239,68,68,0.15)" : safety.classification === "WARNING" ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                  weight: 2,
                }}
              />
            )}

            {/* marker at selected location */}
            {selectedPlace && (
              <Marker position={[selectedPlace.lat, selectedPlace.lon]} icon={defaultIcon}>
                <Popup>
                  <div style={{ minWidth: 220 }}>
                    <strong>{selectedPlace.display_name || query}</strong>
                    <div style={{ marginTop: 6 }}>
                      {safety && <div>Zone: <b>{safety.classification}</b></div>}
                      {weather.destination?.main && <div>Weather: {Math.round(weather.destination.main.temp)}°C — {weather.destination.weather[0]?.description}</div>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* markers for all geocode results */}
            {searchResults.map((r, idx) => {
              const lat = parseFloat(r.lat);
              const lon = parseFloat(r.lon);
              return (
                <Marker
                  key={`searchResult-${idx}-${lat}-${lon}`}
                  position={[lat, lon]}
                  icon={defaultIcon}
                  eventHandlers={{
                    click: async () => await handleSelectResult(r),
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      <strong>{r.display_name.split(",")[0]}</strong>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{r.address?.state || r.address?.county || ""}</div>
                      <div style={{ marginTop: 6 }}>
                        <button onClick={(ev) => { ev.stopPropagation(); handleSelectResult(r); }} style={{ padding: "6px 8px", borderRadius: 6, background: "#004aad", color: "#fff", border: "none" }}>
                          Show details
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* nearby destination markers */}
            {nearby.map((d) => (
              <Marker key={d.id} position={[d.latitude, d.longitude]} icon={defaultIcon}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong>{d.name}</strong>
                    <div style={{ fontSize: 13, color: "#4b5563" }}>{d.location}</div>
                    {d.category && <div style={{ fontSize: 12, color: "#6b7280" }}>{d.category}</div>}
                    {d.distanceKm != null && <div style={{ marginTop: 6, fontSize: 12 }}>{d.distanceKm.toFixed(2)} km away</div>}
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* user location */}
            {userLoc && (
              <>
                <Marker position={[userLoc.lat, userLoc.lon]} icon={defaultIcon}>
                  <Popup>
                    <div>
                      <strong>Your location</strong>
                      <div style={{ fontSize: 13 }}>Lat: {userLoc.lat.toFixed(4)}, Lon: {userLoc.lon.toFixed(4)}</div>
                      {userZone && <div>Zone: <b>{userZone.classification}</b></div>}
                      {weather.user?.main && <div>Weather: {Math.round(weather.user.main.temp)}°C — {weather.user.weather[0]?.description}</div>}
                    </div>
                  </Popup>
                </Marker>

                {userZone && (
                  <Circle
                    center={[userLoc.lat, userLoc.lon]}
                    radius={1000}
                    pathOptions={{
                      color: userZone.classification === "DANGER" ? "#ef4444" : userZone.classification === "WARNING" ? "#f59e0b" : "#10b981",
                      fillColor: userZone.classification === "DANGER" ? "rgba(239,68,68,0.12)" : userZone.classification === "WARNING" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.12)",
                      weight: 1,
                    }}
                  />
                )}
              </>
            )}
          </MapContainer>
        </div>

        {/* Bottom dashboard */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 18 }}>
          {/* Safety card */}
          <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 20px rgba(2,6,23,0.04)", borderLeft: `6px solid ${safety ? (safety.classification === "DANGER" ? "#ef4444" : safety.classification === "WARNING" ? "#f59e0b" : "#10b981") : "#9ca3af"}` }}>
            <h3 style={{ marginTop: 0 }}>🛡️ Destination Safety</h3>
            {safety ? (
              <>
                <p style={{ margin: 6 }}><b>Zone:</b> <span style={{ color: safety.classification === "DANGER" ? "#ef4444" : safety.classification === "WARNING" ? "#f59e0b" : "#10b981", fontWeight: 700 }}>{safety.classification}</span></p>
                <p style={{ margin: 6 }}><b>Incidents:</b> {safety.incidentCount ?? 0}</p>
                <p style={{ margin: 6 }}><b>Severity:</b> {safety.severitySum ?? 0}</p>
              </>
            ) : (
              <p style={{ color: "#6b7280" }}>Search a location to view safety details.</p>
            )}
          </div>

          {/* Weather card */}
          <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 20px rgba(2,6,23,0.04)", borderLeft: "6px solid #004aad" }}>
            <h3 style={{ marginTop: 0 }}>🌦️ Weather</h3>
            {weather.destination?.main ? (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{displayName || (selectedPlace && selectedPlace.display_name) || query}</div>
                <div style={{ marginTop: 6 }}>{Math.round(weather.destination.main.temp)}°C — {weather.destination.weather[0]?.description}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>Humidity: {weather.destination.main.humidity}% • Wind: {weather.destination.wind?.speed ?? "-"} m/s</div>
              </div>
            ) : (
              <div style={{ color: "#6b7280" }}>Search to view destination weather.</div>
            )}

            <hr style={{ border: "none", borderTop: "1px solid #eef2f7", margin: "10px 0" }} />

            {weather.user?.main ? (
              <div>
                <div style={{ fontWeight: 700 }}>Your Location</div>
                <div style={{ marginTop: 6 }}>{Math.round(weather.user.main.temp)}°C — {weather.user.weather[0]?.description}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>Humidity: {weather.user.main.humidity}% • Wind: {weather.user.wind?.speed ?? "-"} m/s</div>
              </div>
            ) : (
              <div style={{ color: "#6b7280" }}>Allow location to view your current weather.</div>
            )}
          </div>
        </div>

        {/* Latest News Section */}
        <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 20px rgba(2,6,23,0.04)", marginTop: 18 }}>
          <h3 style={{ marginTop: 0 }}>
            📰 Latest News: {displayName && <span style={{ color: "#0d47a1" }}>{displayName.split(",")[0]}</span>}
          </h3>
          {news.length > 0 ? (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {news.map((article, idx) => (
                <li key={idx} style={{ marginBottom: 12 }}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: "#1565c0" }}>
                    {article.title}
                  </a>
                  <div style={{ color: "#666", fontSize: 13 }}>
                    {article.source.name} — {new Date(article.publishedAt).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 14, marginTop: 2 }}>{article.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#888" }}>No recent news found about this destination.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default MapView;
