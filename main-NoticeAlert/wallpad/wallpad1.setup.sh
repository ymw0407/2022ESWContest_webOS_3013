#!/bin/bash

cd $PWD/control/control_app
npm install
yarn install
npm run pack-p

cd ../control_service
npm install

cd ..
ares-package control_app/dist control_service
ares-install com.control.app_1.0.0_all.ipk