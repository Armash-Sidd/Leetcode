class Solution {
    public int largestInteger(int[] nums, int k) {
        int ans = Integer.MIN_VALUE;
        int n = nums.length;
        int ans2 = 0;
        if(nums[0] > nums[n-1]){
            ans = nums[0];
            ans2 = nums[n-1];
        }else if(nums[0] == nums[n-1]){
            return -1;
        }
        else{
            ans = nums[n-1];
            ans2 = nums[0];
        }
        boolean check = false;
        for(int i = 1; i < n-1 ;i++){
            if(nums[i] == ans){
                ans = ans2;
                check = true;
                break;
            }
        }
        if(check){
            for(int i = 1 ; i < n-1; i++){
                if(nums[i] == ans2){
                    return -1;
                }
            }
        }
        return ans;
    }
}