#!/bin/sh

# Run this only from the git directory root

PROTOTYPE_DEPLOY_DIR='./docs/prototyping'

echo "> Purging ${PROTOTYPE_DEPLOY_DIR}"
rm -rvf "${PROTOTYPE_DEPLOY_DIR}/*"

echo "> Copying prototype code"
cp -Rv ./Prototyping/* "${PROTOTYPE_DEPLOY_DIR}/"

