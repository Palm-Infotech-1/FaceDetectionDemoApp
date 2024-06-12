# React Native Vision Camera Face Detector Demo
To run the project, you must install dependencies:

```sh
npm i
npx patch-package #To apply all required patches
```
For iOS, install pods by navigating to iOS folder,
```sh
cd ios && pod install
```

To run in android,
```sh
npm run android
```

To run in iOS,
```sh
npm run ios
```
or you can run from xcode by opening the iOS folder in xcode and run the project.

### Notes:
- We made required changes in the library **react-native-vision-camera-face-detector**. Please refer the changes in patches folder under "**react-native-vision-camera-face-detector+1.6.3.patch**" file.
- You may need to change the baseUrl to your localhost IP in src/utils/request.ts.
- Install NDK  version "25.1.8937393" from android studio SDK manager.
- make sure to add sdk.dir path for android sdk path.