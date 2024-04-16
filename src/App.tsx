import { useState, useEffect, useRef } from "react";
import CustomWorker from "./worker?worker";
import "./App.css";

const worker = new CustomWorker();
function App() {
  const [grid, setGrid] = useState<Array<Array<string>> | undefined>(undefined);
  const mousedownRef = useRef(false);
  const mouseupRef = useRef(true);
  const [wordSelection, setWordSelection] = useState<
    Array<[string, number, number]>
  >([]);
  useEffect(() => {
    worker.onmessage = (e) => {
      setGrid(e.data);
    };
  }, []);
  useEffect(() => {
    console.log(wordSelection);
  }, [wordSelection]);
  return (
    <div className="container">
      {grid?.map((row, ridx) =>
        row.map((wl, cidx) => (
          <div
            key={`${ridx}-${cidx}`}
            onMouseDown={() => {
              let idxF = wordSelection.findIndex(
                (e: [string, number, number]) =>
                  e[0] === wl && e[1] === ridx && e[2] === cidx,
              );
              if (idxF !== -1) {
                setWordSelection((p) => {
                  let newWordSelection = [...p];
                  newWordSelection.splice(idxF + 1);
                  return newWordSelection;
                });
              } else {
                setWordSelection((p) => {
                  let newWordSelection: Array<[string, number, number]> = [
                    ...p,
                    [wl, ridx, cidx],
                  ];
                  return newWordSelection;
                });
              }
              mousedownRef.current = true;
            }}
            onMouseEnter={() => {
              if (mousedownRef.current) {
                let idxF = wordSelection.findIndex(
                  (e: [string, number, number]) =>
                    e[0] === wl && e[1] === ridx && e[2] === cidx,
                );
                if (idxF !== -1) {
                  setWordSelection((p) => {
                    let newWordSelection = [...p];
                    newWordSelection.splice(idxF + 1);
                    return newWordSelection;
                  });
                } else {
                  setWordSelection((p) => {
                    let newWordSelection: Array<[string, number, number]> = [
                      ...p,
                      [wl, ridx, cidx],
                    ];
                    return newWordSelection;
                  });
                }
              }
            }}
            onMouseUp={() => {
              if (mousedownRef.current) {
                mouseupRef.current = true;
                mousedownRef.current = false;
              }
            }}
            style={{
              gridRow: `${ridx + 1}/${ridx + 1}`,
              gridColumn: `${cidx + 1}/${cidx + 1}`,
              color: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              userSelect: "none",
              backgroundColor:
                wordSelection.find(
                  (e) => e[0] === wl && e[1] === ridx && e[2] === cidx,
                ) !== undefined
                  ? "lightgray"
                  : "",
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
