import { useState, useCallback } from "react";

export const useUrlShortener = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shortenUrl = useCallback(async (longUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
      );
      if (!response.ok) throw new Error("Failed to shorten URL");
      const shortUrl = await response.text();
      setLoading(false);
      return shortUrl;
    } catch (err) {
      setError(err.message || "Error shortening URL");
      setLoading(false);
      throw err;
    }
  }, []);

  return { shortenUrl, loading, error };
};
