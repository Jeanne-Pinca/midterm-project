//./src/hooks/useFetch.js

//note: will be used to fetch the story data from the JSON file

import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching story:", err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}
