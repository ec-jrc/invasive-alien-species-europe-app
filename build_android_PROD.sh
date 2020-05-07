rm platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
cordova build android --release
sudo cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk /mnt/shared/easin-prod.apk
