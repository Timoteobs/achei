import { QueryCache, QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (isAxiosError(error) && error.response?.status === 401) return;

      const notFound = isAxiosError(error) && error.response?.status === 404;
      const message = notFound && query.meta?.notFoundMessage
        ? query.meta.notFoundMessage
        : query.meta?.errorMessage;
      if (typeof message === "string") {
        if (notFound && query.meta?.notFoundMessage) {
          toast.warning(message);
        } else {
          toast.error(message);
        }
      }
    },
  }),
});
