# 202. Happy Number

**Difficulty:** `Easy`  
**Language:** `Java`  
**Date Solved:** `2026-11-25`  

---

## Solution

See `Solution.java`

---

## AI Explanation

## Approach
This solution leverages Floyd's Cycle-Finding Algorithm (the "tortoise and hare" method). It maintains two pointers, `slow` and `fast`, which repeatedly apply the `sumDigit` function. The `slow` pointer advances one step at a time, while the `fast` pointer advances two steps. If the number is happy, one of the pointers will eventually reach 1; if unhappy, the sequence will enter a cycle, and `fast` will eventually meet `slow` within that cycle (without reaching 1).

## Time Complexity
**O(log N)**. The `sumDigit` function takes `O(log N)` time because it processes each digit of `n`. The sequence of numbers generated quickly reduces to values less than a small constant (e.g., < 243 for numbers `> 99`). Therefore, the number of iterations in the `do-while` loop is bounded by a constant, making the dominant factor the initial `log N` reduction for the input `N`.

## Space Complexity
**O(1)**. The solution uses a fixed number of variables (`fast`, `slow`, `sun`, `temp`) regardless of the input `N`. No additional data structures are used.

## Key Takeaway
The key takeaway is to recognize that problems involving sequences that either terminate or repeat can often be solved efficiently using **Floyd's Cycle-Finding Algorithm (fast and slow pointers)**. This technique avoids the need for auxiliary space (like a `HashSet`) to detect cycles, making it a valuable optimization for space-constrained scenarios.

---

Generated automatically by LeetCode AutoSync AI.
