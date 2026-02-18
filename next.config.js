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
        outputFileTracingIncludes: {
            '/**': [
                './node_modules/.bun/**/@supergrowthai/next-blog/dist/nextjs/assets/**',
            ],
        },
    },

    webpack: (config) => {
        config.resolve.alias['mongodb'] = path.resolve(
            process.cwd(),
            'node_modules/mongodb'
        );
        return config;
    },
};

module.exports = nextConfig;