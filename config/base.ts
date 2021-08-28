import path from "path";

export interface BaseConfig {
  entry: string;
  srcPath: string;
  bundlePath: string;
  demoPath: string;
  bundleInDemoPath: string;
  typesPath: string;
  swcBuildPath: string;
  tsConfigPath: string;
}

const srcPath = path.resolve(__dirname, "../src");
const bundlePath = path.resolve(__dirname, "../dist");
const demoPath = path.resolve(__dirname, "../demo");
const bundleInDemoPath = path.resolve(demoPath, "./computed");
const swcBuildPath = path.resolve(__dirname, "../swc_build");
const typesPath = path.resolve(__dirname, "../types");
const tsConfigPath = path.resolve(__dirname, "../tsconfig.json");

export const baseConfig: BaseConfig = {
  entry: "index",
  srcPath, // 源码路径
  bundlePath, // 编译产物路径
  demoPath, // demo 路径
  bundleInDemoPath, // 编译产物在 demo 里的路径
  typesPath, // .d.ts 类型声明路径
  swcBuildPath, // swc 转译生成路径
  tsConfigPath, // tsc 配置文件
};
