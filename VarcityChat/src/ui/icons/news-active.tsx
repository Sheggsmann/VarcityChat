import Svg, { Path, SvgProps } from "react-native-svg";
const NewsActive = (props: SvgProps) => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.5 2H8.5C5 2 3.5 4 3.5 7V17C3.5 20 5 22 8.5 22H16.5C20 22 21.5 20 21.5 17V7C21.5 4 20 2 16.5 2ZM8.5 12.25H12.5C12.91 12.25 13.25 12.59 13.25 13C13.25 13.41 12.91 13.75 12.5 13.75H8.5C8.09 13.75 7.75 13.41 7.75 13C7.75 12.59 8.09 12.25 8.5 12.25ZM16.5 17.75H8.5C8.09 17.75 7.75 17.41 7.75 17C7.75 16.59 8.09 16.25 8.5 16.25H16.5C16.91 16.25 17.25 16.59 17.25 17C17.25 17.41 16.91 17.75 16.5 17.75ZM19 9.25H17C15.48 9.25 14.25 8.02 14.25 6.5V4.5C14.25 4.09 14.59 3.75 15 3.75C15.41 3.75 15.75 4.09 15.75 4.5V6.5C15.75 7.19 16.31 7.75 17 7.75H19C19.41 7.75 19.75 8.09 19.75 8.5C19.75 8.91 19.41 9.25 19 9.25Z"
      fill="#E53333"
    />
  </Svg>
);
export default NewsActive;
