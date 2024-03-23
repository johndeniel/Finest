// Function to parse the request URL and extract relevant information
export const parseRequestUrl = () => {
  // Get the address part of the URL from the hash, excluding any query parameters
  const address = document.location.hash.slice(1).split('?')[0]

  // Check if the URL hash contains a query string by splitting it and checking the length of the resulting array
  const queryString =
      document.location.hash.slice(1).split('?').length === 2
        ? document.location.hash.slice(1).split('?')[1] 
        : '' 
  
  // Set the URL to either the extracted address or '/' if no address is present
  const url = address || '/'

  // Split the URL into segments using '/'
  const r = url.split('/')

  // Split the query string into key-value pairs using '='
  const q = queryString.split('=')

  // Return an object containing the parsed information from the URL
  return {
    resource: r[1],
    id: r[2],
    verb: r[3],
    name: q[0],
    value: q[1],
  }
}