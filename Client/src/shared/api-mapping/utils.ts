
export function addToPath(originalPath: string, ...paths: string[]) {
  let newPath = originalPath;
  paths.forEach(path => {
    newPath += '/' + path;
  });
  return originalPath
}
