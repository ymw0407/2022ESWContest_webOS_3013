#!/bin/bash

cd $PWD/register-car/register-car_app
npm install
npm run pack-p

cd ../register-car_service
npm install

cd ..
ares-package register-car_app/dist register-car_service
ares-install com.registercar.app_1.0.0_all.ipk