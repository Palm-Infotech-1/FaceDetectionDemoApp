import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera as FaceDetectionCamera, Face, FaceDetectionOptions, useFaceDetector } from 'react-native-vision-camera-face-detector'
import { Camera, Frame, useCameraDevice, useFrameProcessor, useSkiaFrameProcessor } from 'react-native-vision-camera'
import { Worklets, useSharedValue } from 'react-native-worklets-core'
import { Skia } from '@shopify/react-native-skia'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

const CameraScreen = () => {
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        landmarkMode: 'all',
        trackingEnabled: true,
        // contourMode: 'all'
    })
    const device = useCameraDevice('front')
    const { detectFaces } = useFaceDetector(faceDetectionOptions.current)
    const aFaceW = useSharedValue(0)
    const aFaceH = useSharedValue(0)
    const aFaceX = useSharedValue(0)
    const aFaceY = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            borderWidth: 4,
            borderLeftColor: 'rgb(0,255,0)',
            borderRightColor: 'rgb(0,255,0)',
            borderBottomColor: 'rgb(0,255,0)',
            borderTopColor: 'rgb(255,0,0)',
            width: withTiming(aFaceW.value, {
                duration: 100
            }),
            height: withTiming(aFaceH.value, {
                duration: 100
            }),
            left: withTiming(aFaceX.value, {
                duration: 100
            }),
            top: withTiming(aFaceY.value, {
                duration: 100
            }),
        }
    })


    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission()
            console.log({ status })
        })()
    }, [device])
    const handleDetectedFaces = Worklets.createRunOnJS((
        faces: Face[],
        frame: Frame
    ) => {
        if (faces.length > 0) {
            console.log("🚀 ~ CameraScreen ~ faces[0].bounds:", faces[0].bounds)
        }
    })

    const frameProcessor = useSkiaFrameProcessor((frame) => {
        'worklet'
        frame.render()
    }, [])
    return (
        <View style={{ flex: 1 }}>
            {!!device ? <Camera
                isActive
                frameProcessor={frameProcessor}
                style={StyleSheet.absoluteFill}
                device={device}
            /> : <Text>
                No Device
            </Text>}
            <Animated.View style={[animatedStyle, {
                position: 'absolute',
                borderWidth: 4,
                borderLeftColor: 'rgb(0,255,0)',
                borderRightColor: 'rgb(0,255,0)',
                borderBottomColor: 'rgb(0,255,0)',
                borderTopColor: 'rgb(255,0,0)',
                width: 100,
                height: 100,
            }]} />
        </View>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})