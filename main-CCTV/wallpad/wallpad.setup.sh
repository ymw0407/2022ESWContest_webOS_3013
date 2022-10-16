#!/bin/bash

cd $PWD/cctv/cctv_app
npm install
yarn install
npm run pack-p

cd ..
ares-package cctv_app/dist
ares-install com.cctv.app_1.0.0_all.ipk