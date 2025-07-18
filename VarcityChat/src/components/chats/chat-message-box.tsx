import { StyleSheet } from "react-native";
import { View, colors } from "@/ui";
import {
  IMessage,
  Message,
  MessageProps,
  isSameDay,
  isSameUser,
} from "react-native-gifted-chat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { memo, useEffect, useRef } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type ChatMessageBoxProps = {
  setReplyOnSwipe: (message: IMessage, swipeable: SwipeableMethods) => void;
} & MessageProps<IMessage>;

function ChatMessageBox({ setReplyOnSwipe, ...props }: ChatMessageBoxProps) {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  useEffect(() => {
    return () => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };
  }, []);

  const isNextMyMessage =
    props.currentMessage &&
    props.nextMessage &&
    isSameUser(props.currentMessage, props.nextMessage) &&
    isSameDay(props.currentMessage, props.nextMessage);

  const renderLeftAction = (progress: SharedValue<number>) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(progress.value, [0, 0.1, 1], [0.1, 0.4, 1], {
        extrapolateRight: Extrapolation.CLAMP,
      });
      const translateX = interpolate(
        progress.value,
        [0, 0.2, 1],
        [-20, 0, 10],
        {
          extrapolateRight: Extrapolation.CLAMP,
        }
      );
      const opacity = interpolate(progress.value, [0, 0.1, 1], [0.3, 0.7, 1], {
        extrapolateRight: Extrapolation.CLAMP,
      });

      return {
        transform: [{ scale }, { translateX }],
        opacity,
      };
    });

    return (
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          isNextMyMessage
            ? styles.defaultBottomOffset
            : styles.bottomOffsetNext,
          props.position === "left" && styles.leftOffsetValue,
        ]}
      >
        <View style={styles.replyImageWrapper}>
          <MaterialCommunityIcons
            name="reply-circle"
            size={26}
            color={colors.grey[300]}
          />
        </View>
      </Animated.View>
    );
  };

  const onSwipeOpenAction = () => {
    if (props.currentMessage && swipeableRef.current) {
      try {
        const messageCopy = { ...props.currentMessage };
        if (swipeableRef?.current) {
          setReplyOnSwipe(messageCopy, swipeableRef.current);
        }
      } catch (error) {
        console.error("Error in onSwipeOpenAction:", error);
        swipeableRef.current?.close();
      }
    }
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootLeft={false}
      renderLeftActions={renderLeftAction}
      onSwipeableWillOpen={onSwipeOpenAction}
      dragOffsetFromLeftEdge={1}
      hitSlop={{ right: 20 }}
      containerStyle={{
        marginLeft: 4,
      }}
    >
      <Message
        {...props}
        linkStyle={{
          right: {
            color: colors.success[600],
          },
          left: {
            color: colors.success[600],
          },
        }}
      />
    </Swipeable>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 40,
  },
  replyImageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  replyImage: {
    width: 20,
    height: 20,
  },
  defaultBottomOffset: {
    marginBottom: 2,
  },
  bottomOffsetNext: {
    marginBottom: 10,
  },
  leftOffsetValue: {
    marginRight: 10,
  },
});

export default memo(ChatMessageBox);
