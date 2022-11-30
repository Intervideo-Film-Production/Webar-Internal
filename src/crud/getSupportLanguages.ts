import { ISupportLanguage } from "src/core/declarations/app";
import client from "./api";
import { getLocalSupportLanguages } from "./crud.local";
const useLocalData = process.env.REACT_APP_STATIC_DATA;

// FIXME fix static data
const GET_SUPPORT_LANGUAGES = `
  *[_type == "supportLanguage" && isDisabled != true]{
    code,
    isDefault,
    name
  }
`;

/**
 * Get a list of supported languages by the system
 * @returns 
 */
export const getSupportLanguages = () => {
  return useLocalData !== 'TRUE'
    ? client.fetch<ISupportLanguage[]>(GET_SUPPORT_LANGUAGES)
    : getLocalSupportLanguages()
}
