export const renameBaseFile = (originalName: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const extension = originalName.split('.').pop();
  return `${timestamp}.${extension}`;
};
