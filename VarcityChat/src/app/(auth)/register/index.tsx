import { View } from "@/ui";
import {
  FlatList,
  ViewToken,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { memo, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import RegisterItem from "@/components/register/register-item";
import GenderSelect from "@/components/register/gender-select";
import Paginator from "@/components/register/paginator";
import PersonalInformationForm from "@/components/register/personal-information";
import Personality from "@/components/register/personality";
import BackButton from "@/components/back-button";

const MemoizedPersonality = memo(Personality);

export default function Index() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const viewableItemChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      setCurrentIndex(viewableItems[0]?.index ?? 0);
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 20 }).current;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const onNextPress = (index: number) => {
    slideRef.current?.scrollToIndex({ index, animated: true });
  };

  const slides = useMemo(
    () => [
      {
        id: "gender",
        component: (
          <View className="flex flex-1 px-8">
            <GenderSelect onNextPress={() => onNextPress(1)} />
          </View>
        ),
      },
      {
        id: "personal-information",
        component: (
          <View className="flex flex-1 px-8">
            <PersonalInformationForm onNextPress={() => onNextPress(2)} />
          </View>
        ),
      },
      {
        id: "personality",
        component: (
          <View className="flex flex-1 px-8">
            <MemoizedPersonality />
          </View>
        ),
      },
    ],
    []
  );

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          className={`flex flex-1 ${Platform.select({
            ios: "py-4",
            android: "py-12",
          })}`}
          scrollEnabled={currentIndex > 0}
        >
          <View className="flex flex-row items-center justify-between px-6">
            <BackButton
              onPress={() => {
                if (currentIndex === 0) {
                  router.back();
                  return;
                }
                if (currentIndex === 1) {
                  slideRef.current?.scrollToIndex({ index: 0, animated: true });
                  return;
                }
                slideRef.current?.scrollToIndex({ index: 1, animated: true });
              }}
            />
            <Paginator data={[1, 2, 3]} currentIndex={currentIndex} />
            <View className="w-[35px]" />
          </View>

          <View className="flex-3">
            <Animated.FlatList
              data={slides}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RegisterItem>{item.component}</RegisterItem>
              )}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              bounces={false}
              scrollEnabled={false}
              scrollEventThrottle={32}
              onScroll={scrollHandler}
              onViewableItemsChanged={viewableItemChanged}
              viewabilityConfig={viewConfig}
              ref={slideRef}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
