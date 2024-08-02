import { colors } from '../../../../constants/colors'

const EditorsChoiceHome = () => {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_1650_5216"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="44"
        height="44"
      >
        <circle cx="22" cy="22" r="22" fill={`var(${colors.maroon.token})`} />
      </mask>
      <g mask="url(#mask0_1650_5216)">
        <circle cx="22" cy="22" r="22" fill="#E5412F" />
        <path
          d="M32.7925 52.0942L15.7736 35.0753V23.6602H16.8114L21.5849 25.3206L25.3208 23.6602L28.0189 22.415L28.8491 17.0187V12.0376L68.4906 51.6791L32.7925 52.0942Z"
          fill="#B3291A"
        />
      </g>
      <path
        d="M21.6828 9.13184C16.8145 9.13184 12.8679 13.0784 12.8679 17.9468C12.8679 22.8151 16.8145 26.7617 21.6828 26.7617C26.5512 26.7617 30.4978 22.8151 30.4978 17.9468C30.4978 13.0784 26.5512 9.13184 21.6828 9.13184ZM21.6828 11.4825C25.253 11.4825 28.1471 14.3766 28.1471 17.9468C28.1471 21.5169 25.253 24.411 21.6828 24.411C18.1127 24.411 15.2186 21.5169 15.2186 17.9468C15.2186 14.3766 18.1127 11.4825 21.6828 11.4825ZM15.5124 26.8811V35.2828L21.6828 30.8753L27.8533 35.2828V26.8811C26.1749 28.2706 24.0258 28.9654 21.6828 28.9654C19.3399 28.9654 17.1908 28.2706 15.5124 26.8811Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.3815 16.2235L21.0829 21.2259C20.8904 21.4077 20.5762 21.4029 20.39 21.2155L17.3723 18.1776L18.7541 16.8647L20.377 18.5837C20.5612 18.7788 20.8817 18.7877 21.0777 18.6031L24.9855 14.9241L26.3815 16.2235Z"
        fill="white"
      />
    </svg>
  )
}

export default EditorsChoiceHome
