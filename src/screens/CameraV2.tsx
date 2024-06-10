import { ActivityIndicator, Dimensions, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Bounds, Camera, Face, FaceDetectionOptions } from 'react-native-vision-camera-face-detector'
import { Camera as VisionCamera, Frame, useCameraDevice } from 'react-native-vision-camera'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
const { height: sh, width: sw } = Dimensions.get('screen');
import mime from 'mime';
import moment from 'moment'

const dotStyle: ViewStyle = {
    height: 10,
    width: 10,
    backgroundColor: 'red',
    position: 'absolute',
    borderRadius: 10,
}

function calcFacePosition(bounds: Bounds, frame: Frame) {
    const orientation = (() => {
        switch (frame.orientation) {
            case 'portrait':
                return 0;
            case 'landscape-left':
                return 90;
            case 'portrait-upside-down':
                return 180;
            case 'landscape-right':
                return 270;
        }
    })();
    const degrees = (orientation - 90 + 360) % 360;
    let scaleX = 0;
    let scaleY = 0;

    if (Platform.OS !== 'ios' && (degrees === 90 || degrees === 270)) {
        scaleX = sw / frame.height;
        scaleY = sh / frame.width;
    } else {
        scaleX = sw / frame.width;
        scaleY = sh / frame.height;
    }

    const faceW = bounds.width * scaleX;
    const faceH = bounds.height * scaleY;
    const faceX = (() => {
        const xPos = bounds.x * scaleX;
        if (Platform.OS === 'ios') {
            return xPos;
        }
        return sw - (xPos + faceW); // invert X position on android
    })();

    return {
        faceW,
        faceH,
        faceX,
        faceY: bounds.y * scaleY,
    };
}


let durationInterval: any;

const CameraV2 = () => {
    const cameraDevice = useCameraDevice('front')
    const camera = useRef<VisionCamera>(null)
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        performanceMode: 'accurate',
        classificationMode: 'all',
        landmarkMode: 'all',
        autoScale: true
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
        if (Object.keys(faces).length <= 0) return
        // const scaleX = sh / frame.height
        // const scaleY = sw / frame.width
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
                    if (durationRef.current + 1 < 10) {
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
                        console.log("🚀 ~ onRecordingFinished ~ video:", video)
                        console.log("🚀 ~ onRecordingFinished ~ extName:", extName)
                        // @ts-ignore
                        formData.append('file', {
                            uri: video.path ?? '',
                            name: Date.now() + '.' + extName,
                            type: mime.getType(video.path),
                        });
                        setLoading(true)
                        try {
                            const data = await fetch('http://192.168.29.157:3000/video', {
                                method: 'post',
                                body: formData,
                            }).then(res => res.json())
                            console.log(data);
                        } catch (error) {
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

    // const onVideo = useCallback(async () => {
    //     if (!recording) {
    //         setRecording(true)
    //         durationInterval = setInterval(() => {
    //             if (durationRef.current + 1 < 61) {
    //                 setDuration((oldDuration) => {
    //                     let mzminutes = Math.floor((oldDuration.duration + 1) / 60);
    //                     let mzseconds = Math.floor((oldDuration.duration + 1) - (mzminutes * 60));
    //                     let display = (mzminutes < 10 ? '0' : '') + mzminutes + ':' + (mzseconds < 10 ? '0' : '') + mzseconds;
    //                     durationRef.current = oldDuration.duration + 1
    //                     return {
    //                         display,
    //                         duration: oldDuration.duration + 1
    //                     }
    //                 })
    //             }
    //             else {
    //                 camera.current?.stopRecording()
    //             }
    //         }, 1000);
    //         logEvent(analyticsEvents.camera.pressEvents.startVideo, { userId: user?.userId });
    //         camera.current?.startRecording({
    //             // videoCodec: 'h264',
    //             onRecordingError(error) {
    //                 setRecording(false)
    //                 clearInterval(durationInterval)
    //             },
    //             async onRecordingFinished(video) {
    //                 const timestamp = Date.now()
    //                 setRecording(false)
    //                 setCapturing(true)
    //                 clearInterval(durationInterval)
    //                 const thumbnailCommand = ` -i ${video.path} -vframes 1 -an -ss 0 ${CachesDirectoryPath}/${timestamp}thumbnail.jpg`
    //                 await ffmpegRun(thumbnailCommand)
    //                 const uriSmall = `file://${CachesDirectoryPath}/${timestamp}thumbnail.jpg`
    //                 setTimeout(() => {
    //                     setCapturing(false)
    //                     setDuration({
    //                         duration: 0,
    //                         display: '00:00'
    //                     })
    //                     navigation.replace('EditVideo', { uri: video.path, showCaseImage: uriSmall, duration: video.duration })
    //                     logEvent(analyticsEvents.camera.submitEvents.videoEdit, { userId: user?.userId });
    //                 }, 100)
    //             },
    //         })
    //     }
    //     else {
    //         camera.current?.stopRecording()
    //     }
    // }, [recording])
    return (
        <>
            {cameraDevice && <Camera
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
            <Pressable style={styles.container} onPress={onPress}>
                <View style={[styles.playPauseBtn, recording && styles.recording]}>
                    {loading ? <ActivityIndicator color={'white'} size={'large'} />
                        : <View style={styles.stopIcon} />}
                </View>
                <Text style={styles.durationText}>{moment.utc(duration * 1000).format('mm:ss')}</Text>
            </Pressable>
            {/* <Animated.View style={animatedStyle} />
            <Animated.View style={leftCheekAnimatedStyle} />
            <Animated.View style={leftEarAnimatedStyle} />
            <Animated.View style={leftEyeAnimatedStyle} />
            <Animated.View style={mouthBottomAnimatedStyle} />
            <Animated.View style={mouthLeftYAnimatedStyle} />
            <Animated.View style={mouthRightAnimatedStyle} />
            <Animated.View style={noseBaseAnimatedStyle} />
            <Animated.View style={rightCheekAnimatedStyle} />
            <Animated.View style={rightEarAnimatedStyle} />
            <Animated.View style={rightEyeAnimatedStyle} /> */}
        </>
    )
}

export default CameraV2

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
        alignItems: 'center'
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
    }
})