import { ISearchCriteria, ISearchCriteriaValue } from "src/core/declarations/app";
import client from "./api";
import { getLocalSearchCriteria, getLocalSearchCriteriaValues } from "./crud.local";

const useLocalData = process.env.REACT_APP_STATIC_DATA;

const SEARCH_CRITERIA_QUERY = `
*[_type == 'searchCriteria']{
  'id': _id,
  isMultipleChoices,
  isSearchable,
  'question': question[$lng]
}
`;

const CRITERIA_VALUE_QUERY = `
*[_type == 'criteriaValue']{
  'id': _id,
  'answer': answer[$lng],
  'criteriaRef': criteria._ref,
  'destination': destination._ref
}
`;

// Search criteria

export const getSearchCriteria = (lng: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<ISearchCriteria[]>(SEARCH_CRITERIA_QUERY, { lng })
    : getLocalSearchCriteria(lng);
}

export const getSearchCriteriaValues = (lng: string) => {
  return useLocalData !== 'TRUE'
    ? client.fetch<ISearchCriteriaValue[]>(CRITERIA_VALUE_QUERY, { lng })
    : getLocalSearchCriteriaValues(lng);
}
