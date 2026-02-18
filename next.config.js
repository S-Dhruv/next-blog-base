/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
    reactStrictMode: true,

    transpilePackages: [
        '@supergrowthai/next-blog-ui',
        '@supergrowthai/plugin-dev-kit',
        '@supergrowthai/oneapi'
    ],

    // ✅ moved OUT of experimental in Next 16
    serverExternalPackages: ['mongodb'],

    // ✅ moved OUT of experimental in Next 16
    outputFileTracingIncludes: {
        "/*": [
            "./node_modules/@supergrowthai/next-blog/dist/nextjs/assets/**/*",
            "./node_modules/.bun/**/@supergrowthai/next-blog/dist/nextjs/assets/**/*"
        ]
    },

    // still needed for that package
    webpack: (config) => {
        config.resolve.alias['mongodb'] = path.resolve(
            process.cwd(),
            'node_modules/mongodb'
        );
        return config;
    },
};

module.exports = nextConfig;
