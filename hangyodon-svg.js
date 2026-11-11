/**
 * Bespoke animated inline SVGs for Hangyodon, Sayuri, Seashell Badges,
 * and the Forgiveness Flowers Bouquet.
 */

window.HangyodonArt = (() => {
  const OUTLINE = '#1F4B57';

  function hangyodonSVG(mood = 'welcome', size = 190) {
    const blush = `<ellipse cx="62" cy="96" rx="10" ry="5.5" fill="#FF9EB5" opacity="0.72"/>
                   <ellipse cx="138" cy="96" rx="10" ry="5.5" fill="#FF9EB5" opacity="0.72"/>`;

    let eyes = `
      <circle cx="76" cy="76" r="15.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
      <circle cx="124" cy="76" r="15.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
      <circle class="h-pupil" cx="78" cy="77" r="7.2" fill="${OUTLINE}"/>
      <circle class="h-pupil" cx="122" cy="77" r="7.2" fill="${OUTLINE}"/>
      <circle cx="80.5" cy="73.5" r="2.6" fill="#FFFFFF"/>
      <circle cx="124.5" cy="73.5" r="2.6" fill="#FFFFFF"/>
    `;

    let mouth = `
      <path d="M78 106 Q100 96 122 106 Q128 114 118 119 Q100 126 82 119 Q72 114 78 106 Z"
            fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M81 112 Q100 119 119 112" fill="none" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
    `;

    let extras = '';
    let arms = `
      <path d="M56 142 Q34 134 36 118 Q44 114 58 130" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M144 142 Q166 134 164 118 Q156 114 142 130" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    `;

    if (mood === 'shy') {
      eyes = `
        <circle cx="76" cy="77" r="15.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="124" cy="77" r="15.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="79" cy="80" r="6.8" fill="${OUTLINE}"/>
        <circle cx="121" cy="80" r="6.8" fill="${OUTLINE}"/>
        <circle cx="81" cy="77" r="2.4" fill="#FFFFFF"/>
        <circle cx="123" cy="77" r="2.4" fill="#FFFFFF"/>
        <path d="M62 59 Q75 64 86 58" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M114 58 Q125 64 138 59" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M81 108 Q100 102 119 108 Q123 116 114 119 Q100 123 86 119 Q77 116 81 108 Z"
              fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M85 113 Q100 110 115 113" fill="none" stroke="${OUTLINE}" stroke-width="2.3" stroke-linecap="round"/>
      `;
      arms = `
        <path d="M58 140 Q74 155 90 148" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M142 140 Q126 155 110 148" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <path class="sweatdrop" d="M150 56 Q158 68 150 75 Q142 68 150 56 Z" fill="#9AE6FF" stroke="${OUTLINE}" stroke-width="2"/>
      `;
    } else if (mood === 'flowers' || mood === 'holding-flowers') {
      eyes = `
        <circle cx="76" cy="76" r="15.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="124" cy="76" r="15.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="78" cy="76" r="7.5" fill="${OUTLINE}"/>
        <circle cx="122" cy="76" r="7.5" fill="${OUTLINE}"/>
        <circle cx="80.5" cy="72" r="3" fill="#FFFFFF"/>
        <circle cx="124.5" cy="72" r="3" fill="#FFFFFF"/>
        <circle cx="74" cy="80" r="1.5" fill="#FFFFFF"/>
        <circle cx="118" cy="80" r="1.5" fill="#FFFFFF"/>
      `;
      arms = `
        <path d="M58 140 Q72 152 88 144" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M142 140 Q128 152 112 144" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <g transform="translate(76, 126)">
          <path d="M12 22 L24 44 L36 22 Z" fill="#FFF1D6" stroke="${OUTLINE}" stroke-width="2.4" stroke-linejoin="round"/>
          <circle cx="14" cy="14" r="7" fill="#FFB3C6" stroke="${OUTLINE}" stroke-width="2"/>
          <circle cx="24" cy="8" r="7.5" fill="#FFE082" stroke="${OUTLINE}" stroke-width="2"/>
          <circle cx="34" cy="14" r="7" fill="#D4C2FC" stroke="${OUTLINE}" stroke-width="2"/>
          <circle cx="24" cy="17" r="5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="1.8"/>
          <circle cx="24" cy="17" r="2.2" fill="#FFB703"/>
        </g>
      `;
    } else if (mood === 'cheering') {
      eyes = `
        <path d="M63 78 Q76 64 89 78" fill="none" stroke="${OUTLINE}" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M111 78 Q124 64 137 78" fill="none" stroke="${OUTLINE}" stroke-width="3.5" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M76 104 Q100 94 124 104 Q130 116 118 122 Q100 130 82 122 Q70 116 76 104 Z"
              fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M84 112 Q100 123 116 112" fill="#D94B6A" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      `;
      arms = `
        <path class="arm-wave-left" d="M56 138 Q26 114 32 92" fill="none" stroke="#5CC8BE" stroke-width="12" stroke-linecap="round"/>
        <path class="arm-wave-left" d="M56 138 Q26 114 32 92" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path class="arm-wave-right" d="M144 138 Q174 114 168 92" fill="none" stroke="#5CC8BE" stroke-width="12" stroke-linecap="round"/>
        <path class="arm-wave-right" d="M144 138 Q174 114 168 92" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <circle cx="28" cy="86" r="11" fill="#FFE082" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="172" cy="86" r="11" fill="#FFB3C6" stroke="${OUTLINE}" stroke-width="2.4"/>
        <path d="M40 38 L43 45 L50 48 L43 51 L40 58 L37 51 L30 48 L37 45 Z" fill="#FFE082" stroke="${OUTLINE}" stroke-width="1.5"/>
        <path d="M160 36 L163 42 L169 45 L163 48 L160 54 L157 48 L151 45 L157 42 Z" fill="#FFB3C6" stroke="${OUTLINE}" stroke-width="1.5"/>
      `;
    } else if (mood === 'pleading') {
      eyes = `
        <circle cx="76" cy="76" r="16.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="124" cy="76" r="16.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="77" cy="77" r="9.2" fill="${OUTLINE}"/>
        <circle cx="123" cy="77" r="9.2" fill="${OUTLINE}"/>
        <circle cx="80.5" cy="72" r="3.8" fill="#FFFFFF"/>
        <circle cx="126.5" cy="72" r="3.8" fill="#FFFFFF"/>
        <circle cx="73.5" cy="81" r="1.9" fill="#FFFFFF"/>
        <circle cx="119.5" cy="81" r="1.9" fill="#FFFFFF"/>
        <path d="M62 56 Q74 52 84 57" fill="none" stroke="${OUTLINE}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M138 56 Q126 52 116 57" fill="none" stroke="${OUTLINE}" stroke-width="2.6" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M84 109 Q100 103 116 109 Q120 116 112 118 Q100 121 88 118 Q80 116 84 109 Z"
              fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M89 113 Q100 110 111 113" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      `;
      arms = `
        <path d="M58 140 Q74 150 88 143" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M142 140 Q126 150 112 143" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <path class="sweatdrop" d="M150 54 Q158 66 150 73 Q142 66 150 54 Z" fill="#9AE6FF" stroke="${OUTLINE}" stroke-width="2"/>
      `;
    } else if (mood === 'camera') {
      extras = `
        <g transform="translate(76, 132)">
          <rect x="0" y="6" width="48" height="30" rx="8" fill="#FFFDF7" stroke="${OUTLINE}" stroke-width="2.6"/>
          <rect x="14" y="0" width="20" height="8" rx="3" fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="24" cy="21" r="9" fill="#9AE6FF" stroke="${OUTLINE}" stroke-width="2.4"/>
          <circle cx="24" cy="21" r="4" fill="#1F4B57"/>
          <circle cx="40" cy="13" r="2.5" fill="#FFE082"/>
        </g>
      `;
    }

    return `
      <svg class="hangyodon-svg hangyodon-${mood}" width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hangyodon (${mood})">
        <!-- Top spiky fin crest -->
        <path d="M84 36 Q88 14 96 28 Q103 10 110 28 Q119 16 118 36" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <!-- Ruffled ear fins -->
        <path d="M42 74 Q22 66 26 84 Q18 92 30 98 Q26 110 44 104" fill="#8AE4DC" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M158 74 Q178 66 174 84 Q182 92 170 98 Q174 110 156 104" fill="#8AE4DC" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <!-- Cute feet -->
        <ellipse cx="76" cy="176" rx="16" ry="9" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3"/>
        <ellipse cx="124" cy="176" rx="16" ry="9" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3"/>
        <!-- Chubby body -->
        <path d="M56 122 Q48 168 78 172 L122 172 Q152 168 144 122 Z" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <!-- Cream-mint tummy -->
        <ellipse cx="100" cy="150" rx="28" ry="20" fill="#DDF8F4" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- Arms -->
        ${arms}
        <!-- Round head -->
        <ellipse cx="100" cy="84" rx="60" ry="50" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="3.2"/>
        <!-- Soft forehead highlight -->
        <ellipse cx="78" cy="52" rx="18" ry="7" fill="#9BF0E8" opacity="0.55" transform="rotate(-14 78 52)"/>
        ${blush}
        ${eyes}
        ${mouth}
        ${extras}
      </svg>
    `;
  }

  function sayuriSVG(size = 86) {
    return `
      <svg class="sayuri-svg" width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sayuri the octopus">
        <!-- Tentacles -->
        <path d="M28 74 Q14 88 26 98 Q34 102 38 88" fill="#FF92AA" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M44 78 Q38 100 50 104 Q58 102 56 82" fill="#FF92AA" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M64 82 Q62 102 72 104 Q82 100 76 78" fill="#FF92AA" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M82 88 Q86 102 96 98 Q106 88 92 74" fill="#FF92AA" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Head -->
        <ellipse cx="60" cy="52" rx="34" ry="32" fill="#FF92AA" stroke="${OUTLINE}" stroke-width="3"/>
        <!-- Highlight -->
        <ellipse cx="47" cy="34" rx="10" ry="5" fill="#FFC2D1" opacity="0.7" transform="rotate(-18 47 34)"/>
        <!-- Blush -->
        <ellipse cx="38" cy="58" rx="6" ry="3.5" fill="#FF6B8B" opacity="0.45"/>
        <ellipse cx="82" cy="58" rx="6" ry="3.5" fill="#FF6B8B" opacity="0.45"/>
        <!-- Eyes -->
        <circle cx="48" cy="50" r="5" fill="${OUTLINE}"/>
        <circle cx="72" cy="50" r="5" fill="${OUTLINE}"/>
        <circle cx="49.5" cy="48" r="1.8" fill="#FFFFFF"/>
        <circle cx="73.5" cy="48" r="1.8" fill="#FFFFFF"/>
        <!-- Cute 'o' mouth -->
        <circle cx="60" cy="60" r="3.6" fill="#FFE0E6" stroke="${OUTLINE}" stroke-width="2.2"/>
      </svg>
    `;
  }

  function basketHangyodonSVG(size = 84) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hangyodon holding basket">
        <path d="M50 18 Q54 6 60 14 Q66 5 70 18" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="2.6"/>
        <ellipse cx="60" cy="48" rx="36" ry="30" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="2.8"/>
        <circle cx="46" cy="44" r="9" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="74" cy="44" r="9" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="47" cy="44" r="4.2" fill="${OUTLINE}"/>
        <circle cx="73" cy="44" r="4.2" fill="${OUTLINE}"/>
        <circle cx="48.5" cy="42" r="1.6" fill="#FFFFFF"/>
        <circle cx="74.5" cy="42" r="1.6" fill="#FFFFFF"/>
        <path d="M46 62 Q60 56 74 62 Q76 68 69 70 Q60 74 51 70 Q44 68 46 62 Z" fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- Woven Basket -->
        <path d="M18 76 L102 76 L92 108 Q60 114 28 108 Z" fill="#F4C983" stroke="${OUTLINE}" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M24 88 L96 88 M30 99 L90 99 M44 76 L46 110 M60 76 L60 111 M76 76 L74 110" stroke="#C88D44" stroke-width="2.2"/>
        <rect x="14" y="72" width="92" height="9" rx="4.5" fill="#E6AF5B" stroke="${OUTLINE}" stroke-width="2.6"/>
      </svg>
    `;
  }

  function bouquetSVG(size = 220) {
    return `
      <svg class="bouquet-svg" width="${size}" height="${size}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Forgiveness Flowers Bouquet">
        <!-- Foliage -->
        <ellipse cx="74" cy="96" rx="22" ry="10" fill="#7ED4AD" stroke="${OUTLINE}" stroke-width="2.4" transform="rotate(-35 74 96)"/>
        <ellipse cx="166" cy="96" rx="22" ry="10" fill="#7ED4AD" stroke="${OUTLINE}" stroke-width="2.4" transform="rotate(35 166 96)"/>
        <ellipse cx="120" cy="60" rx="14" ry="26" fill="#8FE3BC" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- Stems -->
        <path d="M90 100 L118 165 M120 75 L120 165 M150 100 L122 165" stroke="#4CA67D" stroke-width="4" stroke-linecap="round"/>
        <!-- Wrapping Paper -->
        <path d="M62 118 L120 218 L178 118 Q120 132 62 118 Z" fill="#FFF4DC" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M74 122 L120 205 L166 122" fill="#E6FAF6" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Lavender sprig -->
        <g fill="#C8B6FF" stroke="${OUTLINE}" stroke-width="1.8">
          <circle cx="88" cy="70" r="6"/><circle cx="94" cy="60" r="6"/><circle cx="100" cy="50" r="5.5"/>
          <circle cx="152" cy="70" r="6"/><circle cx="146" cy="60" r="6"/><circle cx="140" cy="50" r="5.5"/>
        </g>
        <!-- Pink Tulip Left -->
        <path d="M62 96 Q58 64 80 72 Q90 58 96 74 Q102 98 80 104 Q64 104 62 96 Z" fill="#FF9EB5" stroke="${OUTLINE}" stroke-width="2.6"/>
        <!-- Sunny Daisy Center -->
        <g transform="translate(120, 74)">
          <circle cx="0" cy="-16" r="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="15" cy="-6" r="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="10" cy="12" r="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="-10" cy="12" r="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="-15" cy="-6" r="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="0" cy="0" r="10" fill="#FFE082" stroke="${OUTLINE}" stroke-width="2.4"/>
        </g>
        <!-- Peach Blossom Right -->
        <g transform="translate(158, 92)">
          <circle cx="0" cy="-12" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="12" cy="-3" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="7" cy="10" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="-7" cy="10" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="-12" cy="-3" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="0" cy="0" r="7" fill="#FFAD60" stroke="${OUTLINE}" stroke-width="2"/>
        </g>
        <!-- Mint Forget-me-nots -->
        <circle cx="96" cy="106" r="11" fill="#8EE3EF" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="96" cy="106" r="4" fill="#FFE082"/>
        <circle cx="132" cy="112" r="11" fill="#FFE082" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="132" cy="112" r="4" fill="#FFFFFF"/>
        <!-- Ribbon Bow -->
        <path d="M120 166 Q94 152 94 172 Q94 184 120 172 Q146 184 146 172 Q146 152 120 166 Z" fill="#5CC8BE" stroke="${OUTLINE}" stroke-width="2.6"/>
        <circle cx="120" cy="169" r="7" fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="2.4"/>
      </svg>
    `;
  }

  function shellSVG(filled = false, size = 24) {
    const fill = filled ? '#FF9EB5' : '#E7F6F4';
    const inner = filled ? '#FFE082' : '#CBEAE5';
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 17 C4 8 11 4 16 4 C21 4 28 8 28 17 C28 22 23 26 16 26 C9 26 4 22 4 17 Z"
              fill="${fill}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <path d="M16 4 L16 25 M10 6 L14 25 M22 6 L18 25" stroke="${OUTLINE}" stroke-width="1.6" opacity="0.65"/>
        <circle cx="16" cy="21" r="3" fill="${inner}" stroke="${OUTLINE}" stroke-width="1.6"/>
      </svg>
    `;
  }

  return {
    hangyodonSVG,
    sayuriSVG,
    basketHangyodonSVG,
    bouquetSVG,
    shellSVG,
  };
})();
