import { Tabs } from "expo-router";
import { Image, View, colors } from "@/ui";
import { femaleImg } from "@/ui/images";
import { useColorScheme } from "nativewind";
import ChatsActive from "@/ui/icons/chats-active";
import Discover from "@/ui/icons/discover";
import DiscoverActive from "@/ui/icons/discover-active";
import ChatsSvg from "@/ui/icons/chats";
import NewsActive from "@/ui/icons/news-active";
import NewsSvg from "@/ui/icons/news";
import CallsActive from "@/ui/icons/calls-active";
import CallsSvg from "@/ui/icons/calls";

export const unstable_settings = {
  initialRouteName: "discover",
};

const TabNavigation = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 13 },
        tabBarStyle: {
          paddingTop: 4,
          backgroundColor: isDark ? colors.black : colors.white,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) =>
            focused ? <DiscoverActive /> : <Discover />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ focused }) =>
            focused ? <ChatsActive /> : <ChatsSvg />,
          tabBarBadge: 4,
          tabBarBadgeStyle: {
            fontSize: 8,
            minWidth: 18,
            height: 18,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 2,
          },
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ focused }) => (focused ? <NewsActive /> : <NewsSvg />),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Calls",
          tabBarIcon: ({ focused }) =>
            focused ? <CallsActive /> : <CallsSvg />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => {
            return (
              <View className="w-[28px] h-[28px] rounded-full overflow-hidden">
                <Image
                  source={femaleImg}
                  className="object-cover w-full h-full rounded-full"
                />
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabNavigation;
