const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    index: __dirname + "/src/index.ts",
  },
  output: {
    path: __dirname + "/swc_dist",
  },
  mode: "production",
  target: "node",
});