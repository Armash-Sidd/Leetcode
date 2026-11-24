/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        HashSet<Integer> set = new HashSet<>();
        ListNode temp = head;
        while(temp.next != null){
            if(set.contains(temp.val)) return true;
            set.add(temp.val);
            temp = temp.next;
        }
        return false;
    }
}