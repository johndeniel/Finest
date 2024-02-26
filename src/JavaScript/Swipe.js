import { getItemsDatabaseReference } from '../Utils/Database/FirebaseInitialization'
import { get } from 'firebase/database'
import { Item } from '../Utils/Model/Item'

// Call the main function
main()

const listOfItem = []

async function main() {
  try {
    // Get the database reference
    const itemsRef = getItemsDatabaseReference()

    // Fetch the data once
    const snapshot = await get(itemsRef)

    // Check if data exists
    if (snapshot.exists()) {
      // Data exists, extract the value
      const data = snapshot.val()

      // Process the data (create Item instances)
      const items = Object.values(data).map(itemData => {
        const item = new Item(
          itemData.key,
          itemData.userId,
          itemData.avatar,
          itemData.fullName,
          itemData.title,
          itemData.description,
          itemData.fileName,
          itemData.imageUrl
        )
        listOfItem.push(item)
      })

      // Example: Log the items
      console.log('Items:', items)
    } else {
      console.log('No data available')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  console.log(listOfItem)
}
