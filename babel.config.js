module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@/assets": "./assets",
          "@/app": "./app",
          "@/api": "./api",
          "@store": "./store",
          "@/app.json": "./app.json",
          "@/components": "./components",
        },
      },
    ],
  ],
};
