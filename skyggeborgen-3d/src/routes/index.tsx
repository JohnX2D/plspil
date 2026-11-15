import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [App, setApp] = useState<null | typeof import("../game/GameApp").GameApp>(null);

  useEffect(() => {
    let live = true;
    void import("../game/GameApp").then((m) => {
      if (live) setApp(() => m.GameApp);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!App) return <Splash />;
  return <App />;
}

function Splash() {
  return (
    <main className="splash">
      <p className="eyebrow">Den tavse klokke</p>
      <h1>Skyggeborgen</h1>
      <p className="lead">Porten åbner…</p>
    </main>
  );
}
