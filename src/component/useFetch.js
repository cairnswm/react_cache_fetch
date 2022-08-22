import { useEffect, useRef, useReducer } from "react";

export const useFetch = (url, fetch = window.fetch) => {
  const cache = useRef({});

  const refetch = async () => {
    try {
      dispatch({ type: "REFETCH", payload: cache.current[url] });

      cache.current[url] = undefined;
      let data;
      if (url.includes("undefined") || url.includes("/0")) {
        data = [];
      } else {
        const response = await fetch(url);
        data = await response.json();
      }
      cache.current[url] = data;
      dispatch({ type: "FETCHED", payload: data });
    } catch (error) {
      console.error("Error Refetching", error);
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  const initialState = {
    status: "idle",
    error: null,
    data: [],
    refetch: refetch,
    url: url,
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "REFETCH":
        return { ...initialState, status: "refetch", data: action.payload };
      case "FETCHING":
        return { ...initialState, status: "fetching" };
      case "FETCHED":
        return { ...initialState, status: "fetched", data: action.payload };
      case "FETCH_ERROR":
        return { ...initialState, status: "error", error: action.payload };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !url.trim()) return { status: "idle", data: {}, error: "" };

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });
      if (cache.current[url]) {
        const data = cache.current[url];
        dispatch({ type: "FETCHED", payload: data });
        return;
      }
      try {
        let data;
        if (url.includes("undefined") || url.includes("/0")) {
          data = [];
        } else {
          const response = await fetch(url);
          data = await response.json();
        }
        cache.current[url] = data;
        if (cancelRequest) return;
        dispatch({ type: "FETCHED", payload: data });
      } catch (error) {
        if (cancelRequest) return;
        console.error("Error Refetching", error);
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [url, fetch]);

  return state;
};
