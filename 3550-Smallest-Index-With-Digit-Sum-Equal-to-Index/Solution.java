class Solution {
    public int smallestIndex(int[] nums) {
        for(int i = 0; i < nums.length; i++){
            if(count(nums[i]) == i) return i;
        }
        return -1;
    }
    public int count(int num){
        int sum = 0;
        while(num > 0){
            int temp = num % 10;
            sum += temp;
            num /= 10;
        }
        return sum;
    }
}