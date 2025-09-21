export interface FavoriteDTO {
  name: string;
  provider: string;
  bAndaPicIds: string[];
  notes: string;
}

export interface FavoriteDocDTO extends FavoriteDTO {
  favoriteId: string;
  name: string;
  provider: string;
  date: Date;
  url: string;
}
