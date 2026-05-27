import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class BankAccount {
    private int balance = 10000;
    Lock lock = new ReentrantLock();

    public void withdraw(int amount) {
        System.out.println(Thread.currentThread().getName() + " is trying to withdrawal");

        try {
            if (lock.tryLock(3, TimeUnit.SECONDS)) {
                try {
                    System.out.println(Thread.currentThread().getName() + " is processing...");

                    Thread.sleep(2000);

                    System.out.println("withdrawal is completed...");
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } finally {
                    lock.unlock();
                }
            } else {
                System.out.println("lock is acquired. do something else");
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public int getBalance() {
        return balance;
    }


}
