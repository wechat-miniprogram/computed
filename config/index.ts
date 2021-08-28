import { baseConfig, BaseConfig } from "./base";
import { buildConfig, BuildConfig } from "./build";

interface Config extends BaseConfig, BuildConfig {}

const config: Config = {
  ...baseConfig,
  ...buildConfig,
};

export default config;
