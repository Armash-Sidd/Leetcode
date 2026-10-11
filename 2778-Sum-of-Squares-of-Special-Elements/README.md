# 2778. Sum of Squares of Special Elements

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-10-11`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution iterates through the input array `nums` using a 0-based index `i`. For each element `nums[i]`, it checks if its corresponding 1-based index `(i+1)` is a divisor of the array's total length `n`. If the condition holds, the square of `nums[i]` is added to a running sum, which is returned at the end.

## Time Complexity
**O(n)** - The solution involves a single `for` loop that iterates through all `n` elements of the `nums` array exactly once. All operations inside the loop (modulo, multiplication, addition) are constant time operations.

## Space Complexity
**O(1)** - The solution uses a fixed number of integer variables (`n`, `ans`, `i`) to store the array length, the running sum, and the loop counter, respectively. These variables consume a constant amount of memory irrespective of the input array size.

## Key Takeaway
A crucial aspect is correctly translating 1-based indexing from the problem statement (e.g., "1-indexed position `i`") to the 0-based indexing commonly used in programming languages for arrays (`nums[i-1]` or, as done here, checking `(i+1)` for `nums[i]`). This solution effectively handles this by using `(i+1)` in the modulo operation.

---

Generated automatically by LeetCode AutoSync AI.
