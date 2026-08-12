import path from 'path'

export interface BaseConfig {
  entry: string
  srcPath: string
  bundlePath: string
  swcBuildPath: string
  tsConfigPath: string
}

const srcPath = path.resolve(__dirname, '../src')
const bundlePath = path.resolve(__dirname, '../dist')
const swcBuildPath = path.resolve(__dirname, '../swc_build')
const tsConfigPath = path.resolve(__dirname, '../tsconfig.json')

export const baseConfig: BaseConfig = {
  entry: 'index',
  srcPath, // 源码路径
  bundlePath, // 编译产物路径
  swcBuildPath, // swc 转译生成路径
  tsConfigPath, // tsc 配置文件
}
