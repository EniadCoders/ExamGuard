import { RouterProvider } from "react-router";
import SplashCursor from "@/shared/components/SplashCursor";
import { router } from "./router";

export default function App() {
  return (
    <div className="dark cyber-app relative isolate">
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#1b3947"
      />
      <RouterProvider router={router} />
    </div>
  );
}
