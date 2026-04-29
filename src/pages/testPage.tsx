import { useEffect, useState } from "react";
import { getAllBrands } from "../../requestes/brand";

interface Brand {
  id: string;
  name: string;
  logo?: string;
  models?: unknown[];
  cars?: unknown[];
}

export default function TestBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBrands();
        setBrands(data);
      } catch (err) {
        setError("Failed to load brands");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ ADDED: dedicated loading screen instead of plain <p>Loading...</p>
  if (loading) return (
    <div style={styles.center}>
      <p style={styles.loadingText}>Loading brands...</p>
    </div>
  );

  // ✅ ADDED: dedicated error screen instead of plain <p>{error}</p>
  if (error) return (
    <div style={styles.center}>
      <p style={styles.errorText}>⚠ {error}</p>
    </div>
  );

  // ✅ ADDED: empty state — your original had nothing for when DB returns []
  if (brands.length === 0) return (
    <div style={styles.center}>
      <p style={styles.emptyText}>No brands found in the database.</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>
        All Brands
        {/* ✅ ADDED: live count badge next to the title */}
        <span style={styles.badge}>{brands.length}</span>
      </h1>

      {/* ✅ CHANGED: was a plain <div> loop, now a CSS grid of cards */}
      <div style={styles.grid}>
        {brands.map((brand) => (
          <div key={brand.id} style={styles.card}>

            <div style={styles.logoBox}>
              {brand.logo ? (
                // ✅ ADDED: onError handler — if the logo URL is broken,
                // hides the broken image instead of showing a broken icon
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={styles.logo}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                // ✅ ADDED: fallback when logo is null/undefined —
                // shows the first letter of the brand name instead
                <span style={styles.logoFallback}>
                  {brand.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* ✅ SAME: brand name, just styled */}
            <h2 style={styles.brandName}>{brand.name}</h2>

            <div style={styles.stats}>
              {/* ✅ SAME: models count, just styled */}
              <div style={styles.stat}>
                <span style={styles.statValue}>{brand.models?.length ?? 0}</span>
                <span style={styles.statLabel}>Models</span>
              </div>
              <div style={styles.divider} />
              {/* ✅ SAME: cars count, just styled */}
              <div style={styles.stat}>
                <span style={styles.statValue}>{brand.cars?.length ?? 0}</span>
                <span style={styles.statLabel}>Cars</span>
              </div>
            </div>

            {/* ✅ ADDED: shows the MongoDB _id so you can debug/verify easily */}
            <p style={styles.idText}>ID: {brand.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ ADDED: all styles are here at the bottom, typed as CSSProperties
// so nothing is inline-cluttering the JSX above
const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "2rem",
    fontFamily: "sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  badge: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "999px",
    fontSize: "0.9rem",
    fontWeight: 600,
    padding: "2px 12px",
  },
  grid: {
    // ✅ auto-fill = as many columns as fit, minimum 200px each
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.25rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoBox: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  logoFallback: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#4f46e5",
  },
  brandName: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
    textAlign: "center",
  },
  stats: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    justifyContent: "center",
    padding: "0.5rem 0",
    borderTop: "1px solid #f0f0f0",
    borderBottom: "1px solid #f0f0f0",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  statValue: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#4f46e5",
  },
  statLabel: {
    fontSize: "0.72rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  divider: {
    width: "1px",
    height: "30px",
    backgroundColor: "#e0e0e0",
  },
  idText: {
    fontSize: "0.7rem",
    color: "#bbb",
    margin: 0,
    fontFamily: "monospace",
    wordBreak: "break-all",
    textAlign: "center",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  loadingText: { fontSize: "1.2rem", color: "#555" },
  errorText: { fontSize: "1.2rem", color: "#e53e3e" },
  emptyText: { fontSize: "1.2rem", color: "#888" },
};