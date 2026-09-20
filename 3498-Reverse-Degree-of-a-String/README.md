# 3498. Reverse Degree of a String

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-09-20`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
This solution first pre-computes a "reverse degree" value for each lowercase English letter, where 'a' maps to 26, 'b' to 25, and so on, down to 'z' mapping to 1. It then iterates through the input string. For each character, it retrieves its pre-computed reverse degree and multiplies it by the character's 1-indexed position in the string, accumulating these products to calculate the final "reverse degree" of the entire string.

## Time Complexity
**O(N)**, where N is the length of the input string `s`.
The initialization of the `arr` takes constant time (26 operations). The main loop iterates `N` times, performing constant-time operations (character access, array lookup, arithmetic) in each iteration. Thus, the dominant factor is the string traversal.

## Space Complexity
**O(1)**.
The solution uses a fixed-size array `arr` of 26 integers to store the reverse degrees, which is constant regardless of the input string's length. All other variables also consume constant space.

## Key Takeaway
This solution effectively uses a small, fixed-size array for **pre-computation and mapping**. By pre-calculating the "reverse degree" for each character, it ensures that lookups during the main string iteration are O(1), leading to an optimized overall time complexity. This pattern is useful when a small, known set of inputs (like all lowercase letters) has associated values that can be stored and accessed efficiently.

---

Generated automatically by LeetCode AutoSync AI.
