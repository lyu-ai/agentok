// Check whether the given subPath is the parent path of parentPath
export function isParentPath(subPath: string, parentPath: string) {
  // Ensure that both pathname and href start without slashes for consistency
  const normalizedSubPath = subPath.startsWith('/')
    ? subPath.substring(1)
    : subPath;
  const normalizedParentPath = parentPath.startsWith('/')
    ? parentPath.substring(1)
    : parentPath;

  // Split the paths into segments for comparison
  const subSegments = normalizedSubPath.split('/');
  const parentSegments = normalizedParentPath.split('/');

  // Check if every segment of the href matches the corresponding segment in the pathname
  return (
    subSegments.length >= parentSegments.length &&
    parentSegments.every((segment, index) => segment === subSegments[index])
  );
}
