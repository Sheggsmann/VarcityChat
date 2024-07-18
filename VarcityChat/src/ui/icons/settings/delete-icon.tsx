import Svg, { Rect, Path, SvgProps } from "react-native-svg";
const DeleteIcon = (props: SvgProps) => (
  <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" {...props}>
    <Rect width={30} height={30} rx={15} fill="#FCEBEB" />
    <Path
      d="M22.5584 9.35866C21.2167 9.22533 19.875 9.12533 18.525 9.05033V9.04199L18.3417 7.95866C18.2167 7.19199 18.0334 6.04199 16.0834 6.04199H13.9C11.9584 6.04199 11.775 7.14199 11.6417 7.95033L11.4667 9.01699C10.6917 9.06699 9.91672 9.11699 9.14172 9.19199L7.44172 9.35866C7.09172 9.39199 6.84172 9.70033 6.87505 10.042C6.90838 10.3837 7.20838 10.6337 7.55838 10.6003L9.25838 10.4337C13.625 10.0003 18.0251 10.167 22.4417 10.6087C22.4667 10.6087 22.4834 10.6087 22.5084 10.6087C22.8251 10.6087 23.1 10.367 23.1334 10.042C23.1584 9.70033 22.9084 9.39199 22.5584 9.35866Z"
      fill="#E53333"
    />
    <Path
      d="M21.025 11.783C20.825 11.5747 20.55 11.458 20.2666 11.458H9.73329C9.44995 11.458 9.16662 11.5747 8.97495 11.783C8.78329 11.9913 8.67495 12.2747 8.69162 12.5663L9.20829 21.1163C9.29995 22.383 9.41662 23.9663 12.325 23.9663H17.675C20.5833 23.9663 20.7 22.3913 20.7916 21.1163L21.3083 12.5747C21.325 12.2747 21.2166 11.9913 21.025 11.783ZM16.3833 19.7913H13.6083C13.2666 19.7913 12.9833 19.508 12.9833 19.1663C12.9833 18.8247 13.2666 18.5413 13.6083 18.5413H16.3833C16.725 18.5413 17.0083 18.8247 17.0083 19.1663C17.0083 19.508 16.725 19.7913 16.3833 19.7913ZM17.0833 16.458H12.9166C12.575 16.458 12.2916 16.1747 12.2916 15.833C12.2916 15.4913 12.575 15.208 12.9166 15.208H17.0833C17.425 15.208 17.7083 15.4913 17.7083 15.833C17.7083 16.1747 17.425 16.458 17.0833 16.458Z"
      fill="#E53333"
    />
  </Svg>
);
export default DeleteIcon;
