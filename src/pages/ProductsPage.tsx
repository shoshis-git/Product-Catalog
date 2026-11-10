import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../config";
import type { Category, Product } from "../types";

const CATEGORIES: Category[] = [
  { id: "אלקטרוניקה", name: "אלקטרוניקה" },
  { id: "ביגוד", name: "ביגוד" },
  { id: "ספרים", name: "ספרים" },
  { id: "בית וגינה", name: "בית וגינה" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "אלקטרוניקה": "💻",
  "ביגוד": "👕",
  "ספרים": "📚",
  "בית וגינה": "🏡",
};

async function fetchByCategory(categoryId: string): Promise<Product[]> {
  const response = await fetch(ENDPOINTS.productsByCategory, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryId }),
  });
  if (!response.ok) throw new Error(`שגיאה ${response.status}`);
  return response.json();
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(CATEGORIES.map((c) => fetchByCategory(c.id)));
        if (!cancelled) setProducts(results.flat());
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  async function handleCategoryClick(category: Category) {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(CATEGORIES.map((c) => fetchByCategory(c.id)));
        setProducts(results.flat());
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
      } finally {
        setLoading(false);
      }
      return;
    }
    setSelectedCategory(category);
    setProducts([]);
    setError(null);
    setLoading(true);
    try {
      const data = await fetchByCategory(category.id);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
    } finally {
      setLoading(false);
    }
  }

  function handleProductClick(product: Product) {
    navigate(`/product/${product.id}?categoryId=${encodeURIComponent(product.categoryId)}`);
  }

  const title = selectedCategory ? `${CATEGORY_ICONS[selectedCategory.id] ?? ""} ${selectedCategory.name}` : "כל המוצרים";

  return (
    <main style={s.main}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerGlow} />
        <h1 style={s.heroTitle}>
          <span style={s.gradientText}>קטלוג</span> מוצרים
        </h1>
        <p style={s.heroSub}>גלה את המוצרים הטובים ביותר במחירים מעולים</p>
      </header>

      {/* Category pills */}
      <section style={s.categorySection}>
        <div style={s.categoryList}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory?.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                style={{ ...s.categoryBtn, ...(active ? s.categoryBtnActive : {}) }}
              >
                <span style={s.categoryIcon}>{CATEGORY_ICONS[cat.id] ?? "🏷️"}</span>
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Products */}
      <section style={s.productsSection}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>{title}</h2>
          {!loading && (
            <span style={s.badge}>{products.length} מוצרים</span>
          )}
        </div>

        {loading && (
          <div style={s.loadingWrap}>
            <div style={s.spinner} />
            <p style={s.loadingText}>טוען מוצרים...</p>
          </div>
        )}

        {error && (
          <div style={s.errorBox}>
            <span>⚠️</span> שגיאה בטעינת המוצרים: {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={s.emptyBox}>
            <span style={{ fontSize: 48 }}>🔍</span>
            <p>לא נמצאו מוצרים.</p>
          </div>
        )}

        <div style={s.grid}>
          {products.map((product) => (
            <button
              key={`${product.categoryId}-${product.id}`}
              style={s.card}
              onClick={() => handleProductClick(product)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.6)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 20px 60px rgba(124,58,237,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
              }}
            >
              <div style={s.cardInner}>
                <div style={s.cardEmoji}>
                  {CATEGORY_ICONS[product.categoryId] ?? "📦"}
                </div>
                <div style={s.cardContent}>
                  <h3 style={s.cardTitle}>{product.name}</h3>
                  <span style={s.cardCategory}>{product.categoryId}</span>
                </div>
                {product.price !== undefined && (
                  <div style={s.cardPrice}>
                    ₪{Number(product.price).toLocaleString("he-IL")}
                  </div>
                )}
              </div>
              <div style={s.cardArrow}>←</div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: {
    direction: "rtl",
    paddingBottom: 80,
  },
  header: {
    position: "relative",
    textAlign: "center",
    padding: "80px 0 48px",
    overflow: "hidden",
  },
  headerGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 300,
    background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroTitle: {
    fontSize: "clamp(36px, 6vw, 64px)",
    fontWeight: 800,
    letterSpacing: "-2px",
    color: "#fff",
    marginBottom: 16,
    position: "relative",
  },
  gradientText: {
    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    fontSize: 18,
    color: "#7070a0",
    position: "relative",
  },
  categorySection: {
    marginBottom: 48,
  },
  categoryList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  categoryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 50,
    background: "rgba(255,255,255,0.05)",
    color: "#c8c8e0",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)",
  },
  categoryBtnActive: {
    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    border: "1px solid transparent",
    color: "#fff",
    boxShadow: "0 0 24px rgba(124,58,237,0.5)",
  },
  categoryIcon: {
    fontSize: 18,
  },
  productsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    padding: "0 4px",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#fff",
  },
  badge: {
    background: "rgba(124,58,237,0.2)",
    border: "1px solid rgba(124,58,237,0.4)",
    color: "#a78bfa",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 13,
    fontWeight: 600,
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    padding: "80px 0",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: "20px 24px",
    cursor: "pointer",
    textAlign: "right",
    fontFamily: "inherit",
    transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  cardInner: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  cardEmoji: {
    fontSize: 32,
    flexShrink: 0,
    width: 52,
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(124,58,237,0.15)",
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardCategory: {
    fontSize: 12,
    color: "#7070a0",
    fontWeight: 500,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: 700,
    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    flexShrink: 0,
  },
  cardArrow: {
    fontSize: 14,
    color: "#7070a0",
    textAlign: "left",
    transition: "color 0.2s",
  },
};
