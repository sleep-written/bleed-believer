/**
 * Divide un array en "chunks" después de eliminar los elementos duplicados.
 * 
 * @param inputArray El array de entrada desde el cual eliminar los duplicados y crear los chunks.
 * @param chunkSize El tamaño máximo de cada chunk.
 * @returns Un array de dos dimensiones que contiene los elementos únicos del array de entrada,
 *          agrupados en subarrays de un tamaño máximo definido por `chunkSize`.
 */
export function chunkUniqueElements<T>(inputArray: T[], chunkSize: number): T[][] {
    // Elimina los elementos duplicados utilizando un Set para eficiencia.
    const uniqueElements = Array.from(new Set(inputArray));
  
    // Inicializa el array de resultado para los chunks.
    const chunks: T[][] = [];
  
    // Itera sobre los elementos únicos, creando chunks del tamaño especificado.
    for (let i = 0; i < uniqueElements.length; i += chunkSize) {
      const chunk = uniqueElements.slice(i, i + chunkSize);
      chunks.push(chunk);
    }
  
    return chunks;
  }
  