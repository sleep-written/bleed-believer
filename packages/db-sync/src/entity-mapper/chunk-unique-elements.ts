/**
 * Divides an array into multiple subarrays (chunks), each containing unique elements up
 * to a specified maximum size.
 * This function first removes duplicate elements from the input array to ensure that all
 * elements in the resulting chunks are unique.
 * 
 * @param inputArray The array of elements to chunk.
 * @param chunkSize The maximum number of elements each chunk can contain.
 * @returns An array of chunks, where each chunk is an array containing up to `chunkSize`
 * unique elements from the original array.
 */
export function chunkUniqueElements<T>(inputArray: T[], chunkSize: number): T[][] {
    // Remove duplicates by converting the array to a Set and then back to an array
    const uniqueElements = Array.from(new Set(inputArray));
    
    // Initialize the array to hold the resulting chunks
    const chunks: T[][] = [];
    
    // Loop through the array of unique elements, slicing it into chunks of specified size
    for (let i = 0; i < uniqueElements.length; i += chunkSize) {
        // Extract a chunk of elements from the current index up to the chunk size
        const chunk = uniqueElements.slice(i, i + chunkSize);
        
        // Add the chunk to the list of chunks
        chunks.push(chunk);
    }
  
    // Return the array of chunks
    return chunks;
}
