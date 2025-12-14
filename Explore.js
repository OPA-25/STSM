
// const OPENWEATHER_KEY = "d6a8b725615056ffb78df1d99853b05e"; // replace with yours
// const UNSPLASH_KEY = "AqrTCvrp-LaXURfx-wmY3z7d-HCTlVcR8gINzofa-X4"; // optional, replace or set to ""
//const NEWSAPI_KEY = "d5ffd6adbbce45cda387ce674c18b0e5"; // replace with your NewsAPI key




import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "./Navbar";

function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchList(q = "", cat = "") {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (cat) params.set("category", cat);

      const url = `http://localhost:9090/api/destinations${
        params.toString() ? "?" + params.toString() : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();

      setDestinations(data);

      const uniqueCats = Array.from(
        new Set(data.map((d) => d.category).filter(Boolean))
      );
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  function onSearchSubmit(e) {
    e.preventDefault();
    fetchList(search, category);
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    fetchList();
  }

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <h2 style={{ color: "#004aad" }}>Explore Destinations</h2>
        </div>

        <form
          onSubmit={onSearchSubmit}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap"
          }}
        >
          <input
            type="text"
            placeholder="Search by name, location or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db"
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db"
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "#004aad",
              color: "#fff",
              border: "none"
            }}
          >
            Search
          </button>

          <button
            type="button"
            onClick={clearFilters}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "#f3f4f6",
              border: "none"
            }}
          >
            Clear
          </button>
        </form>

        {/* Featured */}
        <section>
          <h3 style={{ marginBottom: 12, color: "#004aad" }}>Featured</h3>
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 8
            }}
          >
            {loading ? (
              <div>Loading...</div>
            ) : destinations.length === 0 ? (
              <div>No destinations yet</div>
            ) : (
              destinations.map((d, i) => <CardSmall key={d.id ?? i} dest={d} />)
            )}
          </div>
        </section>

        {/* All Destinations */}
        <section style={{ marginTop: 30 }}>
          <h3 style={{ marginBottom: 12, color: "#004aad" }}>All Destinations</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20
            }}
          >
            {destinations.map((d, i) => (
              <CardLarge key={d.id ?? i} dest={d} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

/* ================= CARD SMALL ================= */
function CardSmall({ dest }) {
  const img = dest.imageUrl
    ? dest.imageUrl.startsWith("http")
      ? dest.imageUrl
      : `http://localhost:9090${dest.imageUrl}`
    : "";

  return (
    <div
      style={{
        minWidth: 280,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}
    >
      {img ? (
        <img
          src={img}
          alt={dest.name}
          style={{ width: "100%", height: 160, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            height: 160,
            background: "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          No Image
        </div>
      )}

      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, color: "#004aad" }}>{dest.name}</div>
        <div style={{ fontSize: 13, color: "#666" }}>{dest.location}</div>
      </div>
    </div>
  );
}

/* ================= CARD LARGE ================= */
function CardLarge({ dest }) {
  const img = dest.imageUrl
    ? dest.imageUrl.startsWith("http")
      ? dest.imageUrl
      : `http://localhost:9090${dest.imageUrl}`
    : "";

  const [expanded, setExpanded] = useState(false);
  const descLimit = 400;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        overflow: "hidden"
      }}
    >
      {img ? (
        <img
          src={img}
          alt={dest.name}
          style={{ width: "100%", height: 220, objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            height: 220,
            background: "#eef3ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          No Image
        </div>
      )}

      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#004aad" }}>
              {dest.name}
            </div>
            <div style={{ fontSize: 13, color: "#666" }}>
              {dest.location} • {dest.category}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#888" }}>Added</div>
            <div style={{ fontWeight: 600 }}>
              {new Date(dest.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {dest.description && (
          <div style={{ marginTop: 12, lineHeight: 1.5 }}>
            {expanded
              ? dest.description
              : dest.description.length > descLimit
              ? dest.description.slice(0, descLimit) + "..."
              : dest.description}

            {dest.description.length > descLimit && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#004aad",
                  cursor: "pointer",
                  fontWeight: 600,
                  marginLeft: 5
                }}
              >
                {expanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
