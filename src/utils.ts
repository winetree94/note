import path from 'path';

export function getPublicAssets(resource: string): string {
  return process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../public', resource)
    : path.join(process.resourcesPath, 'public', resource);
}
