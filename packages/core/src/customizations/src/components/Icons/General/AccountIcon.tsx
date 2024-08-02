import type { IconProps } from '../../../typings/props'

const AccountIcon = ({ className, title }: IconProps) => {
  return (
    <svg
      className={className}
      width="19"
      height="22"
      viewBox="0 0 19 22"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}

      <path d="M0 19.7386V17.4776L0.171265 17.1751C0.923791 15.8626 1.91505 14.7449 3.11909 13.8579C4.71237 12.689 6.53401 11.9968 8.55285 11.8071C9.02513 11.761 9.99563 11.761 10.4679 11.8071C14.0281 12.1455 17.085 14.0989 18.8443 17.1648L19 17.4314V21.9945H0V19.7335V19.7386ZM17.5624 19.2156V17.7391L17.4898 17.616C17.2977 17.2981 17.0331 16.9085 16.9552 16.8162C16.9396 16.7957 16.8774 16.7239 16.8255 16.6521C16.4414 16.1343 15.7045 15.4063 15.1803 15.0269C15.1076 14.9756 15.0298 14.9192 15.0142 14.8987C14.8896 14.7859 14.2772 14.3962 13.9451 14.2219C13.6804 14.0784 13.0732 13.7913 13.0369 13.7913C13.0213 13.7913 12.9642 13.7708 12.9071 13.7451C12.6373 13.6221 11.9055 13.3965 11.5422 13.3247C11.4384 13.3042 11.2516 13.2683 11.127 13.2427C10.4523 13.1094 9.23272 13.0684 8.45944 13.1555C7.98716 13.2068 7.41109 13.3144 7.02185 13.4272C6.58072 13.5554 6.25376 13.6631 6.07211 13.7451C6.01502 13.7708 5.95793 13.7913 5.94237 13.7913C5.90604 13.7913 5.29883 14.0784 5.03414 14.2219C4.70199 14.4014 4.09478 14.7859 3.96504 14.8987C3.94428 14.9141 3.87162 14.9756 3.79896 15.0269C3.27479 15.4063 2.53783 16.1343 2.15378 16.6521C2.10188 16.7239 2.0448 16.8008 2.02404 16.8162C1.941 16.9085 1.67632 17.2981 1.47391 17.6314L1.39088 17.7698V20.6871H17.5572V19.2105L17.5624 19.2156ZM9.00437 10.2382C8.03387 10.1408 7.14122 9.78706 6.32641 9.18208C6.08768 9.00263 5.59465 8.52069 5.41819 8.28485C4.5982 7.21331 4.21934 5.93668 4.34389 4.67544C4.46845 3.44495 4.97706 2.37854 5.84895 1.5172C6.25895 1.11216 6.65856 0.825051 7.15679 0.5687C8.01311 0.127777 9.03551 -0.0721759 9.98006 0.0201103C11.2256 0.143159 12.3051 0.645606 13.177 1.50694C13.9347 2.25549 14.4174 3.15784 14.6146 4.18324C14.8896 5.63419 14.5419 7.05949 13.6129 8.2746C13.4313 8.51044 12.9435 8.9975 12.7047 9.17182C11.6097 9.98702 10.3122 10.3613 9.00437 10.228V10.2382ZM9.89702 8.91035C11.2256 8.76166 12.3518 7.99261 12.9383 6.82878C13.6337 5.44961 13.4157 3.82435 12.3778 2.64514C11.9678 2.17858 11.3554 1.77867 10.7533 1.57359C9.94892 1.30186 9.08222 1.30186 8.28298 1.57359C7.68096 1.77355 7.06856 2.17858 6.65856 2.64514C5.37667 4.10121 5.37667 6.19816 6.65856 7.65423C7.44742 8.54633 8.71893 9.03852 9.90221 8.91035H9.89702Z" />
    </svg>
  )
}

export default AccountIcon
