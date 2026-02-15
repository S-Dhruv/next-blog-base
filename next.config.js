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

    webpack: (config) => {
        // Force a single mongodb instance (avoid nested copy inside next-blog)
        config.resolve.alias['mongodb'] = path.resolve(
            process.cwd(),
            'node_modules/mongodb'
        );

        return config;
    },
};

module.exports = nextConfig;
