#!/bin/bash

if [[ $(git diff --stat) != '' ]]; then
    echo 'Branch has uncommitted changes'
    exit 1
else
    if [[ $1 == '--patch' ]]; then
        npm version patch
        git push --tags origin main
    fi
    if [[ $1 == '--minor' ]]; then
        npm version minor
        git push --tags origin main
    fi
    if [[ $1 == '--major' ]]; then
       npm version major
       git push --tags origin main
    fi
fi