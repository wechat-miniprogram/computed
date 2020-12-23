import path from "path";
import simulate from "miniprogram-simulate";
import exparser from "miniprogram-exparser";
import { ComputedComponent } from "../src/type";

const oldLoad = simulate.load;

export default {
  ...simulate,
  load: function (componentPath, ...args) {
    if (typeof componentPath === "string")
      componentPath = path.join(__dirname, "../../", componentPath);
    return oldLoad(componentPath, ...args);
  } as typeof ComputedComponent,
  exparser,
};

// // adjust the simulated wx api
// const oldGetSystemInfoSync = global.wx.getSystemInfoSync
// global.wx.getSystemInfoSync = function () {
//   const res = oldGetSystemInfoSync()
//   res.SDKVersion = '2.4.1'

//   return res
// }
