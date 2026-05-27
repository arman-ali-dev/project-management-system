import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Deadlock {
    Lock lock = new ReentrantLock();

    public void outer() {
        lock.lock();

        try {
            System.out.println("Outer Method");
            inner();
        } finally {
            lock.unlock();
        }
    }

    public void inner() {
        lock.lock();

        try {
            System.out.println("Inner Lock");
        } finally {
            lock.unlock();
        }
    }


}
