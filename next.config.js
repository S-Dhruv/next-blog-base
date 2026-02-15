/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
    reactStrictMode: true,

    transpilePackages: [
        '@supergrowthai/next-blog-ui',
        '@supergrowthai/plugin-dev-kit',
        '@supergrowthai/oneapi'
    ],

    experimental: {
        serverComponentsExternalPackages: ['mongodb'],
    },

    webpack: (config, { isServer }) => {
        config.resolve.alias['mongodb'] = path.resolve(
            process.cwd(),
            'node_modules/mongodb'
        );

        // Point internal plugins to public directory for Vercel
        if (isServer) {
            config.resolve.alias['internal://internal-plugins'] = path.resolve(
                process.cwd(),
                'public/internal-plugins'
            );
        }

        return config;
    },
};

module.exports = nextConfig;