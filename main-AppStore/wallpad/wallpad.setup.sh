#!/bin/bash

cd $PWD/appstore/appstore_app
npm install
npm run pack-p

cd ../appstore_service
npm install

cd ..
ares-package appstore_app/dist appstore_service
ares-install com.appstore.app_1.0.0_all.ipk