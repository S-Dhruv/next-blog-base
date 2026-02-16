/** @type {import('next').NextConfig} */
const path = require("path");
const fs = require("fs");

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

    webpack: (config, { isServer, dev }) => {
        config.resolve.alias['mongodb'] = path.resolve(
            process.cwd(),
            'node_modules/mongodb'
        );

        if (isServer) {
            // In Vercel production, use /var/task which is the serverless function directory
            const isVercel = process.env.VERCEL === '1';

            let pluginPath;

            if (isVercel) {
                // On Vercel, files need to be in the function bundle
                // Copy plugins to a location that will be bundled
                pluginPath = path.resolve(process.cwd(), '.next/server/chunks/internal-plugins');

                const sourcePath = path.resolve(
                    process.cwd(),
                    'node_modules/@supergrowthai/next-blog/dist/nextjs/assets/@supergrowthai/next-blog-dashboard/static/internal-plugins'
                );

                // Copy during build
                if (fs.existsSync(sourcePath) && !fs.existsSync(pluginPath)) {
                    console.log('📦 Copying plugins for Vercel deployment...');
                    copyDirRecursive(sourcePath, pluginPath);
                    console.log('✅ Plugins copied to', pluginPath);
                }
            } else {
                // Local development - use node_modules directly
                pluginPath = path.resolve(
                    process.cwd(),
                    'node_modules/@supergrowthai/next-blog/dist/nextjs/assets/@supergrowthai/next-blog-dashboard/static/internal-plugins'
                );
            }

            config.resolve.alias['internal://internal-plugins'] = pluginPath;

            console.log('🔧 Plugin path set to:', pluginPath);
        }

        return config;
    },
};

function copyDirRecursive(src, dest) {
    if (!fs.existsSync(src)) {
        console.warn('⚠️  Source not found:', src);
        return;
    }

    fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

module.exports = nextConfig;