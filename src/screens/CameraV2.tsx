import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Camera as VisionCamera, Frame, useCameraDevice } from 'react-native-vision-camera'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
const { height: sh, width: sw } = Dimensions.get('screen');
const dotStyle: ViewStyle = {
    height: 10,
    width: 10,
    backgroundColor: 'red',
    position: 'absolute',
    borderRadius: 10,
}
const CameraV2 = () => {
    const cameraDevice = useCameraDevice('front')
    const camera = useRef<VisionCamera>(null)
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        performanceMode: 'fast',
        classificationMode: 'all',
        landmarkMode: 'all',
    }).current

    useEffect(() => {
        (async () => {
            const status = await VisionCamera.requestCameraPermission()
            console.log({ status })
        })()
    }, [camera])


    const faceWidth = useSharedValue(0)
    const faceHeight = useSharedValue(0)
    const faceX = useSharedValue(0)
    const faceY = useSharedValue(0)

    const leftCheekX = useSharedValue(0)
    const leftCheekY = useSharedValue(0)

    const leftEarX = useSharedValue(0)
    const leftEarY = useSharedValue(0)

    const leftEyeX = useSharedValue(0)
    const leftEyeY = useSharedValue(0)

    const mouthBottomX = useSharedValue(0)
    const mouthBottomY = useSharedValue(0)

    const mouthLeftX = useSharedValue(0)
    const mouthLeftY = useSharedValue(0)

    const mouthRightX = useSharedValue(0)
    const mouthRightY = useSharedValue(0)

    const noseBaseX = useSharedValue(0)
    const noseBaseY = useSharedValue(0)

    const rightCheekX = useSharedValue(0)
    const rightCheekY = useSharedValue(0)

    const rightEarX = useSharedValue(0)
    const rightEarY = useSharedValue(0)

    const rightEyeX = useSharedValue(0)
    const rightEyeY = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        borderWidth: 3,
        borderRadius: 10,
        borderColor: 'orange',
        width: withTiming(faceWidth.value, { duration: 100 }),
        height: withTiming(faceHeight.value, { duration: 100 }),
        left: withTiming(faceX.value, { duration: 100 }),
        top: withTiming(faceY.value, { duration: 100 })
    }))

    const leftCheekAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(leftCheekY.value, { duration: 100 }),
        left: withTiming(leftCheekX.value, { duration: 100 }),
    }))
    const leftEarAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(leftEarY.value, { duration: 100 }),
        left: withTiming(leftEarX.value, { duration: 100 }),
    }))

    const leftEyeAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(leftEyeY.value, { duration: 100 }),
        left: withTiming(leftEyeX.value, { duration: 100 }),
    }))
    const mouthBottomAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(mouthBottomY.value, { duration: 100 }),
        left: withTiming(mouthBottomX.value, { duration: 100 }),
    }))
    const mouthLeftYAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(mouthLeftY.value, { duration: 100 }),
        left: withTiming(mouthLeftX.value, { duration: 100 }),
    }))
    const mouthRightAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(mouthRightY.value, { duration: 100 }),
        left: withTiming(mouthRightX.value, { duration: 100 }),
    }))
    const noseBaseAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(noseBaseY.value, { duration: 100 }),
        left: withTiming(noseBaseX.value, { duration: 100 }),
    }))
    const rightCheekAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(rightCheekY.value, { duration: 100 }),
        left: withTiming(rightCheekX.value, { duration: 100 }),
    }))
    const rightEarAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(rightEarY.value, { duration: 100 }),
        left: withTiming(rightEarX.value, { duration: 100 }),
    }))
    const rightEyeAnimatedStyle = useAnimatedStyle(() => ({
        ...dotStyle,
        top: withTiming(rightEyeY.value, { duration: 100 }),
        left: withTiming(rightEyeX.value, { duration: 100 }),
    }))

    function handleFacesDetected(faces: Face[], frame: Frame): void {
        if (faces.length > 0) {
            console.log("🚀 ~ handleFacesDetected ~ faces:", faces[0].bounds)

        }
        const scaleX = sh / frame.height
        const scaleY = sw / frame.width
        if (Object.keys(faces).length <= 0) return
        const { bounds } = faces[0]
        const { width, height, x, y } = bounds
        faceWidth.value = width * scaleY
        faceHeight.value = height * scaleX
        faceX.value = x * scaleY
        faceY.value = y * scaleX

        leftCheekX.value = faces[0].landmarks.LEFT_CHEEK.x * scaleY
        leftCheekY.value = faces[0].landmarks.LEFT_CHEEK.y * scaleX

        leftEarX.value = faces[0].landmarks.LEFT_EAR.x * scaleY
        leftEarY.value = faces[0].landmarks.LEFT_EAR.y * scaleX

        leftEyeX.value = faces[0].landmarks.LEFT_EYE.x * scaleY
        leftEyeY.value = faces[0].landmarks.LEFT_EYE.y * scaleX

        mouthBottomX.value = faces[0].landmarks.MOUTH_BOTTOM.x * scaleY
        mouthBottomY.value = faces[0].landmarks.MOUTH_BOTTOM.y * scaleX

        mouthLeftX.value = faces[0].landmarks.MOUTH_LEFT.x * scaleY
        mouthLeftY.value = faces[0].landmarks.MOUTH_LEFT.y * scaleX

        mouthRightX.value = faces[0].landmarks.MOUTH_RIGHT.x * scaleY
        mouthRightY.value = faces[0].landmarks.MOUTH_RIGHT.y * scaleX

        noseBaseX.value = faces[0].landmarks.NOSE_BASE.x * scaleY
        noseBaseY.value = faces[0].landmarks.NOSE_BASE.y * scaleX

        rightCheekX.value = faces[0].landmarks.RIGHT_CHEEK.x * scaleY
        rightCheekY.value = faces[0].landmarks.RIGHT_CHEEK.y * scaleX

        rightEarX.value = faces[0].landmarks.RIGHT_EAR.x * scaleY
        rightEarY.value = faces[0].landmarks.RIGHT_EAR.y * scaleX

        rightEyeX.value = faces[0].landmarks.RIGHT_EYE.x * scaleY
        rightEyeY.value = faces[0].landmarks.RIGHT_EYE.y * scaleX
    }


    return (
        <>
            {cameraDevice && <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                isActive={true}
                device={cameraDevice}
                faceDetectionCallback={handleFacesDetected}
                faceDetectionOptions={{
                    ...faceDetectionOptions,
                }}
            />}

            <Animated.View style={animatedStyle} />
            <Animated.View style={leftCheekAnimatedStyle} />
            <Animated.View style={leftEarAnimatedStyle} />
            <Animated.View style={leftEyeAnimatedStyle} />
            <Animated.View style={mouthBottomAnimatedStyle} />
            <Animated.View style={mouthLeftYAnimatedStyle} />
            <Animated.View style={mouthRightAnimatedStyle} />
            <Animated.View style={noseBaseAnimatedStyle} />
            <Animated.View style={rightCheekAnimatedStyle} />
            <Animated.View style={rightEarAnimatedStyle} />
            <Animated.View style={rightEyeAnimatedStyle} />
        </>
    )
}

export default CameraV2

const styles = StyleSheet.create({})