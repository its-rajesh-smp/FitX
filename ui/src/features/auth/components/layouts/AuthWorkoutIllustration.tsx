export function AuthWorkoutIllustration() {
  return (
    <svg
      viewBox="0 0 520 240"
      role="img"
      aria-label="A personalized weekly workout plan"
      className="h-auto w-full max-w-md"
    >
      <defs>
        <linearGradient id="auth-card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" stopOpacity=".22" />
          <stop offset="1" stopColor="white" stopOpacity=".08" />
        </linearGradient>
      </defs>

      <circle cx="440" cy="46" r="30" fill="white" fillOpacity=".08" />
      <circle cx="42" cy="196" r="20" fill="white" fillOpacity=".08" />

      <rect
        x="54"
        y="28"
        width="412"
        height="184"
        rx="28"
        fill="url(#auth-card)"
        stroke="white"
        strokeOpacity=".2"
      />

      <rect
        x="82"
        y="56"
        width="192"
        height="128"
        rx="20"
        fill="white"
        fillOpacity=".12"
      />
      <rect
        x="104"
        y="80"
        width="86"
        height="10"
        rx="5"
        fill="white"
        fillOpacity=".85"
      />
      <rect
        x="104"
        y="100"
        width="134"
        height="7"
        rx="3.5"
        fill="white"
        fillOpacity=".32"
      />
      <rect
        x="104"
        y="126"
        width="40"
        height="34"
        rx="10"
        fill="white"
        fillOpacity=".2"
      />
      <rect
        x="153"
        y="126"
        width="40"
        height="34"
        rx="10"
        fill="white"
        fillOpacity=".34"
      />
      <rect
        x="202"
        y="126"
        width="40"
        height="34"
        rx="10"
        fill="white"
        fillOpacity=".2"
      />
      <path
        d="m114 143 7 7 13-16"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="m163 143 7 7 13-16"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />

      <rect
        x="298"
        y="56"
        width="138"
        height="72"
        rx="20"
        fill="white"
        fillOpacity=".14"
      />
      <circle cx="328" cy="92" r="17" fill="white" fillOpacity=".2" />
      <path
        d="M316 92h24m-19-7v14m14-14v14"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <rect
        x="357"
        y="78"
        width="54"
        height="8"
        rx="4"
        fill="white"
        fillOpacity=".8"
      />
      <rect
        x="357"
        y="96"
        width="38"
        height="6"
        rx="3"
        fill="white"
        fillOpacity=".3"
      />

      <rect
        x="298"
        y="142"
        width="138"
        height="42"
        rx="16"
        fill="white"
        fillOpacity=".14"
      />
      <path
        d="m320 166 16-13 13 8 20-17 25 13 18-10"
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <circle cx="412" cy="147" r="4" fill="white" />
    </svg>
  );
}
