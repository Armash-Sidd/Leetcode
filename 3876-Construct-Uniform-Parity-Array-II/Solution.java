class Solution {
    public boolean uniformArray(int[] nums1) {
        long min = Long.MAX_VALUE;
        boolean odd = true;
        for(int i = 0; i < nums1.length; i++){
            if(nums1[i] < min){
                min = nums1[i];
            }
        }
        if(min % 2 == 0){
            odd = false;
        }
        if(odd){
            return true;
        }
        
        for(int i = 0; i < nums1.length; i++){
            if(nums1[i] % 2 != 0){
                return false;
            }    
        }
        return true;
    }
}