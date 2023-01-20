import { IButtonContent, ICategory } from "src/core/declarations/app";
import client from "./api";
import { getLocalButtonAnimationContent } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const CATEGORIES_QUERY = `
  *[_type == "category"]{
    'name': name[$lng],
    'image': image.asset->['url'],
    'id': _id
  }
`;

export const getCategories = (lng: string): Promise<ICategory[] | null> => {
  return client.fetch<ICategory[]>(CATEGORIES_QUERY, { lng });
}
