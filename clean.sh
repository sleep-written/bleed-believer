# Use "chmox a+x" to enable permissions

# Remove build info
rm -f ./packages/*/*.tsbuildinfo
rm -f ./tests/*/*.tsbuildinfo
rm -f ./*.tsbuildinfo

# Remove transpiled projects
rm -rf ./packages/*/dist
rm -rf ./tests/*/dist