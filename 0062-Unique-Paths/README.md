# 62. Unique Paths

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-10-13`  

---

## Solution

See `Solution.java`

---

## AI Explanation

```markdown
## Approach
This solution uses a brute-force recursive approach to count unique paths. It determines the number of paths to a cell `(r, col)` by summing the paths from the cell directly above `(r-1, col)` and the cell directly to its left `(r, col-1)`. Base cases handle reaching the starting cell (1 path) or going out of bounds (0 paths).

## Time Complexity
**O(2^(m+n))**
The recursive function recomputes the same subproblems multiple times without memoization, leading to an exponential growth in the number of calls. For a grid of size `m x n`, the total number of operations grows exponentially with the sum of dimensions.

## Space Complexity
**O(m+n)**
This is due to the recursion stack depth. To reach the target cell `(m-1, n-1)` from `(0,0)`, the maximum path length (and thus the maximum recursion depth) is `(m-1) + (n-1) = m+n-2`.

## Key Takeaway
This solution, while conceptually correct, is highly inefficient and would likely result in a "Time Limit Exceeded" (TLE) error for any non-trivial input on platforms like LeetCode. It's a classic example demonstrating the critical need for **memoization or dynamic programming** to optimize recursive solutions with overlapping subproblems, preventing redundant computations.
```

---

Generated automatically by LeetCode AutoSync AI.
