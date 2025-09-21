import * as React from "react";
const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={1000}
    height={1000}
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <g clipPath="url(#a)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width}
        height={props.height}
        viewBox="0 0 56 56"
        fill="none"
        {...props}
      >
        <path
          d="m41 13.333-1.632-1.173-10.783-7.741a1 1 0 0 0-1.166 0L2.417 22.366a1 1 0 0 0-.417.812v9.641a1 1 0 0 0 .417.813l25.002 17.95a1 1 0 0 0 1.166 0l24.998-17.95a1 1 0 0 0 .417-.813v-9.64a1 1 0 0 0-.417-.813zM27.419 9.118a1 1 0 0 1 1.166 0l6.379 4.579a1 1 0 0 1 0 1.625l-3.026 2.17a.64.64 0 0 1-.743-.001l-2.61-1.873a1 1 0 0 0-1.166 0l-8.685 6.235a1 1 0 0 0 0 1.625l2.432 1.745 3.272 2.353 2.98 2.139a1 1 0 0 0 1.167 0l8.685-6.24a1 1 0 0 0 0-1.624l-2.058-1.48a.328.328 0 0 1 0-.532l3.575-2.564a1 1 0 0 1 1.166 0l6.376 4.578a1 1 0 0 1 0 1.625l-3.027 2.173-14.715 10.566a1 1 0 0 1-1.166 0l-7.51-5.392-3.273-2.347-3.935-2.825-3.026-2.173a1 1 0 0 1 0-1.625z"
          fill="#16171B"
        />
      </svg>
    </g>
  </svg>
);
export default Logo;
