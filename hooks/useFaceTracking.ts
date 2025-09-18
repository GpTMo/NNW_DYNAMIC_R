import { useState, useEffect, useRef, useCallback } from 'react';
import type { FaceTrackingData } from '../types';

// Declaration for the faceLandmarksDetection library from the script tag
declare const faceLandmarksDetection: any;

// A mapping of MediaPipe landmark names to their indices for clarity
const keypointMap = {
    noseTip: 1,
    leftEyeInner: 130,
    rightEyeInner: 359,
    chin: 152,
    forehead: 10,
    leftCheek: 234,
    rightCheek: 454
};

export const useFaceTracking = (videoElement: HTMLVideoElement | null, isCameraOn: boolean) => {
    const [trackingData, setTrackingData] = useState<FaceTrackingData | null>(null);
    const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const modelRef = useRef<any>(null);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const model = await faceLandmarksDetection.createDetector(
                    faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh, {
                        runtime: 'mediapipe',
                        // Path to the WASM solution assets
                        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619',
                        maxFaces: 1,
                    }
                );
                modelRef.current = model;
                setModelStatus('ready');
            } catch (err) {
                console.error("Failed to load face tracking model", err);
                setModelStatus('error');
            }
        };

        const checkAndLoad = () => {
            if (typeof faceLandmarksDetection !== 'undefined' && typeof faceLandmarksDetection.createDetector === 'function') {
                loadModel();
            } else {
                setTimeout(checkAndLoad, 100);
            }
        };
        
        checkAndLoad();
    }, []);

    const trackFace = useCallback(async () => {
        if (modelRef.current && videoElement && videoElement.readyState >= 3) {
            try {
                const faces = await modelRef.current.estimateFaces(videoElement, {
                    flipHorizontal: false
                });

                if (faces.length > 0 && faces[0].keypoints) {
                    const keypoints = faces[0].keypoints;

                    const noseTip = keypoints.find((p: any) => p.name === 'noseTip');
                    const leftEye = keypoints.find((p: any) => p.name === 'leftEye');
                    const rightEye = keypoints.find((p: any) => p.name === 'rightEye');
                    const forehead = keypoints.find((p: any) => p.name === 'midwayBetweenEyes') || keypoints[keypointMap.forehead];
                    
                    if (!noseTip || !leftEye || !rightEye || !forehead) {
                       setTrackingData(null);
                    } else {
                        const centerX = noseTip.x;
                        const centerY = (noseTip.y + forehead.y) / 2;
                        
                        const eyeDist = Math.sqrt(
                            Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2)
                        );
                        
                        const scale = (eyeDist / videoElement.videoWidth) * 5.5; 
                        const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * 180 / Math.PI;

                        setTrackingData({
                            x: (centerX / videoElement.videoWidth) * 100,
                            y: (centerY / videoElement.videoHeight) * 100,
                            scale,
                            angle,
                        });
                    }
                } else {
                    setTrackingData(null);
                }
            } catch (error) {
                console.error("Error during face estimation:", error);
                setTrackingData(null);
            }
        }
        animationFrameId.current = requestAnimationFrame(trackFace);
    }, [videoElement]);

    useEffect(() => {
        let isMounted = true;
        const startTracking = () => {
            if (!isMounted) return;
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            animationFrameId.current = requestAnimationFrame(trackFace);
        }
        
        if (isCameraOn && modelStatus === 'ready' && videoElement) {
            videoElement.addEventListener('loadeddata', startTracking);
            if (videoElement.readyState >= 3) {
                startTracking();
            }
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }

        return () => {
            isMounted = false;
            if (videoElement) {
                videoElement.removeEventListener('loadeddata', startTracking);
            }
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isCameraOn, modelStatus, videoElement, trackFace]);

    return { trackingData, modelStatus };
};