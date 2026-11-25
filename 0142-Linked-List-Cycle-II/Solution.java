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
    public ListNode detectCycle(ListNode head) {
        ListNode s = head;
        ListNode f = head;
        int len = 0;
        while(f != null && f.next != null){
            s = s.next;
            f = f.next.next;
            if(s == f){
                len = LengthCycle(s);
                break;
            }
        }
        if(len == 0){
            return null;
        }
        ListNode first = head;
        ListNode second = head;
        while(len > 0){
            second = second.next;
            len--;
        }
        while(first != second){
            first = first.next;
            second = second.next;
        }
        return first;
    }
    public int LengthCycle(ListNode node){
        int len = 1;
        ListNode current = node.next;
        while(current != node){
            len++;
            current = current.next;
        }
        return len;
    }
}