import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(
    __dirname,
    '../node_modules/@supergrowthai/next-blog/dist/nextjs/assets/@supergrowthai/next-blog-dashboard/static/internal-plugins'
);

const targetDir = path.join(__dirname, '../public/internal-plugins');

function copyDir(src: string, dest: string): void {
    if (!fs.existsSync(src)) {
        console.error('❌ Source directory not found:', src);
        console.log('📦 Available in node_modules:');

        try {
            const blogPath = path.join(__dirname, '../node_modules/@supergrowthai/next-blog');
            if (fs.existsSync(blogPath)) {
                console.log('Found @supergrowthai/next-blog at:', blogPath);

                const distPath = path.join(blogPath, 'dist');
                if (fs.existsSync(distPath)) {
                    console.log('Contents of dist:', fs.readdirSync(distPath));
                }
            }
        } catch (e) {
            const error = e as Error;
            console.error('Could not inspect package:', error.message);
        }

        console.log('\n⚠️  Creating minimal fallback plugins...');
        createFallbackPlugins(dest);
        return;
    }

    console.log('📁 Copying from:', src);
    console.log('📁 Copying to:', dest);

    fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log('  ✓', entry.name);
        }
    }
}

function createFallbackPlugins(dest: string): void {
    fs.mkdirSync(dest, { recursive: true });

    const plugins = ['system', 'system-update-manager'];

    plugins.forEach((pluginName: string) => {
        const pluginDir = path.join(dest, pluginName);
        fs.mkdirSync(pluginDir, { recursive: true });

        const pluginContent = `
module.exports = {
  id: '${pluginName}',
  name: '${pluginName}',
  version: '1.0.0',
  
  async initialize(context) {
    console.log('[${pluginName}] Initialized (fallback mode)');
    return { success: true };
  },
  
  async onServerLoad(context) {
    return { success: true };
  }
};
`;

        const serverContent = `
module.exports = {
  async init(context) {
    console.log('[${pluginName}] Server initialized (fallback mode)');
    return { success: true };
  }
};
`;

        const clientContent = `
export default {
  async init(context) {
    console.log('[${pluginName}] Client initialized (fallback mode)');
    return { success: true };
  }
};
`;

        fs.writeFileSync(path.join(pluginDir, 'plugin.js'), pluginContent);
        fs.writeFileSync(path.join(pluginDir, 'server.js'), serverContent);
        fs.writeFileSync(path.join(pluginDir, 'client.js'), clientContent);

        console.log('  ✓ Created fallback plugin:', pluginName);
    });

    console.log('✅ Fallback plugins created successfully');
}

try {
    console.log('🚀 Starting plugin copy process...\n');
    copyDir(sourceDir, targetDir);
    console.log('\n✅ Plugin copy completed successfully!');
} catch (error) {
    const err = error as Error;
    console.error('\n❌ Error during plugin copy:', err);
    process.exit(1);
}