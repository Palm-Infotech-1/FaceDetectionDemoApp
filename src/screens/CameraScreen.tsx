import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Camera as VisionCamera, Frame, useCameraDevice } from 'react-native-vision-camera'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
const { height: sh, width: sw } = Dimensions.get('screen');
import mime from 'mime';
import moment from 'moment'
import { uploadVideo } from '../utils/request'
import Toast from 'react-native-toast-message'
import { DURATION, MAX_VIDEO_DURATION } from '../utils/constants'

let durationInterval: any;

const CameraScreen = () => {
    const cameraDevice = useCameraDevice('front')
    const camera = useRef<VisionCamera>(null)
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        performanceMode: 'accurate',
        classificationMode: 'all',
        landmarkMode: 'all',
        autoScale: true
    }).current
    const [granted, setGranted] = useState(false);

    useEffect(() => {
        (async () => {
            const status = await VisionCamera.requestCameraPermission()
            setGranted(status === 'granted')
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
        ...styles.boundingBox,
        width: withTiming(faceWidth.value, { duration: DURATION }),
        height: withTiming(faceHeight.value, { duration: DURATION }),
        left: withTiming(faceX.value, { duration: DURATION }),
        top: withTiming(faceY.value, { duration: DURATION })
    }))

    const leftCheekAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(leftCheekY.value, { duration: DURATION }),
        left: withTiming(leftCheekX.value, { duration: DURATION }),
    }))
    const leftEarAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(leftEarY.value, { duration: DURATION }),
        left: withTiming(leftEarX.value, { duration: DURATION }),
    }))

    const leftEyeAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(leftEyeY.value, { duration: DURATION }),
        left: withTiming(leftEyeX.value, { duration: DURATION }),
    }))
    const mouthBottomAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(mouthBottomY.value, { duration: DURATION }),
        left: withTiming(mouthBottomX.value, { duration: DURATION }),
    }))
    const mouthLeftYAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(mouthLeftY.value, { duration: DURATION }),
        left: withTiming(mouthLeftX.value, { duration: DURATION }),
    }))
    const mouthRightAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(mouthRightY.value, { duration: DURATION }),
        left: withTiming(mouthRightX.value, { duration: DURATION }),
    }))
    const noseBaseAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(noseBaseY.value, { duration: DURATION }),
        left: withTiming(noseBaseX.value, { duration: DURATION }),
    }))
    const rightCheekAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(rightCheekY.value, { duration: DURATION }),
        left: withTiming(rightCheekX.value, { duration: DURATION }),
    }))
    const rightEarAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(rightEarY.value, { duration: DURATION }),
        left: withTiming(rightEarX.value, { duration: DURATION }),
    }))
    const rightEyeAnimatedStyle = useAnimatedStyle(() => ({
        ...styles.dotStyle,
        top: withTiming(rightEyeY.value, { duration: DURATION }),
        left: withTiming(rightEyeX.value, { duration: DURATION }),
    }))

    function handleFacesDetected(faces: Face[], frame: Frame): void {
        if (Object.keys(faces).length <= 0) return
        const { bounds } = faces[0]
        const { width, height, x, y } = bounds
        faceWidth.value = width
        faceHeight.value = height
        faceX.value = x
        faceY.value = y

        leftCheekX.value = faces[0].landmarks.LEFT_CHEEK.x
        leftCheekY.value = faces[0].landmarks.LEFT_CHEEK.y

        leftEarX.value = faces[0].landmarks.LEFT_EAR.x
        leftEarY.value = faces[0].landmarks.LEFT_EAR.y

        leftEyeX.value = faces[0].landmarks.LEFT_EYE.x
        leftEyeY.value = faces[0].landmarks.LEFT_EYE.y

        mouthBottomX.value = faces[0].landmarks.MOUTH_BOTTOM.x
        mouthBottomY.value = faces[0].landmarks.MOUTH_BOTTOM.y

        mouthLeftX.value = faces[0].landmarks.MOUTH_LEFT.x
        mouthLeftY.value = faces[0].landmarks.MOUTH_LEFT.y

        mouthRightX.value = faces[0].landmarks.MOUTH_RIGHT.x
        mouthRightY.value = faces[0].landmarks.MOUTH_RIGHT.y

        noseBaseX.value = faces[0].landmarks.NOSE_BASE.x
        noseBaseY.value = faces[0].landmarks.NOSE_BASE.y

        rightCheekX.value = faces[0].landmarks.RIGHT_CHEEK.x
        rightCheekY.value = faces[0].landmarks.RIGHT_CHEEK.y

        rightEarX.value = faces[0].landmarks.RIGHT_EAR.x
        rightEarY.value = faces[0].landmarks.RIGHT_EAR.y

        rightEyeX.value = faces[0].landmarks.RIGHT_EYE.x
        rightEyeY.value = faces[0].landmarks.RIGHT_EYE.y
    }

    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const durationRef = useRef(0);
    const [loading, setLoading] = useState(false);

    const onPress = () => {
        if (camera.current) {
            if (!recording) {
                setRecording(true)
                durationInterval = setInterval(() => {
                    if (durationRef.current + 1 < MAX_VIDEO_DURATION) {
                        setDuration(prev => {
                            durationRef.current = prev + 1;
                            return prev + 1
                        })
                    }
                    else {
                        camera.current?.stopRecording()
                    }
                }, 1000)
                camera.current?.startRecording({
                    onRecordingError(error) {
                        setRecording(false)
                        clearInterval(durationInterval)
                    },
                    async onRecordingFinished(video) {
                        setRecording(false)
                        setDuration(0)
                        durationRef.current = 0;
                        clearInterval(durationInterval)
                        const formData = new FormData();
                        const extName = video.path.split('.')[video.path.split('.').length - 1]
                        // @ts-ignore
                        formData.append('file', {
                            uri: video.path ?? '',
                            name: Date.now() + '.' + extName,
                            type: mime.getType(video.path),
                        });
                        setLoading(true)
                        try {
                            await uploadVideo(formData);
                            Toast.show({ text1: 'Video Uploaded!', type: 'success' })
                        } catch (error) {
                            Toast.show({ text1: 'Video could not be uploaded!', type: 'error' })
                            console.log("🚀 ~ onRecordingFinished ~ error:", error)
                        }
                        setLoading(false)
                    },
                })
            }
            else {
                camera.current?.stopRecording()
            }
        }
    }

    return (
        <>
            {(cameraDevice && granted) && <Camera
                ref={camera}
                video
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
            <View style={styles.container}>
                <Pressable style={[styles.playPauseBtn, recording && styles.recording]} onPress={onPress}>
                    {loading ? <ActivityIndicator color={'white'} size={'large'} />
                        : <View style={styles.stopIcon} />}
                </Pressable>
                <Text style={styles.durationText}>{moment.utc(duration * 1000).format('mm:ss')}</Text>
            </View>
            <Toast />
        </>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    playPauseBtn: {
        height: sw * 0.19,
        width: sw * 0.19,
        bottom: sw * 0.1,
        borderWidth: 6,
        borderColor: 'white',
        borderRadius: 100,
        backgroundColor: 'red',
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99
    },
    recording: {
        backgroundColor: 'transparent',
    },
    stopIcon: {
        backgroundColor: 'red',
        height: '50%',
        width: '50%',
    },
    durationText: {
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
        position: 'absolute',
        bottom: sw * 0.165,
        right: sw * 0.2
    },
    dotStyle: {
        height: 10,
        width: 10,
        backgroundColor: 'red',
        position: 'absolute',
        borderRadius: 10,
    },
    boundingBox: {
        position: 'absolute',
        borderWidth: 3,
        borderRadius: 10,
        borderColor: 'orange',
    }
})