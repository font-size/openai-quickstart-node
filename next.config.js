module.exports = {
  basePath: '/ai',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }

    return config
  },
}