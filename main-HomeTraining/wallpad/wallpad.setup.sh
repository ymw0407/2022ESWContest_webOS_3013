#!/bin/bash

cd $PWD/exercise/exercise_app
npm install
yarn install
npm run pack-p

cd ../exercise_service
npm install

cd ..
ares-package exercise_app/dist exercise_service
ares-install com.exercise.app_1.0.0_all.ipk