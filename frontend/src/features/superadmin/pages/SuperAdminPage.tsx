import { useState } from "react";
import { SuperAdminGate } from "../components/SuperAdminGate";
import { SuperAdminDashboard } from "../components/SuperAdminDashboard";

export function SuperAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <SuperAdminGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <SuperAdminDashboard />;
}
