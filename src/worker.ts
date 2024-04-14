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
function dfsArea(
  grid: Array<Array<string | undefined>>,
  row: number,
  col: number,
  visited: Array<[number, number]>,
) {
  if (
    row < 0 ||
    col < 0 ||
    row >= grid.length ||
    col >= grid[0].length ||
    grid[row][col] !== undefined ||
    visited.find((e) => e[0] === row && e[1] === col) !== undefined
  )
    return;
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
    currentPath.find((e) => e[0] === row && e[1] === col) !== undefined
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
function pushUp(
  grid: Array<Array<string | undefined>>,
  wordGroups: Array<Record<string, Array<[number, number]>>>,
): boolean {
  for (const record of wordGroups) {
    let word = Object.keys(record);
    let firstRecord = record[word[0]];
    for (let coord of firstRecord) {
      let col = coord[1];
      for (let row = grid.length - 1; row >= 0; --row) {
        if (grid[row][col] === undefined) {
          for (let rr = row + 1; rr < grid.length; ++rr) {
            if (rr === coord[0]) {
              --coord[0];
            }
            let temp = grid[rr - 1][col];
            grid[rr - 1][col] = grid[rr][col];
            grid[rr][col] = temp;
          }
        }
      }
    }
    for (let i = 1; i < firstRecord.length; ++i) {
      let diff_x = Math.abs(firstRecord[i][1] - firstRecord[i - 1][1]);
      let diff_y = Math.abs(firstRecord[i][0] - firstRecord[i - 1][0]);
      let manhatten_dist = diff_x + diff_y;
      if (manhatten_dist > 1) {
        return false;
      }
    }
  }
  return true;
}
function pushDown(
  grid: Array<Array<string | undefined>>,
  wordGroups: Array<Record<string, Array<[number, number]>>>,
): boolean {
  for (const record of wordGroups) {
    let word = Object.keys(record);
    let firstRecord = record[word[0]];
    for (let coord of firstRecord) {
      let col = coord[1];
      for (let row = 0; row < grid.length; ++row) {
        if (grid[row][col] === undefined) {
          for (let rr = row - 1; rr >= 0; --rr) {
            if (rr === coord[0]) {
              ++coord[0];
            }
            let temp = grid[rr + 1][col];
            grid[rr + 1][col] = grid[rr][col];
            grid[rr][col] = temp;
          }
        }
      }
    }
    for (let i = 1; i < firstRecord.length; ++i) {
      let diff_x = Math.abs(firstRecord[i][1] - firstRecord[i - 1][1]);
      let diff_y = Math.abs(firstRecord[i][0] - firstRecord[i - 1][0]);
      let manhatten_dist = diff_x + diff_y;
      if (manhatten_dist > 1) {
        return false;
      }
    }
  }
  return true;
}
function pushLeft(
  grid: Array<Array<string | undefined>>,
  wordGroups: Array<Record<string, Array<[number, number]>>>,
) {
  for (const record of wordGroups) {
    let word = Object.keys(record);
    let firstRecord = record[word[0]];
    for (let coord of firstRecord) {
      let row = coord[0];
      for (let col = grid[0].length - 1; col >= 0; --col) {
        if (grid[row][col] === undefined) {
          for (let cc = col + 1; cc < grid[0].length; ++cc) {
            if (cc === coord[1]) {
              --coord[1];
            }
            let temp = grid[row][cc - 1];
            grid[row][cc - 1] = grid[row][cc];
            grid[row][cc] = temp;
          }
        }
      }
    }
    for (let i = 1; i < firstRecord.length; ++i) {
      let diff_x = Math.abs(firstRecord[i][1] - firstRecord[i - 1][1]);
      let diff_y = Math.abs(firstRecord[i][0] - firstRecord[i - 1][0]);
      let manhatten_dist = diff_x + diff_y;
      if (manhatten_dist > 1) {
        return false;
      }
    }
  }
  return true;
}
function pushRight(
  grid: Array<Array<string | undefined>>,
  wordGroups: Array<Record<string, Array<[number, number]>>>,
) {
  for (const record of wordGroups) {
    let word = Object.keys(record);
    let firstRecord = record[word[0]];
    for (let coord of firstRecord) {
      let row = coord[0];
      for (let col = 0; col < grid[0].length; ++col) {
        if (grid[row][col] === undefined) {
          for (let cc = col - 1; cc >= 0; --cc) {
            if (cc === coord[1]) {
              ++coord[1];
            }
            let temp = grid[row][cc + 1];
            grid[row][cc + 1] = grid[row][cc];
            grid[row][cc] = temp;
          }
        }
      }
    }
    for (let i = 1; i < firstRecord.length; ++i) {
      let diff_x = Math.abs(firstRecord[i][1] - firstRecord[i - 1][1]);
      let diff_y = Math.abs(firstRecord[i][0] - firstRecord[i - 1][0]);
      let manhatten_dist = diff_x + diff_y;
      if (manhatten_dist > 1) {
        return false;
      }
    }
  }
  return true;
}
function placeWords(
  grid: Array<Array<string | undefined>>,
  words: Array<string>,
  wordGroups: Array<Record<string, Array<[number, number]>>>,
  finalGrid: Record<
    "finalResult",
    Array<Array<string | undefined>> | undefined
  >,
  pushed: 'left' | 'right' | 'up' | 'down' | 'none'
): boolean {
  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid[0].length; ++c) {
      let visited: Array<[number, number]> = [];
      dfsArea(grid, r, c, visited);
      if (visited.length < words.reduce((a, e) => Math.min(a, e.length), Number.MAX_SAFE_INTEGER)) {
        return false;
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
      const gridClonePushLeft = structuredClone(grid);
      const gridClonePushRight = structuredClone(grid);
      const gridClonePushUp = structuredClone(grid);
      const gridClonePushDown = structuredClone(grid);
      for (let i = 0; i < word.length; ++i) {
        gridClonePushLeft[path[i][0]][path[i][1]] = word[i];
        gridClonePushRight[path[i][0]][path[i][1]] = word[i];
        gridClonePushUp[path[i][0]][path[i][1]] = word[i];
        gridClonePushDown[path[i][0]][path[i][1]] = word[i];
      }
      {
        let wordGroupsClone = structuredClone(wordGroups);
        wordGroupsClone.push({ word: structuredClone(path) });
        let validPushLeft = pushLeft(gridClonePushLeft, wordGroupsClone);
        if (validPushLeft) {
          const validPlacement = placeWords(
            gridClonePushLeft,
            words.filter((w) => w !== word),
            wordGroupsClone,
            finalGrid,
            'left'
          );
          if (validPlacement) {
            if (finalGrid.finalResult === undefined)
              finalGrid.finalResult = structuredClone(gridClonePushLeft);
            return true;
          }
        }
      }
      {
        let wordGroupsClone = structuredClone(wordGroups);
        wordGroupsClone.push({ word: structuredClone(path) });
        let validPushRight = pushRight(gridClonePushRight, wordGroupsClone);
        if (validPushRight) {
          const validPlacement = placeWords(
            gridClonePushRight,
            words.filter((w) => w !== word),
            wordGroupsClone,
            finalGrid,
            'right'
          );
          if (validPlacement) {
            if (finalGrid.finalResult === undefined)
              finalGrid.finalResult = structuredClone(gridClonePushRight);
            return true;
          }
        }
      }
      {
        let wordGroupsClone = structuredClone(wordGroups);
        wordGroupsClone.push({ word: structuredClone(path) });
        let validPushUp = pushUp(gridClonePushUp, wordGroupsClone);
        if (validPushUp) {
          const validPlacement = placeWords(
            gridClonePushUp,
            words.filter((w) => w !== word),
            wordGroupsClone,
            finalGrid,
            'up'
          );
          if (validPlacement) {
            if (finalGrid.finalResult === undefined)
              finalGrid.finalResult = structuredClone(gridClonePushUp);
            return true;
          }
        }
      }
      {
        let wordGroupsClone = structuredClone(wordGroups);
        wordGroupsClone.push({ word: structuredClone(path) });
        let validPushDown = pushDown(gridClonePushDown, wordGroupsClone);
        if (validPushDown) {
          const validPlacement = placeWords(
            gridClonePushDown,
            words.filter((w) => w !== word),
            wordGroupsClone,
            finalGrid,
            'down'
          );
          if (validPlacement) {
            if (finalGrid.finalResult === undefined)
              finalGrid.finalResult = structuredClone(gridClonePushDown);
            return true;
          }
        }
      }
    }
  }
  return false;
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
function spiralWords(
  grid: Array<Array<string | undefined>>,
  words: Array<string>,
) {
  let row = 0;
  let col = 0;
  let wordsConcatenated = words.reduce((a, e) => (a + e).toUpperCase());
  let cellsFilled = 0;
  let boundsSubtracted = 0;
  while (cellsFilled < 13 * 9) {
    grid[row][col] = wordsConcatenated[cellsFilled];
    if (
      col === grid[0].length - 1 - boundsSubtracted &&
      row !== grid.length - 1 - boundsSubtracted
    ) {
      row++;
    } else if (
      row === grid.length - 1 - boundsSubtracted &&
      col !== boundsSubtracted
    ) {
      col--;
    } else if (row === boundsSubtracted) {
      col++;
    } else if (col === boundsSubtracted) {
      row--;
    }
    if (row === boundsSubtracted && col === boundsSubtracted) {
      row++;
      col++;
      boundsSubtracted++;
    }
    cellsFilled++;
  }
}
fetch("/wordlist.txt")
  .then((res) => res.text())
  .then((words) => {
    const wordsSplit = words.split("\n").map((w) => w.slice(1, w.length - 1));
    const wordsFiltered = wordsSplit.filter((w) => w.length <= 7);
    const grid: Array<Array<string | undefined>> = new Array(13);
    for (let i = 0; i < 13; ++i) {
      grid[i] = new Array(9);
    }
    const finalGrouping: Record<"finalGroup", Array<string>> = {
      finalGroup: [],
    };
    while (!groupWords13x9([], wordsFiltered, finalGrouping));
    const finalGrid: Record<
      "finalResult",
      Array<Array<string | undefined>> | undefined
    > = {
      finalResult: undefined,
    };
    console.log(finalGrouping.finalGroup.sort());
    //while (!placeWords(grid, finalGrouping.finalGroup, [], finalGrid, 'none'));
    //postMessage(finalGrid.finalResult);
    spiralWords(grid, finalGrouping.finalGroup);
    postMessage(grid);
  });
