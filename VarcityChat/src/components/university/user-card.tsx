import { HEIGHT, View, Text, TouchableOpacity, Image } from "@/ui";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { IUser } from "@/types";
import HeartSvg from "@/ui/icons/university/heart-svg";

const CARD_HEIGHT = HEIGHT / 3;

interface IUserCardProps {
  user: IUser;
}

export default function UserCard({ user }: IUserCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className={`relative flex flex-1 mb-8 bg-grey-50 rounded-lg dark:bg-grey-800 overflow-hidden`}
      onPress={() => router.push("/home/users/user1")}
      activeOpacity={0.7}
      style={{ height: CARD_HEIGHT }}
    >
      {user.isNew && (
        <View className="absolute top-3 left-3 z-10 flex items-center justify-center w-[50px] h-[34px] rounded-full bg-white dark:bg-[rgba(30,30,30,1)]">
          <Text className="text-primary-500 dark:text-primary-500">New</Text>
        </View>
      )}

      <TouchableOpacity className="absolute right-3 top-3 z-10 w-[31px] h-[31px] flex items-center justify-center rounded-lg bg-grey-100">
        <HeartSvg />
      </TouchableOpacity>

      <View className="w-full h-full">
        {user.images ? (
          <Image
            source={user.images[0]}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : null}
      </View>

      <BlurView
        intensity={30}
        tint="dark"
        className="absolute bottom-0 left-0 right-0 flex-row z-10 w-full h-[26%] bg-green-200 px-4 items-center"
      >
        <View className="flex-1">
          <View className="flex-row gap-2 mb-1">
            {user.hobbies.slice(0, 3).map((hobby, index) => (
              <Text className="text-sm text-grey-50" key={`hobby-${index}`}>
                {hobby}
              </Text>
            ))}
            {user.hobbies.length > 3 && (
              <Text className="text-sm text-grey-50">
                +{user.hobbies.length - 3} more
              </Text>
            )}
          </View>

          <Text className="font-semibold text-white text-lg">
            {user.fullName}
          </Text>
        </View>
        <View className="">
          <Text className="text-sm text-grey-50 mb-1">Looking for:</Text>
          <Text className="text-white text-base font-semibold">
            {user.lookingFor}
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}
