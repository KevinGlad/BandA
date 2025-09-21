import { unlink, writeFile } from "node:fs/promises";

export default class ImageUtils {
  static async downloadImage(
    imageUrl: string,
    filePath: string
  ): Promise<string> {
    try {
      // get the filename from URL
      const url = URL.parse(imageUrl);

      const imagePathName = url.pathname;
      const segments = imagePathName.split("/").filter(Boolean); // filter(Boolean) removes empty strings from trailing slashes
      const imageFileName = segments.pop();

      let fileName = `${filePath}//${imageFileName}`;

      // Fetch the image from the URL
      const response = await fetch(imageUrl);

      // Check if the request was successful (status code 200)
      if (!response.ok) {
        console.log("FETCH ERROR");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the image data as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Convert the ArrayBuffer to a Node.js Buffer
      const buffer = Buffer.from(arrayBuffer);

      // Write the buffer to the specified file path
      await writeFile(fileName, buffer);

      console.log(`Image downloaded successfully to ${filePath}`);
      return fileName;
    } catch (error) {
      throw error;
    }
  }
  static async deleteImage(
    imageUrl: string,
    filePath: string
  ): Promise<string> {
    try {
      // get the filename from URL
      const url = URL.parse(imageUrl);

      const imagePathName = url.pathname;
      const segments = imagePathName.split("/").filter(Boolean); // filter(Boolean) removes empty strings from trailing slashes
      const imageFileName = segments.pop();

      let fileName = `${filePath}//${imageFileName}`;

      await unlink(fileName);
      // Write the buffer to the specified file path

      return fileName;
    } catch (error) {
      throw error;
    }
  }
}
