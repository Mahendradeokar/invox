import appRoot from "app-root-path";

export const resolveAppRoot = (path: string) => {
  appRoot.setPath(__dirname);
  return appRoot.resolve(path);
};
