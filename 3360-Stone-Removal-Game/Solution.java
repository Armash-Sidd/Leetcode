class Solution {
    public boolean canAliceWin(int n) {
        if(n < 10){
            return false;
        }
        int remove = 9;
        n -= 10;
        int i = 1;
        while(n > remove){
            n -= remove;
            remove--;
            i++;
        }
        if(i % 2 == 0){
            return false;
        }
        return true;
    }
}