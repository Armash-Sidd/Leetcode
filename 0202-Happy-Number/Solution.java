class Solution {
    public boolean isHappy(int n) {
        int fast = n;
        int slow = n;
        do{
            slow = sumDigit(slow);
            fast = sumDigit(sumDigit(fast));
            if(fast == 1 || slow == 1){
                return true;
            }
        }while(fast != slow);
        return false;
    }
    public int sumDigit(int n){
        int sun = 0;
        while(n > 0){
            int temp = n%10;
            sun += (temp*temp);
            n /= 10;
        }
        return sun;
    }
}