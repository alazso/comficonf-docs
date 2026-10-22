import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  // Inlined at build time and shown in the page footer. GIT_SHA and BUILD_DATE are build arguments of the Docker
  // image; a build without them reports "local" and the time this file was evaluated.
  env: {
    BUILD_SHA: process.env.GIT_SHA || 'local',
    BUILD_DATE: process.env.BUILD_DATE || new Date().toISOString(),
  },
};

export default withMDX(config);
