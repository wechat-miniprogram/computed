import { baseConfig, IBaseConfig } from './base'
import { buildConfig, IBuildConfig  } from './build'

interface IConfig extends IBaseConfig, IBuildConfig { }

const config: IConfig = {
  ...baseConfig,
  ...buildConfig,
}

export default config;