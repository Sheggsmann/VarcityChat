import { View, Text, Image, TouchableOpacity, Button, Pressable } from "@/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import { maleImg, femaleImg } from "@/ui/images";

interface GenderSelectProps {
  onNextPress?: () => void;
}

export default function GenderSelect({ onNextPress }: GenderSelectProps) {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female">("male");
  const isMale = gender === "male";

  return (
    <View className="flex flex-1 items-center justify-center -mt-16">
      <Text className="font-bold text-2xl">I am a</Text>
      <Text className="text-grey-500 dark:text-grey-200">
        This is to help us Personalize your experience
      </Text>

      <View className="flex my-20">
        {isMale ? (
          <Image source={maleImg} className="w-[200px] h-[200px]" />
        ) : (
          <Image source={femaleImg} className="w-[200px] h-[200px]" />
        )}
      </View>

      <View className="flex flex-row items-center gap-6 w-full">
        <TouchableOpacity
          onPress={() => setGender("male")}
          activeOpacity={0.7}
          className={`flex flex-1 items-center justify-center p-2 rounded-full border 
            ${isMale ? "bg-primary-50" : "bg-grey-50 dark:bg-grey-800"}
          ${
            !isMale
              ? "border-grey-50 dark:border-grey-800"
              : "border-primary-500"
          }
            `}
        >
          <Text
            className={`text-xl
            ${
              isMale
                ? "text-primary-600 dark:text-primary-600"
                : "text-grey-500 dark:text-grey-300"
            }
            `}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setGender("female")}
          activeOpacity={0.7}
          className={`flex flex-1 items-center justify-center p-2 rounded-full border ${
            !isMale ? "bg-primary-50" : "bg-grey-50 dark:bg-grey-800"
          }
          ${
            isMale
              ? "border-grey-50 dark:border-grey-800"
              : "border-primary-500"
          }
          `}
        >
          <Text
            className={`text-xl ${
              !isMale
                ? "text-primary-600 dark:text-primary-600"
                : "text-grey-500 dark:text-grey-300"
            }`}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-full mt-12">
        <Button
          label="Next"
          className="w-full items-center justify-center"
          onPress={onNextPress}
        />
        <Pressable
          onPress={() => {
            router.navigate("/login");
          }}
        >
          <Text className="text-center mt-2 font-bold text-primary-500 p-3">
            I have an account!
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
