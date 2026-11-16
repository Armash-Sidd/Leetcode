# 2243. Calculate Digit Sum of a String

**Difficulty:** `Hard`  
**Language:** `Java`  
**Date Solved:** `2026-11-16`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
The solution iteratively transforms the input string until its length is less than or equal to `k`. In each round, it divides the current string into non-overlapping substrings of length `k` (the last one might be shorter). For each substring, it calculates the sum of its digits, then concatenates these sums to form a new string, which replaces the current string for the next round. This process continues until the string length satisfies the condition.

## Time Complexity
**O(N)**, where N is the initial length of the string `s`.
Each round iterates through the current string, performing character-to-integer conversions and sums (total O(L) for a string of length L). The string concatenation `temp += sum` within the loop is efficiently handled by Java's compiler, which implicitly uses a `StringBuilder` for such operations, making string building amortized O(L_new) where L_new is the length of the new string. While the string length might not decrease in every single round (e.g., for `k=2` and "99" becoming "18"), the nature of digit sums guarantees a significant reduction over a few rounds. The total work across all rounds forms a converging geometric series, summing up to O(N).

## Space Complexity
**O(N)**, where N is the initial length of the string `s`.
In each iteration of the `while` loop, a new `temp` string is constructed. In the worst case (e.g., `k=2` and many digits sum to numbers like "18"), this `temp` string can be as long as the original string `s` from that round. Since `s` is updated with `temp`, at most O(N) extra space is used for storing the `temp` string at any given time.

## Key Takeaway
The solution leverages Java's efficient handling of string concatenations within a loop. While `temp += sum` might seem like an expensive `O(M)` operation (where M is current `temp` length), the Java compiler typically optimizes this pattern to use a `StringBuilder` internally, ensuring that the total cost for building the `temp` string in one round is `O(L_new)` (where `L_new` is the final length of `temp`), rather than `O(L_new^2)`.

---

Generated automatically by LeetCode AutoSync AI.
