const fs = require('fs');
const path = require('path');

const sourceDir = path.join(
    __dirname,
    '../node_modules/@supergrowthai/next-blog/dist/nextjs/assets/@supergrowthai/next-blog-dashboard/static/internal-plugins'
);

const targetDir = path.join(__dirname, '../public/internal-plugins');

function copyDir(src, dest) {
    if (!fs.existsSync(src)) {
        console.error('❌ Source directory not found:', src);
        console.log('📦 Available in node_modules:');

        try {
            const blogPath = path.join(__dirname, '../node_modules/@supergrowthai/next-blog');
            if (fs.existsSync(blogPath)) {
                console.log('Found @supergrowthai/next-blog at:', blogPath);

                // List what's actually in the package
                const distPath = path.join(blogPath, 'dist');
                if (fs.existsSync(distPath)) {
                    console.log('Contents of dist:', fs.readdirSync(distPath));
                }
            }
        } catch (e) {
            console.error('Could not inspect package:', e.message);
        }

        console.log('\n⚠️  Creating minimal fallback plugins...');
        createFallbackPlugins(dest);
        return;
    }

    console.log('📁 Copying from:', src);
    console.log('📁 Copying to:', dest);

    fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
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

function createFallbackPlugins(dest) {
    fs.mkdirSync(dest, { recursive: true });

    const plugins = ['system', 'system-update-manager'];

    plugins.forEach(pluginName => {
        const pluginDir = path.join(dest, pluginName);
        fs.mkdirSync(pluginDir, { recursive: true });

        // Create plugin.js
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

        // Create server.js
        const serverContent = `
module.exports = {
  async init(context) {
    console.log('[${pluginName}] Server initialized (fallback mode)');
    return { success: true };
  }
};
`;

        // Create client.js
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
    console.error('\n❌ Error during plugin copy:', error);
    process.exit(1);
}