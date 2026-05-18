import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { watchForeignAuthChanges } from "@/shared/lib/api";
import { router } from "./router";

export default function App() {
  // Resynchronise l'onglet si un autre onglet change de compte (connexion/déconnexion).
  useEffect(() => watchForeignAuthChanges(), []);

  return (
    <div className="dark cyber-app relative isolate">
      <RouterProvider router={router} />
    </div>
  );
}
