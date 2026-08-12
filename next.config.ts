import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Unlocks the experimental `html-in-canvas` API (ParticleScroll,
    // DecryptReveal) for real visitors on a participating Chrome build,
    // without them touching chrome://flags. Token is origin-bound — see
    // docs/tasks/TASK-html-in-canvas-origin-trial.md for registration.
    const token = process.env.ORIGIN_TRIAL_TOKEN_HTML_IN_CANVAS;
    if (!token) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "Origin-Trial", value: token }],
      },
    ];
  },
};

export default nextConfig;
