export interface StorageService {
  saveFile(file: Express.Multer.File): Promise<string>;
}
