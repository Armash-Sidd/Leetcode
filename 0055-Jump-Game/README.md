# 55. Jump Game

**Difficulty:** `Medium`  
**Language:** `Java`  
**Date Solved:** `2026-08-15`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
This solution uses a greedy approach to determine if the end of the array can be reached. It maintains a variable `max` which tracks the farthest index reachable from any position encountered so far. The algorithm iterates through the array, checking if the current index `i` is beyond `max`. If it is, the end cannot be reached; otherwise, `max` is updated with the farthest point reachable from the current position (`i + nums[i]`). If `max` ever reaches or surpasses the last index (`n-1`), the target is reachable.

## Time Complexity
The time complexity is **O(N)**, where N is the number of elements in the `nums` array. The solution iterates through the array exactly once, performing constant-time operations within each loop iteration.

## Space Complexity
The space complexity is **O(1)**. The solution uses a fixed number of variables (`n`, `max`, `i`) to store state, irrespective of the input array size.

## Key Takeaway
This solution effectively demonstrates the greedy strategy for "Jump Game". The critical insight is that you only need to keep track of the *farthest possible reach* from any point you've visited so far. The `if (i > max)` condition is crucial for correctly identifying scenarios where the current position is unreachable, preventing further unnecessary computations and returning `false` early.

---

Generated automatically by LeetCode AutoSync AI.
