/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The site's imagery is a locally generated SVG illustration set —
    // vector files need no optimization, so serve them as-is.
    unoptimized: true,
  },
};

export default nextConfig;
