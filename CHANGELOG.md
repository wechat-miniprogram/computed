# Changelog

## 9.0.0

- 移除 proxy polyfill
- 清理 npm 依赖

## 8.1.0

### Changed

- 更新到 glass-easel 1.0

## 8.0.0

### Changed

- 更新到 miniprogram-api-typings v5

## 7.1.0

### Added

- 为 watch 新增 oldValue

## 7.0.0

### Added

- 新增一些 watch 辅助接口

## 6.0.0

### Changed

- 更新到 miniprogram-api-typing v4

## 5.0.0

### Added

- 支持 chaining API

### Changed

- 基于 glass-easel 重构

## 4.3.x

### Fixed

- 修复引用类型的部分问题

## 4.2.x

### Added

- 增加 polyfill

## 4.1.1

### Changed

- 优化打包方式
- 优化 dev 开发流程

## 4.0.0

### Changed

- 使用 TypeScript 重构
- 优化部分生命周期逻辑

## 3.0.0

### Added

- 支持 mobx-miniprogram 扩展库

### Changed

- 更新 computed 数据追踪方式

### Fixed

- 修复 computed 中使用自定义 behavior 数据段时，初始化视图的 computed data 不渲染的问题

## 2.1.0

### Added

- 支持 watch 的 `.**` 语法

## 2.0.0

### Added

- 开始支持 watch

### Changed

- 基于 observers 重构

## 0.0.7

### Fixed

- 修复 setData 设置 properties 会报 can't call setData in computed getter function! 的问题

## 0.0.6

### Added

- 支持 properties
