# 3903. Smallest Stable Index I

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-09-04`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution iterates through each possible index `i` from `0` to `n-1`, treating `i` as the potential "stable index". For each `i`, it calculates the maximum value in the prefix `nums[0...i]` and the minimum value in the suffix `nums[i...n-1]`. If the difference between this prefix maximum and suffix minimum is less than or equal to `k`, `i` is returned as the first stable index. If no such index is found after checking all possibilities, it returns -1.

## Time Complexity
**O(N^2)**.
The outer loop runs `N` times (for `i`). Inside this loop, there are two nested loops. The first inner loop iterates `i+1` times to find the prefix maximum, and the second inner loop iterates `n-i` times to find the suffix minimum. In the worst case (e.g., `i` is near `N/2`), each inner loop segment takes `O(N)` time, leading to `O(N)` work per outer loop iteration. Thus, `N * O(N)` results in `O(N^2)` total time.

## Space Complexity
**O(1)**.
The solution uses a fixed number of integer variables (`n`, `i`, `min`, `max`, `j`) regardless of the input array size. No auxiliary data structures are allocated that scale with `N`.

## Key Takeaway
This solution demonstrates a basic, brute-force approach. In an interview setting, while this correctly solves the problem, it's crucial to identify the `O(N^2)` bottleneck. An important optimization would be to precompute prefix maximums and suffix minimums in `O(N)` time, allowing the stability check for each `i` to be done in `O(1)`, leading to an overall `O(N)` time complexity.

---

Generated automatically by LeetCode AutoSync AI.
