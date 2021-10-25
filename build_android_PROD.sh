rm platforms/android/app/build/outputs/bundle/release/app-release.aab
cordova build android --release
sudo cp platforms/android/app/build/outputs/bundle/release/app-release.aab /mnt/shared/easin-prod.aab
