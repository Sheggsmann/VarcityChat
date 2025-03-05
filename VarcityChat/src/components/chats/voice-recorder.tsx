import { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity, IS_IOS } from "@/ui";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/ui";
import { useColorScheme } from "nativewind";
import { Platform, StyleSheet } from "react-native";
import { formatDuration } from "@/core/utils";
import { IOSOutputFormat } from "expo-av/build/Audio";
import SendSvg from "@/ui/icons/chat/send-svg";

const VOICE_RECORDER_HEIGHT = 55;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface VoiceRecorderProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onSend: (audioUri: string) => void;
  onCancel?: () => void;
}

export const VoiceRecorder = ({
  isRecording,
  setIsRecording,
  onSend,
  onCancel,
}: VoiceRecorderProps) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasUnloadedRef = useRef(false);
  const audioLevels = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const buttonHeight = useSharedValue(0);
  const waveOpacity = useSharedValue(0);

  // Wave animation for recording visualization
  const waveValues = Array(20)
    .fill(0)
    .map((_, i) => ({
      height: useSharedValue(3 + Math.random() * 5),
      speed: 300 + Math.random() * 500,
    }));

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(containerHeight.value, {
        duration: IS_IOS ? 200 : 50,
      }),
      opacity: interpolate(
        containerHeight.value,
        [0, VOICE_RECORDER_HEIGHT],
        [0, 1],
        "clamp"
      ),
    };
  });

  const sendButtonstyle = useAnimatedStyle(() => {
    return {
      height: withTiming(buttonHeight.value, { duration: 200 }),
    };
  });

  const waveContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: waveOpacity.value,
    };
  });

  // Create wave animations
  const waveStyles = waveValues.map(({ height, speed }, index) => {
    return useAnimatedStyle(() => {
      const h = interpolate(
        audioLevels.value,
        [0, 0.5, 1],
        [height.value * 0.5, height.value * 1.5, height.value * 2.5]
      );

      return {
        height: withSequence(
          withTiming(h, { duration: speed }),
          withTiming(height.value, { duration: speed })
        ),
      };
    });
  });

  // Pause/resume recording
  const togglePause = async () => {
    if (!recording) return;
    try {
      if (isPaused) {
        // Resume recording
        await recording.startAsync();
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
          audioLevels.value = Math.random();
        }, 1000);
      } else {
        // Pause recording
        await recording.pauseAsync();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
      setIsPaused(!isPaused);
    } catch (error) {
      console.error("Failed to toggle pause", error);
    }
  };

  // Start recording function
  const startRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      wasUnloadedRef.current = false;

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        staysActiveInBackground: false,
      });

      const newRecording = new Audio.Recording();
      const { ios, android } = Audio.RecordingOptionsPresets.HIGH_QUALITY;

      setDuration(0);
      setIsRecording(true);
      containerHeight.value = VOICE_RECORDER_HEIGHT;
      waveOpacity.value = withTiming(1, { duration: 300 });

      await newRecording.prepareToRecordAsync({
        android,
        ios: {
          ...ios,
          extension: ".m4a",
          outputFormat: IOSOutputFormat.MPEG4AAC,
        },
      } as Audio.RecordingOptions);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
        // Simulate audio levels - in a real app you would use actual audio levels
        audioLevels.value = Math.random();
      }, 1000);
    } catch (error) {
      console.log("Failed to start recording:", error);
    }
  };

  // Stop recording and get the file
  const stopRecording = async () => {
    if (!recording) return;
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      wasUnloadedRef.current = true;

      const uri = recording.getURI();
      waveOpacity.value = withTiming(0, { duration: 300 });
      setRecording(null);

      if (uri) {
        setAudioUri(uri);
        return uri;
      }
      return null;
    } catch (error) {
      console.error("Failed to stop recording", error);
      return null;
    }
  };

  const handleCancel = async () => {
    if (recording) {
      try {
        console.log("Canceling the recording");
        wasUnloadedRef.current = true;
        await recording.stopAndUnloadAsync();

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: false,
        });
      } catch (error) {
        console.error("Error stoppign recording during cancel:", error);
      }
    }

    setTimeout(() => {
      resetRecorder();
      onCancel?.();
    }, 300);
  };

  // Reset the recorder state
  const resetRecorder = async () => {
    setRecording(null);
    setAudioUri(null);
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    containerHeight.value = 0;
    audioLevels.value = 0;
    wasUnloadedRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSend = async () => {
    const uri = await stopRecording();
    if (uri) {
      onSend(uri);
      resetRecorder();
    }
  };

  useEffect(() => {
    startRecording();
  }, []);

  // Clean up on unmonut
  useEffect(() => {
    return () => {
      console.log("CALLING CLEANUP IN VOICE RECORDER:");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (recording && !wasUnloadedRef.current) {
        console.log("RESETTING THE RECORDER:");
        (async () => {
          try {
            console.log("Cleaning up recording on unmount");
            await recording.stopAndUnloadAsync();
            wasUnloadedRef.current = true;

            // Reset audio mode
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: false,
              staysActiveInBackground: false,
              playsInSilentModeIOS: false,
            });
          } catch (error) {
            console.error("Error cleaning up recording:", error);
          }
        })();
      }

      // resetRecorder();

      // if (recording && !wasUnloadedRef.current) {

      // (async () => {
      //   try {
      //     await recording.stopAndUnloadAsync();
      //     resetRecorder();
      //     wasUnloadedRef.current = true;
      //     await Audio.setAudioModeAsync({
      //       allowsRecordingIOS: false,
      //       staysActiveInBackground: false,
      //       playsInSilentModeIOS: false,
      //     });
      //   } catch (error) {
      //     console.error("Error cleaning up recording:", error);
      //   }
      // })();

      // console.log("RESETTING THE RECORDER");
      // }
    };
  }, [recording]);

  return (
    <Animated.View
      className="w-full flex-row items-center py-2 px-4 bg-white dark:bg-black"
      style={[containerStyle]}
    >
      {isRecording && (
        <TouchableOpacity
          className="w-7 h-7 flex flex-row items-center justify-center rounded-full mr-6"
          onPress={handleCancel}
        >
          <Ionicons name="close" size={18} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
      )}

      {(isRecording || audioUri) && (
        <>
          <View className="flex-row flex-1 items-center">
            {!audioUri && (
              <Animated.View
                style={[waveContainerStyle]}
                className="flex-row justify-center items-end my-2"
              >
                {waveStyles.map((style, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.wave,
                      style,
                      {
                        backgroundColor: isPaused
                          ? colors.grey[400]
                          : colors.primary[500],
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            )}
            <Text className="text-base text-primary-500 font-semibold ml-4">
              {formatDuration(duration)}
            </Text>
          </View>
        </>
      )}

      {isRecording && (
        <AnimatedTouchableOpacity
          className="justify-center items-center"
          style={[sendButtonstyle]}
          onPress={handleSend}
        >
          <SendSvg width={30} height={30} />
        </AnimatedTouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wave: {
    width: 2,
    height: 5,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});
