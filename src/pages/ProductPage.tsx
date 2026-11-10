import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../config";
import type { Product } from "../types";

const CATEGORY_ICONS: Record<string, string> = {
  "אלקטרוניקה": "💻",
  "ביגוד": "👕",
  "ספרים": "📚",
  "בית וגינה": "🏡",
};

const FIELD_LABELS: Record<string, string> = {
  id: "מזהה מוצר",
  name: "שם מוצר",
  price: "מחיר",
  description: "תיאור",
  categoryId: "קטגוריה",
};

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get("categoryId") ?? "";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(ENDPOINTS.productById, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId, categoryId }),
        });
        if (!response.ok) throw new Error(`שגיאה ${response.status}: ${response.statusText}`);
        const data: Product = await response.json();
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [productId, categoryId]);

  const extraFields = product
    ? Object.entries(product).filter(
        ([key]) => !["id", "categoryId", "name", "price", "description"].includes(key)
      )
    : [];

  return (
    <main style={s.main}>
      {/* Back button */}
      <button style={s.backBtn} onClick={() => navigate(-1)}>
        <span style={s.backArrow}>→</span>
        חזרה לקטלוג
      </button>

      {loading && (
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
          <p style={s.loadingText}>טוען פרטי מוצר...</p>
        </div>
      )}

      {error && (
        <div style={s.errorBox}>
          <span>⚠️</span> שגיאה בטעינת המוצר: {error}
        </div>
      )}

      {!loading && !error && !product && (
        <div style={s.emptyBox}>
          <span style={{ fontSize: 48 }}>🔍</span>
          <p>המוצר לא נמצא.</p>
        </div>
      )}

      {product && (
        <article style={s.article}>
          {/* Hero card */}
          <div style={s.heroCard}>
            <div style={s.heroGlow} />
            <div style={s.heroEmoji}>
              {CATEGORY_ICONS[product.categoryId] ?? "📦"}
            </div>
            <div style={s.heroInfo}>
              <span style={s.heroCategoryBadge}>{product.categoryId}</span>
              <h1 style={s.heroTitle}>{product.name}</h1>
              {product.price !== undefined && (
                <div style={s.heroPrice}>
                  ₪{Number(product.price).toLocaleString("he-IL")}
                </div>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div style={s.detailsGrid}>
            {/* Description */}
            {product.description && (
              <div style={{ ...s.detailCard, gridColumn: "1 / -1" }}>
                <div style={s.detailLabel}>📝 תיאור</div>
                <div style={s.detailValue}>{String(product.description)}</div>
              </div>
            )}

            {/* ID */}
            <div style={s.detailCard}>
              <div style={s.detailLabel}>🔑 מזהה מוצר</div>
              <div style={{ ...s.detailValue, ...s.detailMono }}>{product.id}</div>
            </div>

            {/* Category */}
            <div style={s.detailCard}>
              <div style={s.detailLabel}>🏷️ קטגוריה</div>
              <div style={s.detailValue}>{product.categoryId}</div>
            </div>

            {/* Extra fields */}
            {extraFields.map(([key, value]) => (
              <div key={key} style={s.detailCard}>
                <div style={s.detailLabel}>{FIELD_LABELS[key] ?? key}</div>
                <div style={s.detailValue}>{String(value)}</div>
              </div>
            ))}
          </div>
        </article>
      )}
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: {
    direction: "rtl",
    paddingBottom: 80,
    maxWidth: 800,
    margin: "0 auto",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    margin: "40px 0 32px",
    padding: "10px 20px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 50,
    color: "#c8c8e0",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  backArrow: {
    fontSize: 16,
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "120px 0",
  },
  spinner: {
    width: 44,
    height: 44,
    border: "3px solid rgba(124,58,237,0.2)",
    borderTop: "3px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#7070a0",
    fontSize: 16,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5",
    borderRadius: 12,
    padding: "16px 20px",
    fontSize: 15,
  },
  emptyBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "80px 0",
    color: "#7070a0",
    fontSize: 18,
  },
  article: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  heroCard: {
    position: "relative",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(124,58,237,0.3)",
    borderRadius: 20,
    padding: "40px 36px",
    display: "flex",
    alignItems: "center",
    gap: 28,
    overflow: "hidden",
    boxShadow: "0 0 60px rgba(124,58,237,0.15)",
  },
  heroGlow: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 300,
    height: 300,
    background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroEmoji: {
    fontSize: 64,
    width: 100,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(124,58,237,0.15)",
    borderRadius: 20,
    flexShrink: 0,
    position: "relative",
  },
  heroInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  heroCategoryBadge: {
    display: "inline-block",
    background: "rgba(6,182,212,0.15)",
    border: "1px solid rgba(6,182,212,0.3)",
    color: "#67e8f9",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 13,
    fontWeight: 600,
    width: "fit-content",
  },
  heroTitle: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  heroPrice: {
    fontSize: 28,
    fontWeight: 700,
    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  detailCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#7070a0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: {
    fontSize: 16,
    color: "#e0e0f0",
    fontWeight: 500,
    lineHeight: 1.6,
  },
  detailMono: {
    fontFamily: "ui-monospace, Consolas, monospace",
    fontSize: 14,
    color: "#a78bfa",
  },
};
