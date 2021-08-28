/**
 * 现在使用 swc 编译 ts 到 es5
 * 通过 esbuild 进行 bundle
 * (也可以选择直接使用 swc 一步到位)
 */

// swc 配置
const swcOptions = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: false,
      decorators: false,
      dynamicImport: false,
    },
    transform: null,
    target: "es5",
    externalHelpers: false,
    keepClassNames: false,
    minify: {
      compress: {
        unused: true,
      },
      mangle: true,
    },
  },
  minify: false,
  module: {
    type: "commonjs",
    strict: false,
    strictMode: true,
    lazy: false,
    noInterop: false,
  },
};

// esbuild 配置
const esbuildOptions = {
  outfile: "index.js",
  bundle: true,
  format: "cjs",
  minify: true, // 开启压缩混淆
};

export interface BuildConfig {
  swcOptions: any;
  esbuildOptions: any;
}

export const buildConfig: BuildConfig = {
  swcOptions,
  esbuildOptions,
};
