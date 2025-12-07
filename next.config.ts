import type { NextConfig } from "next";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

const cesiumSource = "node_modules/cesium/Build/Cesium";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'generator-qrcode.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.generator-qrcode.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(cesiumSource, "Workers"),
              to: "static/cesium/Workers",
            },
            {
              from: path.join(cesiumSource, "Assets"),
              to: "static/cesium/Assets",
            },
            {
              from: path.join(cesiumSource, "Widgets"),
              to: "static/cesium/Widgets",
            },
            {
              from: path.join(cesiumSource, "ThirdParty"),
              to: "static/cesium/ThirdParty",
            },
          ],
        })
      );

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
        zlib: false,
      };
    }

    return config;
  },
  transpilePackages: ["cesium", "resium"],
};

export default nextConfig;
