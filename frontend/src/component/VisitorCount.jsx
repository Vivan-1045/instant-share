import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles.css";


const apiBase = import.meta.env.VITE_API_URL;

function VisitorCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios.get(`${apiBase}/api/visitor/track`)
      .then((res) => {
        setCount(res.data.total);
      })
      .catch(() => setCount(null));
  }, []);
  
  return (
     <p className="visitor">
      ✅ Trusted by <span className="visitor-count">{count || "..."}+</span> users
    </p>
  );
}

export default VisitorCount;
