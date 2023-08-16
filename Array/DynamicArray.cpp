#include <iostream>

template <typename T> class DynamicArray {
    private:
        T* arr;             // Pointer to the dynamic array
        size_t capacity;    // Current capacity of the array
        size_t size;        // Number of elements in the array

    public:
        // Default constructor
        DynamicArray() : arr(nullptr), capacity(0), size(0) {}

    // Constructor with initial capacity
    DynamicArray(size_t initialCapacity) : arr(new T[initialCapacity]), capacity(initialCapacity), size(0) {}

    // Destructor to clean up memory
    ~DynamicArray() {
        delete[] arr;
    }

    // Add an element to the end of the array
    void push_back(const T& value) {
        if (size == capacity) {
            resize(capacity * 2);
        }
        arr[size++] = value;
    }

    // Remove the last element from the array
    void pop_back() {
        if (size > 0) {
            size--;
            if (size <= capacity / 4) {
                resize(capacity / 2);
            }
        }
    }

    // Access an element by index
    T& operator[](size_t index) {
        if (index < size) {
            return arr[index];
        } else {
            throw std::out_of_range("Index out of bounds");
        }
    }

    // Get the number of elements in the array
    size_t getSize() const {
        return size;
    }

    private:
        // Resize the array to a new capacity
        void resize(size_t newCapacity) {
            T* newArr = new T[newCapacity];
            for (size_t i = 0; i < size; ++i) {
                newArr[i] = arr[i];
            }
            delete[] arr;
            arr = newArr;
            capacity = newCapacity;
        }
};

int main() {
    // Create a DynamicArray of integers with an initial capacity of 5
    DynamicArray<int> myArray(5);

    // Add elements to the array
    for (int i = 0; i < 10; ++i) {
        myArray.push_back(i);
    }

    // Print the elements in the array
    for (size_t i = 0; i < myArray.getSize(); ++i) {
        std::cout << myArray[i] << " ";
    }

    return 0;
}