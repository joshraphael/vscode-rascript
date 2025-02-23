#!/bin/bash

if [[ $(git diff --stat) != '' ]]; then
    echo 'Branch has uncommitted changes'
    exit 1
else
    if [[ $1 == '--patch' ]]; then
        npm version patch
        git push -tags origin master
    fi
    if [[ $1 == '--minor' ]]; then
        npm version minor
    fi
    if [[ $1 == '--major' ]]; then
       npm version major
    fi
fi