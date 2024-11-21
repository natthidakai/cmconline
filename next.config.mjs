const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['online.cmc.co.th'],
    },
    distDir: '_next',
    webpack: (config, { dev }) => {
    if (!dev) {
        config.output.hotUpdateChunkFilename = 'static/webpack/[id].[hash].hot-update.js';
        config.output.hotUpdateMainFilename = 'static/webpack/[hash].hot-update.json';
        config.plugins = config.plugins.filter(
            plugin => plugin.constructor.name !== 'HotModuleReplacementPlugin'
        );
    }
    return config;
},
env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },

};

export default nextConfig;