// Задача Управление на инвентар в склад.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <string>
#include <vector>

using namespace std;

class item {
public:
    string name;
    double price;
    int quantity;

    item(string n, double p, int q) {
        name = n;
        price = p;
        quantity = q;
    }

    void printinfo() {
        cout << "|Item:" << name << "|Price:" << price << "|Quantity:" << quantity << endl;
    }

    bool isLowStock(int kolicestvo) {
        return quantity < kolicestvo;
    }

    double TotalValue() const {
        return price * quantity;
    }

    bool foundByName(const string& name2) const {
        return name == name2;
    }
};

int main()
{
    vector<item> items = {
     item("Mouse",20,10),
     item("Monitor",100,20),
     item("PC",500,100),
     item("Keyboard",80,15),
     item("Mic",90,20)
    };

    int kolicestvo;
    cout << "How much threshold: ";
    cin >> kolicestvo;

    bool foundkolicestvo = false;

    cout << "Result for threshold: " << endl;

    for (int i = 0; i < items.size(); i++) {
        if (items.at(i).isLowStock(kolicestvo)) {
            items.at(i).printinfo();
            foundkolicestvo = true;
        }
    }
    if (!foundkolicestvo) {
        cout << "No items below threshold!" << endl;
    }

    double total = 0;

    for (int i = 0; i < items.size(); i++) {
        total = total + items.at(i).TotalValue();
    }
    cout << "Total is: " << total << endl;

    string name2;
    cout << "Enter item ur looking for: ";
    cin >> name2;

    bool foundByName2 = false;

    cout << "Result from searching by name: " << endl;
    for (int i = 0; i < items.size(); i++) {
        if (items.at(i).foundByName(name2)) {
            items.at(i).printinfo();
            foundByName2 = true;
        }
    }
    if (!foundByName2) {
        cout << "There is no item by this name: " << endl;
    }
   
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
