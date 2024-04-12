// y, x is the order for directions
const directions = [
  [-1, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
function dfsArea(grid: Array<Array<string | undefined>>, row: number, col: number, visited: Array<[number, number]>) {
  if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length || grid[row][col] !== undefined || visited.find(e => e[0] === row && e[1] === col) !== undefined) return;
  visited.push([row, col]);
  for (const dir of directions) {
    dfsArea(grid, row + dir[0], col + dir[1], visited);
  }
}
function dfsDirections(
  grid: Array<Array<string | undefined>>,
  word: string,
  wordIdx: number,
  row: number,
  col: number,
  currentPath: Array<[number, number]>,
  paths: Array<Array<[number, number]>>,
) {
  if (
    row < 0 ||
    col < 0 ||
    row >= grid.length ||
    col >= grid[0].length ||
    grid[row][col] !== undefined ||
    currentPath.find((e) => e[0] === row && e[1] === col) !== undefined ||
    paths.length >= 500
  ) {
    return;
  }
  currentPath.push([row, col]);
  if (wordIdx === word.length - 1) {
    paths.push(structuredClone(currentPath));
    return;
  }
  for (const dir of directions) {
    dfsDirections(
      grid,
      word,
      wordIdx + 1,
      row + dir[0],
      col + dir[1],
      structuredClone(currentPath),
      paths,
    );
  }
}
function placeWords(
  grid: Array<Array<string | undefined>>,
  words: Array<string>,
  finalGrid: Record<"finalResult", Array<Array<string | undefined>> | undefined>,
): boolean {
  let visited: Array<[number, number]> = [];
  for (let r = 0; r < 13; ++r) {
    for (let c = 0; c < 9; ++c) {
      if (grid[r][c] === undefined && visited.find(e => e[0] === r && e[1] === c) === undefined) {
        dfsArea(grid, r, c, visited);
        if (visited.length < words.reduce((a, e) => Math.min(a, e.length), Infinity)) {
          return false;
        }
      }
    }
  }
  for (let r = 0; r < 13; ++r) {
    for (let c = 0; c < 9; ++c) {
      if (grid[r][c] !== undefined) continue;
      const word = words[Math.floor(Math.random() * words.length)];
      let paths: Array<Array<[number, number]>> = [];
      dfsDirections(grid, word, 0, r, c, [], paths);
      if (paths.length === 0) return false;
      const path = paths[Math.floor(Math.random() * paths.length)];
      const gridClone = structuredClone(grid);
      for (let i = 0; i < word.length; ++i) {
        gridClone[path[i][0]][path[i][1]] = word[i];
      }
      const validPlacement = placeWords(gridClone, words.filter(w => w !== word), finalGrid);
      if (validPlacement) {
        if (finalGrid.finalResult === undefined)
          finalGrid.finalResult = structuredClone(gridClone);
        return true;
      }
      return false;
    }
  }
  for (let r = 0; r < 13; ++r) {
    for (let c = 0; c < 9; ++c) {
      if (grid[r][c] === undefined) {
        return false;
      }
    }
  }
  return true;
}
function groupWords13x9(
  group: Array<string>,
  words: Array<string>,
  finalGrouping: Record<"finalGroup", Array<string>>,
): boolean {
  const wordLengthTotal = group.reduce((wL, c) => wL + c.length, 0);
  const idx = Math.floor(Math.random() * words.length);
  if (wordLengthTotal + words[idx].length > 13 * 9) {
    return false;
  }
  if (wordLengthTotal === 13 * 9) {
    return true;
  }
  group.push(words[idx]);
  const validGroup = groupWords13x9(group, words, finalGrouping);
  if (validGroup) {
    finalGrouping.finalGroup = group;
  }
  return validGroup;
}
function generateGrid(nrow: number, ncol: number) {
  let grid = new Array(nrow);
  for (let i = 0; i < nrow; ++i) {
    grid[i] = new Array(ncol);
  }
  return grid;
}
fetch("/wordlist.txt")
  .then((res) => res.text())
  .then((words) => {
    const wordsSplit = words.split("\n").map((w) => w.slice(1, w.length - 1));
    const grid: Array<Array<string | undefined>> = new Array(13);
    for (let i = 0; i < 13; ++i) {
      grid[i] = new Array(9);
    }
    const finalGrouping: Record<"finalGroup", Array<string>> = {
      finalGroup: [],
    };
    while (!groupWords13x9([], wordsSplit, finalGrouping));
    const finalGrid: Record<"finalResult", Array<Array<string | undefined>> | undefined> = {
      finalResult: undefined,
    };
    console.log(finalGrouping.finalGroup.sort());
    while (!placeWords(grid, finalGrouping.finalGroup, finalGrid));
    postMessage(finalGrid.finalResult);
  });
