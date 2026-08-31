# 36. Valid Sudoku

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-08-31`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution validates a Sudoku board by iterating through each cell and ensuring no digit (1-9) appears more than once in its respective row, column, or 3x3 sub-box. It uses three arrays of hash sets: one for rows, one for columns, and one for 3x3 boxes. For each non-empty cell, it checks if the digit is already present in the corresponding hash set for its row, column, and calculated box index. If a duplicate is found, it immediately returns `false`; otherwise, the digit is added to all three relevant hash sets.

## Time Complexity
**O(1)**.
The board size is fixed at 9x9. The solution iterates through all 81 cells once. Inside the loop, hash set `add()` and `contains()` operations take average O(1) time. Therefore, the total time complexity is proportional to 9 * 9, which is a constant, resulting in O(1). (If generalized for an N x N board, it would be O(N^2)).

## Space Complexity
**O(1)**.
The solution uses three arrays, each of size 9, to store `HashSet` objects. Each hash set will store at most 9 unique characters ('1'-'9'). Since the board dimensions and the maximum number of digits are fixed constants, the total memory consumption for these data structures is constant, hence O(1). (If generalized for an N x N board, it would be O(N) because there are N rows, N columns, and N 'boxes', each needing a hash set).

## Key Takeaway
This solution effectively utilizes hash sets to provide **average O(1) time complexity for duplicate checking** in rows, columns, and sub-boxes. The crucial part is the clever formula `(i / 3) * 3 + (j / 3)` to map any `(i, j)` cell to its correct 0-8 index for the 3x3 sub-boxes.

---

Generated automatically by LeetCode AutoSync AI.
