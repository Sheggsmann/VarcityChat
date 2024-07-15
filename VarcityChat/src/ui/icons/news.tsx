import Svg, { Path, SvgProps } from "react-native-svg";
const NewsSvg = (props: SvgProps) => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.5 7V17C21.5 20 20 22 16.5 22H8.5C5 22 3.5 20 3.5 17V7C3.5 4 5 2 8.5 2H16.5C20 2 21.5 4 21.5 7Z"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 4.5V6.5C15 7.6 15.9 8.5 17 8.5H19"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 13H12.5"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 17H16.5"
      stroke="#6B7280"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default NewsSvg;
