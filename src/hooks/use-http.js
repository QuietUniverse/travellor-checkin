import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { searchActions } from "../store/slices/searchSlice";

const useHttp = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestConfig, applyData) => {
      dispatch(searchActions.setResultIsLoading({ resultIsLoading: true }));

      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method || "GET",
          headers: requestConfig.headers || {},
          body: requestConfig.body || null,
        });

        if (!response.ok) {
          throw new Error({
            title: "Request failed",
            message: "Something went wrong",
          });
        }

        const data = await response.json();
        applyData(data);
      } catch (error) {
        setError(error.message || "Something went wrong");
      }

      dispatch(searchActions.setResultIsLoading({ resultIsLoading: false }));
    },
    [dispatch]
  );

  return { error, sendRequest };
};

export default useHttp;
