import { getItemsDatabaseReference , getSwipeLocation} from '../Utils/Database/FirebaseInitialization'
import { get } from 'firebase/database'
import { Item } from '../Utils/Model/Item'

// Call the main function
main()

let currentItemIndex = 0 
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



const swipeLeft = document.getElementById('swipe-left')
const swipeRight = document.getElementById('swipe-right')

swipeLeft.addEventListener('click', () => {
  updateItemCard(currentItemIndex++)
})

swipeRight.addEventListener('click', () => {
  updateItemCard(currentItemIndex++)
})

console.log(getSwipeLocation('-NpxGzbOv0-bOeGp3HsP'))

function updateItemCard(index) {
  const itemTitle = document.getElementById('item-title')
  const itemAuthor = document.getElementById('item-author')
  const itemDescription = document.getElementById('item-description')
  const itemImg = document.getElementById('item-img')

  itemTitle.textContent = listOfItem[index].getTitle()
  itemAuthor.textContent = listOfItem[index].getFullName() 
  itemDescription.textContent = listOfItem[index]. getDescription()
  itemImg.src = listOfItem[index].getImageUrl()
  updateLeftorRight()
}

// call function for updating where it left or right
// id of target
// location or path 
// node of something 

function updateLeftorRight (action){
  if(action === 'right'){
    alert('rigth')
  }else {
    alert('left')
  }
}