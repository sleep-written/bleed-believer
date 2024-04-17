import type { FindOptionsOrder, FindOptionsWhere, ObjectLiteral } from 'typeorm';

/**
 * Opciones de configuración para el EntityBuffer.
 * 
 * @template E - Tipo de la entidad sobre la cual se opera, extendiendo ObjectLiteral.
 */
export interface DBSyncOptions<E extends ObjectLiteral> {
    /**
     * Especifica el tamaño del lote para las operaciones de guardado y eliminación. 
     * Las operaciones se dividirán en lotes de este tamaño para mejorar el rendimiento.
     */
    chunk?: number;

    /**
     * Condiciones "where" para filtrar entidades en la base de datos fuente (source DB).
     * Permite especificar filtros complejos para seleccionar qué entidades deben ser sincronizadas.
     */
    where?: FindOptionsWhere<E>;

    /**
     * Condiciones de ordenación para las consultas en la base de datos fuente (source DB).
     * Define cómo deben ser ordenadas las entidades recuperadas, lo cual puede ser relevante para
     * procesos de sincronización que dependen del orden de las entidades.
     */
    order?: FindOptionsOrder<E>;

    /**
     * Relaciones a verificar entre la base de datos fuente (source DB) y la base de datos objetivo (target DB).
     * Si se especifica una relación aquí y el registro relacionado en la base de datos fuente no existe en la
     * base de datos objetivo, entonces el registro relacionado será eliminado de la base de datos objetivo.
     * Esto ayuda a mantener la integridad referencial entre las bases de datos al asegurar que no queden
     * referencias huérfanas en la base de datos objetivo.
     */
    relationsToCheck?: Partial<Record<keyof E, boolean>>;
}
