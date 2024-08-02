import type { IconProps } from '../../../typings/props'

const ShareIcon = ({ className, title }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="22"
      height="26"
      fill="currentColor"
      stroke="currentColor"
      viewBox="0 0 22 26"
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M7.66667 12.3333C7.66667 13.2174 7.31548 14.0652 6.69036 14.6904C6.06523 15.3155 5.21739 15.6667 4.33333 15.6667C3.44928 15.6667 2.60143 15.3155 1.97631 14.6904C1.35119 14.0652 1 13.2174 1 12.3333C1 11.4493 1.35119 10.6014 1.97631 9.97631C2.60143 9.35119 3.44928 9 4.33333 9C5.21739 9 6.06523 9.35119 6.69036 9.97631C7.31548 10.6014 7.66667 11.4493 7.66667 12.3333Z"
        strokeWidth="1.25"
      />
      <path
        d="M14.76 19.404L7.66669 14.7213M14.8934 6.12134L7.80002 10.8013"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M21 21.6667C21 22.5507 20.6488 23.3986 20.0237 24.0237C19.3985 24.6488 18.5507 25 17.6666 25C16.7826 25 15.9347 24.6488 15.3096 24.0237C14.6845 23.3986 14.3333 22.5507 14.3333 21.6667C14.3333 20.7826 14.6845 19.9348 15.3096 19.3096C15.9347 18.6845 16.7826 18.3333 17.6666 18.3333C18.5507 18.3333 19.3985 18.6845 20.0237 19.3096C20.6488 19.9348 21 20.7826 21 21.6667ZM21 4.33333C21 5.21739 20.6488 6.06523 20.0237 6.69036C19.3985 7.31548 18.5507 7.66667 17.6666 7.66667C16.7826 7.66667 15.9347 7.31548 15.3096 6.69036C14.6845 6.06523 14.3333 5.21739 14.3333 4.33333C14.3333 3.44928 14.6845 2.60143 15.3096 1.97631C15.9347 1.35119 16.7826 1 17.6666 1C18.5507 1 19.3985 1.35119 20.0237 1.97631C20.6488 2.60143 21 3.44928 21 4.33333Z"
        strokeWidth="1.25"
      />
    </svg>
  )
}

export default ShareIcon
