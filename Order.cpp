#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Order {
public:
    string productName;
    int quantity;
    double unitPrice;

    Order(string pn, int q, double up) {
        productName = pn;
        quantity = q;
        unitPrice = up;
    }

    double getTotalPrice() const {
        return quantity * unitPrice;
    }

    bool operator==(const Order& other) const {
        return productName == other.productName;
    }

    void printInfo() const {
        cout << "Product: " << productName << " Quantity: " << quantity << " UnitPrice: " << unitPrice << endl;
    }
};

ostream& operator<<(ostream& os, const Order& o) {
    os << "Product: " << o.productName << " Quantity: " << o.quantity << " UnitPrice: " << o.unitPrice;
    return os;
}

class Client {
public:
    string name;
    vector<Order> orders;

    Client(string n) {
        name = n;
    }

    void addOrder(Order o) {
        orders.push_back(o);
    }

    void printAllOrders() {
        cout << "Orders for client: " << name << endl;
        for (int i = 0; i < orders.size(); i++) {
            cout << orders.at(i) << endl;
        }
    }

    void printDuplicateOrders() {
        bool found = false;
        for (int i = 0; i < orders.size(); i++) {
            for (int j = i + 1; j < orders.size(); j++) {
                if (orders.at(i) == orders.at(j)) {
                    cout << "Duplicate order found: " << endl;
                    orders.at(i).printInfo();
                    orders.at(j).printInfo();
                    found = true;
                }
            }
        }
        if (!found) {
            cout << "No duplicate orders found." << endl;
        }
    }

    double getTotalSpent() {
        double sum = 0;
        for (int i = 0; i < orders.size(); i++) {
            sum = sum + orders.at(i).getTotalPrice();
        }
        return sum;
    }
};

int main()
{
    Client c("Ivan");

    c.addOrder(Order("Laptop", 1, 999.99));
    c.addOrder(Order("Mouse", 2, 25.50));
    c.addOrder(Order("Mouse", 1, 25.50));
    c.addOrder(Order("Keyboard", 1, 45.00));

    c.printAllOrders();
    c.printDuplicateOrders();
    cout << "Total spent: " << c.getTotalSpent() << " лв" << endl;

    return 0;
}
