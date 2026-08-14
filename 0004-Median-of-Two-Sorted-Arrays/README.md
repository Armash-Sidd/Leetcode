# 4. Median of Two Sorted Arrays

**Difficulty:** `Hard`  
**Language:** `Java`  
**Date Solved:** `2026-08-14`  

---

## Solution

See `Solution.java`

---

## AI Explanation

It appears the code snippet for analysis is missing (provided as just `c`). Therefore, I will provide an analysis based on the *optimal* binary search approach typically used to solve the "Median of Two Sorted Arrays" problem, as that is what a Computer Science expert would expect.

---

## Approach
This solution uses a binary search strategy to find the correct partition point in the *shorter* of the two arrays. The goal is to divide both arrays into left and right halves such that: 1) the total number of elements in the left halves equals `(m+n+1)/2`, and 2) all elements in the left halves are less than or equal to all elements in the right halves. Once these conditions are met, the median can be determined from the maximum of the left halves and the minimum of the right halves, handling both odd and even total lengths.

## Time Complexity
**O(log(min(m, n)))**
The algorithm performs a binary search on the shorter of the two arrays. In each step, the search space is halved, leading to a logarithmic time complexity. The comparisons and calculations within each step are constant time operations.

## Space Complexity
**O(1)**
The solution uses only a few auxiliary variables to store partition indices, values, and boundary conditions, regardless of the input array sizes. It does not create any new data structures proportional to the input size.

## Key Takeaway
This problem is a classic example of applying binary search to find a "partition" rather than a specific value. A crucial interview tip is to correctly handle edge cases where a partition index might be 0 or `array.length`, effectively treating elements beyond the partition as `Integer.MIN_VALUE` or `Integer.MAX_VALUE` to simplify boundary checks. Also, remember to correctly calculate the median for both odd and even total numbers of elements.

---

Generated automatically by LeetCode AutoSync AI.
