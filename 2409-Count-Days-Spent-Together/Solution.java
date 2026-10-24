class Solution {
    public int countDaysTogether(String arriveAlice, String leaveAlice, String arriveBob, String leaveBob) {
        int[] days = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
        int monAliceArrive = Integer.parseInt(arriveAlice.substring(0, 2));
        int dayAliceArrive = Integer.parseInt(arriveAlice.substring(3, 5));
        for(int i = 0; i < monAliceArrive-1; i++){
            dayAliceArrive += days[i];
        }
        int monAliceLeave = Integer.parseInt(leaveAlice.substring(0, 2));
        int dayAliceLeave = Integer.parseInt(leaveAlice.substring(3, 5));
        for(int i = 0; i < monAliceLeave-1; i++){
            dayAliceLeave += days[i];
        }
        int monBobArrive = Integer.parseInt(arriveBob.substring(0, 2));
        int dayBobArrive = Integer.parseInt(arriveBob.substring(3, 5));
        for(int i = 0; i < monBobArrive-1; i++){
            dayBobArrive += days[i];
        }
        int monBobLeave = Integer.parseInt(leaveBob.substring(0, 2));
        int dayBobLeave = Integer.parseInt(leaveBob.substring(3, 5));
        for(int i = 0; i < monBobLeave-1; i++){
            dayBobLeave += days[i];
        }
        int start = Math.max(dayAliceArrive, dayBobArrive);
        int end = Math.min(dayAliceLeave, dayBobLeave);
        if(start >= end){
            return 0;
        }else{
            return (end - start + 1);
        }
    }
}