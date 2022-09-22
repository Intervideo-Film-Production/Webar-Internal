import { QueryKey, useQueryClient } from "react-query";

export const useReactQueryData = <T extends unknown>(queryKey: QueryKey) => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(queryKey) as T;
}
