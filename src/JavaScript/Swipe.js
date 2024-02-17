import {database} from '../Utils/Database/FirebaseInitialization' 

// Function to fetch data from the database
function fetchData() {
  // Reference to the data you want to fetch
  const dataRef = database.ref('path/to/your/data')
  
  // Fetch data once
  dataRef.once('value')
    .then((snapshot) => {
      // Data retrieved successfully
      const data = snapshot.val()
      console.log('Data fetched:', data)
    })
    .catch((error) => {
      // Error handling
      console.error('Error fetching data:', error)
    })
}
  
  
fetchData()