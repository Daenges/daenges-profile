#!/bin/bash

git pull
npm install
rm -R public/
hugo
