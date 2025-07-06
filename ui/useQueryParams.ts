import { useCallback, useEffect, useState } from "https://esm.sh/react@19";

export function useQueryParams() {
  const [searchParams, setSearchParamsState] = useState(() =>
    new URLSearchParams(globalThis.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(globalThis.location.search));
    };

    globalThis.addEventListener("popstate", handlePopState);
    return () => globalThis.removeEventListener("popstate", handlePopState);
  }, []);

  const updateURL = useCallback((params: URLSearchParams, replace = false) => {
    const url = new URL(globalThis.location.toString());
    url.search = params.toString();

    if (replace) {
      globalThis.history.replaceState({}, "", url);
    } else {
      globalThis.history.pushState({}, "", url);
    }

    setSearchParamsState(new URLSearchParams(params.toString()));
  }, []);

  return {
    searchParams,
    updateURL,
  };
}
