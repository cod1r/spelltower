import { useState, useEffect } from "react";
import CustomWorker from "./worker?worker";
import "./App.css";

const worker = new CustomWorker();
function App() {
  const [grid, setGrid] = useState<Array<Array<string>> | undefined>(undefined);
  useEffect(() => {
    worker.onmessage = (e) => {
      setGrid(e.data);
    };
  }, []);
  return (
    <div className="container">
      {grid?.map((row, ridx) =>
        row.map((wl, cidx) => (
          <div
            key={`${ridx}-${cidx}`}
            onClick={(e) => {
              if (e.currentTarget.style.backgroundColor.length > 0) {
                e.currentTarget.style.backgroundColor = "";
                return;
              }
              e.currentTarget.style.backgroundColor = "lightgray";
            }}
            style={{
              gridRow: `${ridx + 1}/${ridx + 1}`,
              gridColumn: `${cidx + 1}/${cidx + 1}`,
              color: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {wl}
          </div>
        )),
      )}
    </div>
  );
}

export default App;
