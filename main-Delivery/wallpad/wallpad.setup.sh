#!/bin/bash

cd $PWD/delivery/delivery_app
npm install
npm run pack-p

cd ../delivery_service
npm install

cd ..
ares-package delivery_app/dist delivery_service
ares-install com.delivery.app_1.0.0_all.ipk