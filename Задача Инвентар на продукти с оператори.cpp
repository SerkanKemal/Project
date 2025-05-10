// Задача Инвентар на продукти с оператори.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Product {
public:
    string name;
    double price;
    int quantity;

    Product(string n,double p, int q) {
        name = n;
        price = p;
        quantity = q;
    }

    bool operator==(const Product& other) const {
        return name == other.name && price == other.price;
    }

    double GetTotalValue() const {
        return price * quantity;
    }

    void printinfo() {
        cout << "Name: " << name << " Price: " << price << endl;
    }

};

ostream& operator<<(ostream& os, const Product& p) {
    os << "Product: " << p.name << ", Price: " << p.price;
    return os;
}

int main()
{
    vector<Product> products = {
        Product("Keyboard",10.99,10),
        Product("Keyboard",10.99,10),
        Product("Mouse",9.99,12),
        Product("PC",119.99,6),
        Product("MousePad",4.99,20),
    };

    cout << "All Products: " << endl;

    for (int i = 0; i < products.size(); i++) {
        cout << products.at(i) << endl;
    }

    bool foundByNameAndPrice = false;

    for (int i = 0; i < products.size(); i++) {
        for (int j = i + 1; j < products.size(); j++) {
            if (products.at(i) == products.at(j)) {
                cout << "These products are same: " << endl;
                cout << products.at(i) << endl;
                cout << products.at(j) << endl;
                foundByNameAndPrice = true;
            }
        }
    }

    if (!foundByNameAndPrice) {
        cout << "No same producst" << endl;
    }

    double totalSum = 0;

    for (int i = 0; i < products.size(); i++) {
        totalSum = totalSum + products.at(i).GetTotalValue();
    }

    cout << totalSum;

    return 0;
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
