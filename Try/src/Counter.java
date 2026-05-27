import java.util.concurrent.locks.ReentrantLock;

public class Counter {
    private int count;

    ReentrantLock lock = new ReentrantLock();

    public Counter() {
        this.count = 0;
    }

    public void increment() {

        lock.lock();

        try {
            count++;
        } finally {
            lock.unlock();
        }
    }

    public int getCount() {
        return count;
    }
}
