export default function RetroBadge() {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-44 h-44 sm:w-52 sm:h-52"
      aria-label="감자마켓 빈티지 배지"
    >
      <defs>
        <path id="rb-toparc" d="M 20,100 A 80,80 0 0,1 180,100" />
      </defs>

      {/* 배경 원 */}
      <circle cx="100" cy="100" r="97" fill="#faf3e2" />

      {/* 바깥 이중 링 */}
      <circle cx="100" cy="100" r="97" fill="none" stroke="#b0512f" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="91" fill="none" stroke="#b0512f" strokeWidth="0.75" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#c9b491" strokeWidth="0.5" strokeDasharray="3 4" />

      {/* 방위 별 장식 */}
      <text x="100" y="11" textAnchor="middle" fontSize="14" fill="#cf9a3c">★</text>
      <text x="5" y="104" textAnchor="middle" fontSize="10" fill="#cf9a3c">✦</text>
      <text x="195" y="104" textAnchor="middle" fontSize="10" fill="#cf9a3c">✦</text>
      <text x="170" y="38" textAnchor="middle" fontSize="9" fill="#cf9a3c">✦</text>
      <text x="30" y="38" textAnchor="middle" fontSize="9" fill="#cf9a3c">✦</text>
      <text x="170" y="169" textAnchor="middle" fontSize="9" fill="#cf9a3c">✦</text>
      <text x="30" y="169" textAnchor="middle" fontSize="9" fill="#cf9a3c">✦</text>

      {/* 위쪽 아치 텍스트 */}
      <text
        fontFamily="Oswald,sans-serif"
        fontSize="14"
        fill="#b0512f"
        letterSpacing="4"
        fontWeight="600"
      >
        <textPath href="#rb-toparc" startOffset="50%" textAnchor="middle">
          POTATO MARKET
        </textPath>
      </text>

      {/* 가로 장식선 */}
      <line x1="25" y1="65" x2="175" y2="65" stroke="#c9b491" strokeWidth="0.75" />
      <line x1="25" y1="148" x2="175" y2="148" stroke="#c9b491" strokeWidth="0.75" />

      {/* 감자 몸통 */}
      <path
        d="M 66 102 C 64 88, 74 74, 92 72 C 110 70, 130 78, 135 94 C 140 110, 128 128, 108 130 C 88 132, 64 118, 66 102 Z"
        fill="#c4883a"
      />
      {/* 감자 하이라이트 */}
      <path
        d="M 76 84 C 84 76, 102 74, 118 82"
        stroke="#e0a85c"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* 감자 눈 */}
      <circle cx="86" cy="100" r="4.5" fill="#7a4a18" />
      <circle cx="86" cy="100" r="2" fill="#3d2008" />
      <circle cx="116" cy="89" r="3.5" fill="#7a4a18" />
      <circle cx="116" cy="89" r="1.5" fill="#3d2008" />
      <circle cx="100" cy="116" r="2.5" fill="#7a4a18" />

      {/* 감자마켓 텍스트 */}
      <text
        x="100"
        y="160"
        textAnchor="middle"
        fontFamily="'Gowun Batang',serif"
        fontSize="18"
        fill="#2a2017"
        fontWeight="700"
      >
        감자마켓
      </text>

      {/* EST. 1974 */}
      <text
        x="100"
        y="175"
        textAnchor="middle"
        fontFamily="Oswald,sans-serif"
        fontSize="10"
        letterSpacing="3"
        fill="#b0512f"
      >
        EST. 1974
      </text>

      {/* 하단 작은 별 */}
      <text x="60" y="190" textAnchor="middle" fontSize="8" fill="#cf9a3c">✦</text>
      <text x="100" y="192" textAnchor="middle" fontSize="10" fill="#cf9a3c">★</text>
      <text x="140" y="190" textAnchor="middle" fontSize="8" fill="#cf9a3c">✦</text>
    </svg>
  );
}
