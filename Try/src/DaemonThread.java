public class DaemonThread extends Thread {
    @Override
    public void run() {
        while(true) {
            System.out.println("Daemon Thread is running...");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
