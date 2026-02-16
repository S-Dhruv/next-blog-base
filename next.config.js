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

    webpack: (config, { isServer, webpack }) => {
        config.resolve.alias['mongodb'] = path.resolve(
            process.cwd(),
            'node_modules/mongodb'
        );

        if (isServer) {
            // Resolve the actual plugin path
            const pluginPath = path.resolve(
                process.cwd(),
                'node_modules/@supergrowthai/next-blog/dist/nextjs/assets/@supergrowthai/next-blog-dashboard/static/internal-plugins'
            );

            // Create alias pointing directly to node_modules
            config.resolve.alias['internal://internal-plugins'] = pluginPath;

            // Add plugin files to the bundle
            config.plugins.push(
                new webpack.NormalModuleReplacementPlugin(
                    /^internal:\/\/internal-plugins/,
                    (resource) => {
                        resource.request = resource.request.replace(
                            'internal://internal-plugins',
                            pluginPath
                        );
                    }
                )
            );
        }

        return config;
    },
};

module.exports = nextConfig;