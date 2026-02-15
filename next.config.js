/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
    reactStrictMode: true,

    // Only transpile UI-related packages (NOT the core one that imports mongodb)
    transpilePackages: [
        '@supergrowthai/next-blog-ui',
        '@supergrowthai/plugin-dev-kit',
        '@supergrowthai/oneapi'
    ],

    experimental: {
        // Tell Next.js NOT to bundle mongodb
        serverComponentsExternalPackages: ['mongodb'],
    },

    webpack: (config, { isServer }) => {
        // Force a single mongodb instance (avoid nested copy inside next-blog)
        config.resolve.alias['mongodb'] = path.resolve(
            process.cwd(),
            'node_modules/mongodb'
        );

        // Fix internal plugins path for Vercel deployment
        if (isServer) {
            config.resolve.alias['internal://internal-plugins'] = path.resolve(
                process.cwd(),
                'node_modules/@supergrowthai/next-blog/dist/nextjs/assets/@supergrowthai/next-blog-dashboard/static/internal-plugins'
            );
        }

        return config;
    },
};

module.exports = nextConfig;