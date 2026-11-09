// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Change "./global.css" to "./src/global.css"
module.exports = withNativeWind(config, { input: "./src/global.css" });
