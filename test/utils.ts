import path from "path";
import simulate from "miniprogram-simulate";
import exparser from "miniprogram-exparser";
import { ComponentWithComputed } from "../src/index";

const oldLoad = simulate.load;

export default {
  ...simulate,
  load: function (componentPath, ...args) {
    if (typeof componentPath === "string")
      componentPath = path.join(__dirname, "../../", componentPath);
    return oldLoad(componentPath, ...args);
  } as typeof ComponentWithComputed,
  exparser,
};
