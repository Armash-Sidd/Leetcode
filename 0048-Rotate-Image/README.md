# 48. Rotate Image

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-08-15`  

---

## Solution

See `Solution.java`

---

## AI Explanation

```markdown
## Approach
This solution rotates the image 90 degrees clockwise by performing two transformations in-place. First, it transposes the matrix by swapping `matrix[i][j]` with `matrix[j][i]` for all `i <= j`. Second, it reverses each row of the now-transposed matrix by swapping elements from the left and right ends of each row until the pointers meet.

## Time Complexity
**O(N^2)**, where N is the dimension of the square matrix.
The first step (transposing) involves iterating through roughly half of the matrix elements and performing swaps, taking O(N^2) time. The second step (reversing each row) iterates through all N rows, performing N/2 swaps for each row, also taking O(N^2) time.

## Space Complexity
**O(1)**
The solution performs all operations directly on the input matrix without allocating any significant additional data structures. Only a few temporary variables are used for swaps and loop control.

## Key Takeaway
This solution showcases an elegant and efficient in-place method for rotating a square matrix. The combination of transposing followed by reversing rows is a standard pattern to achieve a 90-degree clockwise rotation, often favored in interviews for its optimal space complexity.
```

---

Generated automatically by LeetCode AutoSync AI.
