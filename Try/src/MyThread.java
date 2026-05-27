public class MyThread extends Thread {
    BankAccount account;
    int amount;

    public MyThread(BankAccount account,int amount) {
        this.amount = amount;
        this.account = account;
    }

    @Override
    public void run() {
        account.withdraw(amount);
    }
}
