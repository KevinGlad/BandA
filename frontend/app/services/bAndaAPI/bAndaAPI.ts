import axios from "axios";
import type {
  FavoriteDTO,
  FavoriteDocDTO,
} from "../../types/common/favoriteTypes";

import type { ImageDocDTO, ImageDTO } from "../../types/common/ImageTypes";
import { SERVER_BASE_URL, SERVER_PORT } from "../../constants/serverConstants";

const SERVER_URL = `${SERVER_BASE_URL}:${SERVER_PORT}`;

const FAVORITE_ENDPOINT = "favorite";
const FAVORITE_PROVIDER_ENDPOINT = "provider";
const FAVORITE_NAME_ENDPOINT = "name";

const IMAGE_ENDPOINT = "image";
const IMAGE_BY_URL_ENDPOINT = "imageByURL";
const IMAGES_BY_TAGS_ENDPOINT = "imagesByTags";
const IMAGES_BY_IDS_ENDPOINT = "imagesByIds";

const TAGS_ENDPOINT = "uniqueTags";

export default class bAndaAPI {
  static favorite = {
    create: async (favorite: FavoriteDTO): Promise<FavoriteDocDTO> => {
      try {
        const response = await axios.post(
          `${SERVER_URL}/${FAVORITE_ENDPOINT}`,
          favorite,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );
        const favoriteDoc: FavoriteDocDTO = response.data;
        return favoriteDoc;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getList: async (): Promise<FavoriteDocDTO[]> => {
      try {
        const response = await axios.get(`${SERVER_URL}/${FAVORITE_ENDPOINT}`, {
          headers: {
            "Content-Type": "Application/Json",
          },
        });

        const favoriteList: FavoriteDocDTO[] = response.data;
        return favoriteList;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    update: async (favorite: FavoriteDocDTO): Promise<FavoriteDocDTO> => {
      try {
        console.log("UPDAYR", favorite);
        const response = await axios.put(
          `${SERVER_URL}/${FAVORITE_ENDPOINT}`,
          favorite,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );
        const favoriteDoc: FavoriteDocDTO = response.data;
        return favoriteDoc;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The server responded with a status code outside the 2xx range.
            console.log(
              "Server responded with an error status:",
              error.response.status
            );
            console.log("Error data:", error.response.data);
            console.log("Error headers:", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received.
            console.log("No response received:", error.request);
          }
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getById: async (favoriteId: string): Promise<FavoriteDocDTO> => {
      try {
        const encodedFavoriteId: string = encodeURIComponent(favoriteId);
        const response = await axios.get(
          `${SERVER_URL}/${FAVORITE_ENDPOINT}/${encodedFavoriteId}`,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );

        const favoriteDoc: FavoriteDocDTO = response.data;
        return favoriteDoc;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getListByProvider: async (provider: string): Promise<FavoriteDocDTO[]> => {
      try {
        const encodedProvider: string = encodeURIComponent(provider);
        const response = await axios.get(
          `${SERVER_URL}/${FAVORITE_ENDPOINT}/${FAVORITE_PROVIDER_ENDPOINT}/${encodedProvider}`,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );

        const favoriteDoc: FavoriteDocDTO[] = response.data;
        return favoriteDoc;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getByName: async (name: string): Promise<FavoriteDocDTO> => {
      try {
        const encodedName: string = encodeURIComponent(name);
        const response = await axios.get(
          `${SERVER_URL}/${FAVORITE_ENDPOINT}/${FAVORITE_NAME_ENDPOINT}/${encodedName}`,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );

        const favoriteDoc: FavoriteDocDTO = response.data;
        return favoriteDoc;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    delete: async (favoriteId: string): Promise<void> => {
      try {
        const encodedFavoriteId: string = encodeURIComponent(favoriteId);
        await axios.delete(
          `${SERVER_URL}/${FAVORITE_ENDPOINT}/${encodedFavoriteId}`,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
  };

  static image = {
    create: async (image: ImageDTO): Promise<ImageDocDTO> => {
      try {
        const response = await axios.post(
          `${SERVER_URL}/${IMAGE_ENDPOINT}`,
          image,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );
        const imageDoc: ImageDocDTO = response.data;
        return imageDoc;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The server responded with a status code outside the 2xx range.
            console.log(
              "Server responded with an error status:",
              error.response.status
            );
            console.log("Error data:", error.response.data);
            console.log("Error headers:", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received.
            console.log("No response received:", error.request);
          }
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getList: async (): Promise<ImageDocDTO[]> => {
      try {
        const response = await axios.get(`${SERVER_URL}/${IMAGE_ENDPOINT}`, {
          headers: {
            "Content-Type": "Application/Json",
          },
        });
        const imageList: ImageDocDTO[] = response.data;
        return imageList;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The server responded with a status code outside the 2xx range.
            console.log(
              "Server responded with an error status:",
              error.response.status
            );
            console.log("Error data:", error.response.data);
            console.log("Error headers:", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received.
            console.log("No response received:", error.request);
          }
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    update: async (image: ImageDocDTO): Promise<ImageDocDTO> => {
      try {
        const response = await axios.put(
          `${SERVER_URL}/${IMAGE_ENDPOINT}`,
          image,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );
        const imageDoc: ImageDocDTO = response.data;
        return imageDoc;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The server responded with a status code outside the 2xx range.
            console.log(
              "Server responded with an error status:",
              error.response.status
            );
            console.log("Error data:", error.response.data);
            console.log("Error headers:", error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received.
            console.log("No response received:", error.request);
          }
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getById: async (imageId: string): Promise<ImageDocDTO> => {
      try {
        const encodedImageId = encodeURIComponent(imageId);
        const response = await axios.get(
          `${SERVER_URL}/${IMAGE_ENDPOINT}/${encodedImageId}`,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );
        const image: ImageDocDTO = response.data;
        return image;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getListByTags: async (tags: string[]): Promise<ImageDocDTO[]> => {
      try {
        const queryTags = encodeURIComponent(tags.toString());
        const response = await axios.get(
          `${SERVER_URL}/${IMAGE_ENDPOINT}/${IMAGES_BY_TAGS_ENDPOINT}`,
          {
            params: {
              tags: queryTags,
            },
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );

        const images: ImageDocDTO[] = response.data;
        return images;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getListByIds: async (imageIds: string[]): Promise<ImageDocDTO[]> => {
      try {
        const response = await axios.post(
          `${SERVER_URL}/${IMAGE_ENDPOINT}/${IMAGES_BY_IDS_ENDPOINT}`,
          imageIds,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );

        const images: ImageDocDTO[] = response.data;
        return images;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getByURL: async (url: string): Promise<ImageDocDTO> => {
      try {
        const queryURL = encodeURIComponent(url);
        const response = await axios.get(
          `${SERVER_URL}/${IMAGE_ENDPOINT}/${IMAGE_BY_URL_ENDPOINT}`,
          {
            params: {
              url: queryURL,
            },
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );

        const image: ImageDocDTO = response.data;
        return image;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    getUniqueTags: async (): Promise<string[]> => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/${IMAGE_ENDPOINT}/${TAGS_ENDPOINT}`,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );

        const tags: string[] = response.data;
        return tags;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
    delete: async (imageId: string): Promise<void> => {
      try {
        const encodedImageId: string = encodeURIComponent(imageId);
        await axios.delete(
          `${SERVER_URL}/${IMAGE_ENDPOINT}/${encodedImageId}`,
          {
            headers: {
              "Content-Type": "Application/Json",
            },
          }
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error response:", error);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      }
    },
  };
}
