#!/bin/bash
JSON_ESM="{ \"type\": \"module\" }";
JSON_CJS="{ \"type\": \"commonjs\" }";

FOLDERS=$(find ./packages/* -maxdepth 0 -type d);
IFS="
"

find . -name "*.tsbuildinfo" -type f -delete
for folder in $FOLDERS; do
    echo deleting: \"$folder/dist\"
    rm -rf $folder/dist
    
    # if [[ $1 != "--clean" && $1 != "-c" ]]; then
    #     if test -f $folder/dist/cjs/package.json; then
    #         echo creating: \"$folder/dist/cjs/package.json\"
    #         mkdir -p $folder/dist/cjs
    #         echo $JSON_CJS > $folder/dist/cjs/package.json

    #         echo creating: \"$folder/dist/esm/package.json\"
    #         mkdir -p $folder/dist/esm
    #         echo $JSON_ESM > $folder/dist/esm/package.json
    #     fi

    #     echo "Done!"
    #     echo ""
    # fi
done

if [[ $1 == "--watch" || $1 == "-w" ]]; then
        echo Preparing tsc --watch
        npx tsc --build ./tsconfig.build.json --watch --sourceMap
elif [[ $1 != "--clean" && $1 != "-c" ]]; then
        echo Building Packages...
        npx tsc --build ./tsconfig.build.json
fi

find . -name "*.tsbuildinfo" -type f -delete
echo "Done!"