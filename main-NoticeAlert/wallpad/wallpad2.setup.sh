#!/bin/bash

cd $PWD/reservation/reservation_service
npm install

cd ..
ares-package reservation_app reservation_service
ares-install com.reservation.app_1.0.0_all.ipk