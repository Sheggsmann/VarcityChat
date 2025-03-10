import { View, Text } from "@/ui";
import { ReactNode } from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "./back-button";
import { useRouter } from "expo-router";
import { FlatList, ListRenderItem, SectionList, ViewStyle } from "react-native";
import { StyleProp } from "react-native";

export const HEADER_HEIGHT = 60;

type ListComponent = typeof FlatList | typeof SectionList;

interface AnimatedListProps<T> {
  component: ListComponent;
  data?: T[];
  renderItem: ListRenderItem<T>;
  renderSectionHeader?: (info: {
    section: { title: string; data: T[] };
  }) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  [key: string]: any;
}

interface HeaderProps<T = any> {
  title: string;
  showHeaderLeft?: boolean;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  children?: ReactNode;
  listProps?: AnimatedListProps<T>;
  useScrollView?: boolean;
}

export default function Header({
  title,
  headerRight,
  children,
  showHeaderLeft = true,
  listProps,
  useScrollView = true,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: withTiming(scrollY.value > 0 ? 0.5 : 0, {
        duration: 300,
      }),
      elevation: withTiming(scrollY.value > 0 ? 4 : 0, { duration: 300 }),
    };
  });

  const contentContainerStyle = { paddingTop: HEADER_HEIGHT + insets.top };

  const renderHeader = () => (
    <Animated.View
      className="absolute top-0 left-0 right-0 bg-white z-10 border-b-grey-100 dark:bg-charcoal-950 dark:border-b-charcoal-800"
      style={[
        headerStyle,
        { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top },
      ]}
    >
      <View className="flex flex-row items-center justify-between py-4 px-6">
        <View className="flex-1">
          {showHeaderLeft && (
            <BackButton
              onPress={() => {
                router.canGoBack() && router.back();
              }}
            />
          )}
        </View>
        <View className="items-center">
          <Text className="font-sans-bold text-lg">{title}</Text>
        </View>
        <View className="flex-1 items-end">{headerRight}</View>
      </View>
    </Animated.View>
  );

  const renderContent = () => {
    if (useScrollView) {
      return (
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT + insets.top }}
          pointerEvents={"box-none"}
        >
          {/* Content Goes Here */}
          {children}
        </Animated.ScrollView>
      );
    }

    if (listProps) {
      const {
        component,
        contentContainerStyle: listContentStyle,
        ...restProps
      } = listProps;

      const AnimatedListComponent = Animated.createAnimatedComponent(
        component as React.ComponentType<any>
      );

      return (
        <AnimatedListComponent
          {...restProps}
          contentContainerStyle={[contentContainerStyle, listContentStyle]}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      );
    }

    return <View style={contentContainerStyle}>{children}</View>;
  };
  return (
    <View className="flex flex-1">
      {renderHeader()}
      {renderContent()}
    </View>
  );
}
