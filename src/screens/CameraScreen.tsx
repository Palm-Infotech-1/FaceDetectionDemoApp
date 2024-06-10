import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera as FaceDetectionCamera, Face, FaceDetectionOptions, useFaceDetector } from 'react-native-vision-camera-face-detector'
import { Camera, Frame, useCameraDevice, useFrameProcessor, useSkiaFrameProcessor } from 'react-native-vision-camera'
import { Worklets, useSharedValue } from 'react-native-worklets-core'
import { Skia } from '@shopify/react-native-skia'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

const { height: sh, width: sw, scale } = Dimensions.get('window');
const CameraScreen = () => {
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        landmarkMode: 'all',
        trackingEnabled: true,
        autoScale: true,
    })
    const device = useCameraDevice('front')
    const { detectFaces } = useFaceDetector(faceDetectionOptions.current)
    const aFaceW = useSharedValue(0)
    const aFaceH = useSharedValue(0)
    const aFaceX = useSharedValue(0)
    const aFaceY = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => ({
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
        })
    }))


    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission()
            console.log({ status })
        })()
    }, [device])

    const handleDetectedFaces = Worklets.createRunOnJS((
        faces: Face[]
    ) => {
        if (faces.length > 0) {
            const { bounds } = faces[0]
            const {
                width,
                height,
                x,
                y
            } = bounds
            aFaceW.value = width
            aFaceH.value = height
            aFaceX.value = x
            aFaceY.value = y
        }
    })

    const frameProcessorV1 = useFrameProcessor((frame) => {
        'worklet'
        const faces = detectFaces(frame)
        handleDetectedFaces(faces)
    }, [handleDetectedFaces])
    return (
        <View style={{ height: sh, width: sw }}>
            {!!device ? <Camera
                isActive
                style={StyleSheet.absoluteFill}
                frameProcessor={frameProcessorV1}
                device={device}
            /> : <Text>
                No Device
            </Text>}
            <Animated.View style={[animatedStyle]} />
        </View>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})