import React from "react";

function App() {
  // 環境に応じてベースURLを決定
  const getAppUrl = (appPath) => {
    if (import.meta.env.DEV) {
      // ローカル開発環境では各アプリの開発サーバーポートに直接アクセス
      const portMap = {
        whole: 3000,
        "fukui-terminal": 3001,
        tojinbo: 3002,
        "rainbow-line": 3003,
      };
      return `http://localhost:${portMap[appPath]}`;
    } else {
      // 本番環境では相対パス
      return `./${appPath}/`;
    }
  };

  // 色とスタイルのマッピング
  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-500",
        hover: "hover:bg-blue-600",
      },
      green: {
        bg: "bg-green-500",
        hover: "hover:bg-green-600",
      },
      purple: {
        bg: "bg-purple-500",
        hover: "hover:bg-purple-600",
      },
      orange: {
        bg: "bg-orange-500",
        hover: "hover:bg-orange-600",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  const apps = [
    {
      id: "whole",
      title: "包括的データ可視化",
      description: "全地点のデータを統合して表示し、包括的な分析を行うアプリケーションです。",
      color: "blue",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
      ),
    },
    {
      id: "fukui-terminal",
      title: "福井駅周辺",
      description: "福井駅東口周辺の人流データに特化した詳細分析アプリケーションです。",
      color: "green",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      ),
    },
    {
      id: "tojinbo",
      title: "東尋坊",
      description: "東尋坊観光地の人流データに特化した詳細分析アプリケーションです。",
      color: "purple",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      id: "rainbow-line",
      title: "レインボーライン",
      description: "レインボーライン駐車場の車両データに特化した詳細分析アプリケーションです。",
      color: "orange",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            福井県観光DX AIカメラオープンデータ
          </h1>
          <p className="text-xl text-gray-600 mb-6">データ可視化アプリケーション群</p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            福井県観光DXで収集したAIカメラのオープンデータを元に、様々な観点からデータの可視化を行うウェブアプリケーションです。
          </p>
        </header>

        {/* アプリケーション一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {apps.map((app) => {
            const colorClasses = getColorClasses(app.color);
            return (
              <div
                key={app.id}
                className="app-card bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center mr-4`}
                  >
                    {app.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{app.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">{app.description}</p>
                <a
                  href={getAppUrl(app.id)}
                  className={`inline-block ${colorClasses.bg} text-white px-4 py-2 rounded-md ${colorClasses.hover} transition-colors`}
                  target={import.meta.env.DEV ? "_blank" : "_self"}
                  rel={import.meta.env.DEV ? "noopener noreferrer" : undefined}
                >
                  アプリを開く
                </a>
              </div>
            );
          })}
        </div>

        {/* フッター */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-2">データ提供: 福井県観光DX</p>
          <p className="text-gray-400 text-sm">毎朝1時頃にデータを更新しています</p>
          {import.meta.env.DEV && (
            <p className="text-blue-500 text-sm mt-2">開発モード: 各アプリは新しいタブで開きます</p>
          )}
        </footer>
      </div>
    </div>
  );
}

export default App;
