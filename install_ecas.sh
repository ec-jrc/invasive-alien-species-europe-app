#!/bin/bash
clear
 
arr=("android")
 
for platform in "${arr[@]}"
do
  # define the variables you want to pass to the config-file
  BASE_URL=https://ecas.ec.europa.eu
  REQUEST_FULL_USERDETAILS=true
  REQUEST_DGT=true
  ASSURANCE_LEVEL=LOW
  GROUP_FILTERS=*
  SERVICE_URL=https://localhost/android/mygeoss2

 
  echo "-- Preparing platform : $platform ($SERVICE_URL)"
 
  rm -rf ./platforms/$platform/cordova/plugins/eu.europa.ec.ecas/
 
  plugman uninstall --platform $platform --plugin eu.europa.ec.ecas --project ./platforms/$platform
 
  #plugman install --platform $platform --project ./platforms/$platform --plugin https://spinefa:Temi75@webgate.ec.europa.eu/CITnet/stash/scm/ecas/ecas-mobile-sdk-cordova.git --variable ECAS_BASE_URL=$BASE_URL --variable REQUEST_FULL_USERDETAILS=$REQUEST_FULL_USERDETAILS --variable REQUEST_DGT=$REQUEST_DGT --variable ASSURANCE_LEVEL=$ASSURANCE_LEVEL --variable GROUP_FILTERS=$GROUP_FILTERS --variable SERVICE_URL=$SERVICE_URL

  plugman install --platform $platform --project ./platforms/$platform --plugin /home/spinefa/Projects/ecas-mobile-sdk-cordova --variable ECAS_BASE_URL=$BASE_URL --variable REQUEST_FULL_USERDETAILS=$REQUEST_FULL_USERDETAILS --variable REQUEST_DGT=$REQUEST_DGT --variable ASSURANCE_LEVEL=$ASSURANCE_LEVEL --variable GROUP_FILTERS=$GROUP_FILTERS --variable SERVICE_URL=$SERVICE_URL

done
