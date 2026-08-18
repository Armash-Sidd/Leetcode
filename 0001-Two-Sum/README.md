# 1. Two Sum

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-08-18`  

---

## Solution

See `Solution.java`

---

## AI Explanation

```markdown
## Approach
This solution uses a hash map to efficiently find the required complement for each number. It iterates through the array, and for each element, it calculates the "needed" value to reach the target. If this needed value is already present in the map (meaning it was encountered earlier), the indices of both numbers are returned. Otherwise, the current number and its index are added to the map.

## Time Complexity
**O(N)**. The algorithm iterates through the `nums` array once. Hash map operations (`put`, `containsKey`, `get`) take average O(1) time. Thus, the total time complexity is linear with respect to the number of elements in the input array.

## Space Complexity
**O(N)**. In the worst case, the hash map may store all `N` elements from the `nums` array (e.g., if no pair is found until the very last element, or if all elements are unique). Each entry in the map stores an integer and its index.

## Key Takeaway
This solution demonstrates the optimal approach for "Two Sum" by leveraging a hash map to reduce the time complexity from O(N^2) (brute-force) to O(N). This is a crucial technique in interviews: always consider using hash maps/sets when you need to perform quick lookups (O(1) average time) for previously seen elements or their properties.
```

---

Generated automatically by LeetCode AutoSync AI.
