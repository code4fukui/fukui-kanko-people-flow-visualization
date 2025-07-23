import { useEffect } from "react";

function App() {
  useEffect(() => {
    // bodyとhtmlのマージン・パディングをリセット
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
  }, []);

  // 開発環境かどうかを判定
  const isDev = import.meta.env.DEV;
  // ローカル開発時はランディングページのポート、本番時は相対パス
  const homeUrl = isDev ? "http://localhost:3004" : "../";

  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(to bottom right, #dbeafe, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box" as const,
  };

  const contentStyle = {
    textAlign: "center" as const,
    padding: "2rem",
  };

  const emojiStyle = {
    fontSize: "6rem",
    marginBottom: "2rem",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "1rem",
  };

  const messageStyle = {
    fontSize: "1.25rem",
    color: "#4b5563",
    marginBottom: "2rem",
  };

  const buttonStyle = {
    display: "inline-block",
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    transition: "background-color 0.2s",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={emojiStyle}>🚧</div>
        <h1 style={titleStyle}>福井駅周辺データ可視化</h1>
        <p style={messageStyle}>現在開発中です</p>
        <a
          href={homeUrl}
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
        >
          ← トップページに戻る
        </a>
      </div>
    </div>
  );
}

export default App;
