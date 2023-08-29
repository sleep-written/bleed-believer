#!/bin/sh
clear
if [ $1 = "dist" ]; then
    # Eliminar el primer elemento de los argumentos
    shift

    # Eliminar carpeta transpilados
    echo \> Eliminando "./dist" ...
    rm -rf ./dist

    # Volver a transpilar
    echo \> Transpilando...
    npx tsc -p ./tsconfig.build.json
fi

# Ejecutar el CLI de TypeORM
echo \> Ejecutando TypeORM CLI...
npx bb-path-alias node_modules/typeorm/cli.js $@