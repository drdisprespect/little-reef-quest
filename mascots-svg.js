/**
 * Bespoke animated inline SVGs for Lulu (噜噜), Lumei (噜妹),
 * Tangerine Progress Badges, and the Forgiveness Flowers Bouquet.
 */

window.MascotArt = (() => {
  const OUTLINE = '#4A2E1B';

  function tangerineTopSVG(cx = 100, cy = 28, scale = 1) {
    return `
      <g transform="translate(${cx}, ${cy}) scale(${scale})">
        <ellipse cx="0" cy="0" rx="16" ry="12.5" fill="#FF8A1F" stroke="${OUTLINE}" stroke-width="2.8"/>
        <ellipse cx="-5" cy="-4.5" rx="5.5" ry="2.6" fill="#FFC56E" opacity="0.85" transform="rotate(-18 -5 -4.5)"/>
        <path d="M0 -12 Q2 -19 9 -21 Q8 -13 0 -12 Z" fill="#5CB849" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M0 -12 L0 -17" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      </g>
    `;
  }

  function luluSVG(mood = 'welcome', size = 190) {
    const blush = `
      <ellipse cx="55" cy="100" rx="12" ry="6.8" fill="#FF8A80" opacity="0.64"/>
      <ellipse cx="145" cy="100" rx="12" ry="6.8" fill="#FF8A80" opacity="0.64"/>
    `;

    let eyes = `
      <ellipse cx="78" cy="75" rx="9.5" ry="10.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.6"/>
      <ellipse cx="122" cy="75" rx="9.5" ry="10.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.6"/>
      <circle class="lulu-pupil" cx="79.5" cy="76" r="6" fill="${OUTLINE}"/>
      <circle class="lulu-pupil" cx="120.5" cy="76" r="6" fill="${OUTLINE}"/>
      <circle cx="81.5" cy="73" r="2.3" fill="#FFFFFF"/>
      <circle cx="122.5" cy="73" r="2.3" fill="#FFFFFF"/>
      <path d="M70 59 Q78 56 85 59" fill="none" stroke="#C97B18" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M115 59 Q122 56 130 59" fill="none" stroke="#C97B18" stroke-width="2.5" stroke-linecap="round"/>
    `;

    let mouth = `
      <path d="M86 111 Q100 120 114 111" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
    `;

    let extras = '';
    let arms = `
      <path d="M54 136 Q30 128 33 111 Q42 106 58 123" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M146 136 Q170 128 167 111 Q158 106 142 123" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    `;

    if (mood === 'shy') {
      eyes = `
        <ellipse cx="78" cy="76" rx="9.5" ry="10.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.6"/>
        <ellipse cx="122" cy="76" rx="9.5" ry="10.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.6"/>
        <circle cx="81" cy="79" r="5.6" fill="${OUTLINE}"/>
        <circle cx="119" cy="79" r="5.6" fill="${OUTLINE}"/>
        <circle cx="82.5" cy="76.5" r="2.1" fill="#FFFFFF"/>
        <circle cx="120.5" cy="76.5" r="2.1" fill="#FFFFFF"/>
        <path d="M68 61 Q78 65 86 59" fill="none" stroke="${OUTLINE}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M114 59 Q122 65 132 61" fill="none" stroke="${OUTLINE}" stroke-width="2.5" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M90 113 Q100 117 110 113" fill="none" stroke="${OUTLINE}" stroke-width="2.6" stroke-linecap="round"/>
      `;
      arms = `
        <path d="M54 137 Q70 155 88 148" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M146 137 Q130 155 112 148" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <path class="sweatdrop" d="M161 60 Q169 72 161 79 Q153 72 161 60 Z" fill="#9AE6FF" stroke="${OUTLINE}" stroke-width="2"/>
      `;
    } else if (mood === 'flowers' || mood === 'holding-flowers') {
      eyes = `
        <ellipse cx="78" cy="75" rx="9.5" ry="10.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.6"/>
        <ellipse cx="122" cy="75" rx="9.5" ry="10.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.6"/>
        <circle cx="79" cy="75" r="6.2" fill="${OUTLINE}"/>
        <circle cx="121" cy="75" r="6.2" fill="${OUTLINE}"/>
        <circle cx="81.5" cy="71.5" r="2.6" fill="#FFFFFF"/>
        <circle cx="123.5" cy="71.5" r="2.6" fill="#FFFFFF"/>
        <circle cx="76" cy="78.5" r="1.3" fill="#FFFFFF"/>
        <circle cx="118" cy="78.5" r="1.3" fill="#FFFFFF"/>
      `;
      arms = `
        <path d="M54 137 Q70 153 86 145" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M146 137 Q130 153 114 145" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <g transform="translate(76, 128)">
          <path d="M12 22 L24 44 L36 22 Z" fill="#FFF1D6" stroke="${OUTLINE}" stroke-width="2.4" stroke-linejoin="round"/>
          <circle cx="14" cy="14" r="7" fill="#FFB3C6" stroke="${OUTLINE}" stroke-width="2"/>
          <circle cx="24" cy="8" r="7.5" fill="#FFE082" stroke="${OUTLINE}" stroke-width="2"/>
          <circle cx="34" cy="14" r="7" fill="#FFA94D" stroke="${OUTLINE}" stroke-width="2"/>
          <circle cx="24" cy="17" r="5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="1.8"/>
          <circle cx="24" cy="17" r="2.2" fill="#FF8A1F"/>
        </g>
      `;
    } else if (mood === 'cheering') {
      eyes = `
        <path d="M68 77 Q78 65 88 77" fill="none" stroke="${OUTLINE}" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M112 77 Q122 65 132 77" fill="none" stroke="${OUTLINE}" stroke-width="3.2" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M84 108 Q100 125 116 108 Z" fill="#FF758F" stroke="${OUTLINE}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M90 114 Q100 121 110 114" fill="#FFB3C6"/>
      `;
      arms = `
        <g class="arm-wave-left">
          <path d="M54 136 Q24 110 30 86" fill="none" stroke="#FFD54F" stroke-width="13" stroke-linecap="round"/>
          <path d="M54 136 Q24 110 30 86" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        </g>
        <g class="arm-wave-right">
          <path d="M146 136 Q176 110 170 86" fill="none" stroke="#FFD54F" stroke-width="13" stroke-linecap="round"/>
          <path d="M146 136 Q176 110 170 86" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
      extras = `
        <circle cx="27" cy="81" r="10.5" fill="#FF9F43" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="173" cy="81" r="10.5" fill="#FFB3C6" stroke="${OUTLINE}" stroke-width="2.4"/>
        <path d="M40 36 L43 43 L50 46 L43 49 L40 56 L37 49 L30 46 L37 43 Z" fill="#FFE082" stroke="${OUTLINE}" stroke-width="1.5"/>
        <path d="M160 34 L163 40 L169 43 L163 46 L160 52 L157 46 L151 43 L157 40 Z" fill="#FFB3C6" stroke="${OUTLINE}" stroke-width="1.5"/>
      `;
    } else if (mood === 'pleading') {
      eyes = `
        <ellipse cx="78" cy="75" rx="10.5" ry="11.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.8"/>
        <ellipse cx="122" cy="75" rx="10.5" ry="11.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.8"/>
        <circle cx="79" cy="76" r="7.2" fill="${OUTLINE}"/>
        <circle cx="121" cy="76" r="7.2" fill="${OUTLINE}"/>
        <circle cx="81.5" cy="72" r="3" fill="#FFFFFF"/>
        <circle cx="123.5" cy="72" r="3" fill="#FFFFFF"/>
        <circle cx="76" cy="80" r="1.6" fill="#FFFFFF"/>
        <circle cx="118" cy="80" r="1.6" fill="#FFFFFF"/>
        <path d="M66 57 Q77 53 86 59" fill="none" stroke="${OUTLINE}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M134 57 Q123 53 114 59" fill="none" stroke="${OUTLINE}" stroke-width="2.5" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M89 114 Q100 109 111 114" fill="none" stroke="${OUTLINE}" stroke-width="2.6" stroke-linecap="round"/>
      `;
      arms = `
        <path d="M54 137 Q70 151 88 144" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M146 137 Q130 151 112 144" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <path class="sweatdrop" d="M161 58 Q169 70 161 77 Q153 70 161 58 Z" fill="#9AE6FF" stroke="${OUTLINE}" stroke-width="2"/>
      `;
    } else if (mood === 'crying') {
      eyes = `
        <ellipse cx="78" cy="75" rx="10.5" ry="11.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.8"/>
        <ellipse cx="122" cy="75" rx="10.5" ry="11.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.8"/>
        <path d="M68 80 Q78 88 88 80 Q82 86 78 86 Q74 86 68 80 Z" fill="#8EDBFF" opacity="0.92"/>
        <path d="M112 80 Q122 88 132 80 Q126 86 122 86 Q118 86 112 80 Z" fill="#8EDBFF" opacity="0.92"/>
        <circle cx="79" cy="75" r="7" fill="${OUTLINE}"/>
        <circle cx="121" cy="75" r="7" fill="${OUTLINE}"/>
        <circle cx="81.5" cy="71.5" r="3" fill="#FFFFFF"/>
        <circle cx="123.5" cy="71.5" r="3" fill="#FFFFFF"/>
        <circle cx="75.5" cy="79" r="1.7" fill="#FFFFFF"/>
        <circle cx="117.5" cy="79" r="1.7" fill="#FFFFFF"/>
        <path d="M66 59 Q76 52 85 59" fill="none" stroke="${OUTLINE}" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M134 59 Q124 52 115 59" fill="none" stroke="${OUTLINE}" stroke-width="2.6" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M89 115 Q95 110 100 114 Q105 110 111 115" fill="none" stroke="${OUTLINE}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      `;
      arms = `
        <path d="M54 136 Q32 122 39 102" fill="none" stroke="#FFD54F" stroke-width="12" stroke-linecap="round"/>
        <path d="M54 136 Q32 122 39 102" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M146 136 Q168 122 161 102" fill="none" stroke="#FFD54F" stroke-width="12" stroke-linecap="round"/>
        <path d="M146 136 Q168 122 161 102" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      extras = `
        <path class="tear-drop" d="M72 86 Q77 95 72 101 Q67 95 72 86 Z" fill="#7AD3FF" stroke="${OUTLINE}" stroke-width="1.8"/>
        <path class="tear-drop tear-delay" d="M128 86 Q133 95 128 101 Q123 95 128 86 Z" fill="#7AD3FF" stroke="${OUTLINE}" stroke-width="1.8"/>
      `;
    } else if (mood === 'camera') {
      extras = `
        <g transform="translate(76, 134)">
          <rect x="0" y="6" width="48" height="30" rx="8" fill="#FFFDF7" stroke="${OUTLINE}" stroke-width="2.6"/>
          <rect x="14" y="0" width="20" height="8" rx="3" fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="24" cy="21" r="9" fill="#9AE6FF" stroke="${OUTLINE}" stroke-width="2.4"/>
          <circle cx="24" cy="21" r="4" fill="${OUTLINE}"/>
          <circle cx="40" cy="13" r="2.5" fill="#FFD54F"/>
        </g>
      `;
    }

    return `
      <svg class="mascot-svg lulu-${mood}" width="${size}" height="${size}" viewBox="0 0 200 212" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lulu (${mood})">
        <!-- Cute little rounded ears -->
        <circle cx="60" cy="53" r="11" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="60" cy="54" r="5" fill="#F5A623"/>
        <circle cx="140" cy="53" r="11" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3"/>
        <circle cx="140" cy="54" r="5" fill="#F5A623"/>

        <!-- Chubby feet -->
        <ellipse cx="73" cy="193" rx="18" ry="10" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3"/>
        <ellipse cx="127" cy="193" rx="18" ry="10" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3"/>

        <!-- Extra chubby round golden body -->
        <path d="M54 118 Q28 164 56 187 Q100 197 144 187 Q172 164 146 118 Z" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <!-- Soft round tummy highlight -->
        <ellipse cx="100" cy="145" rx="31" ry="17" fill="#FFE78C" opacity="0.65"/>

        <!-- Iconic sky-blue shorts with strap -->
        <path d="M45 153 Q100 165 155 153 Q160 183 132 189 L105 189 L100 177 L95 189 L68 189 Q40 183 45 153 Z"
              fill="#72C4F8" stroke="${OUTLINE}" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M48 158 Q100 169 152 158" fill="none" stroke="#B6E1FC" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M62 126 Q94 146 144 155" fill="none" stroke="#72C4F8" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M62 126 Q94 146 144 155" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>

        <!-- Arms -->
        ${arms}

        <!-- Chubby wide hippo head & cheeks -->
        <path d="M46 84 C46 48, 70 38, 100 38 C130 38, 154 48, 154 84 C165 98, 159 131, 100 133 C41 131, 35 98, 46 84 Z"
              fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3.2" stroke-linejoin="round"/>
        <!-- Forehead sheen -->
        <ellipse cx="80" cy="52" rx="14" ry="5.5" fill="#FFF0A8" opacity="0.65" transform="rotate(-14 80 52)"/>
        <!-- Warm snout tint -->
        <ellipse cx="100" cy="106" rx="52" ry="23" fill="#FFB94A" opacity="0.58"/>
        <!-- Tiny nostrils -->
        <circle cx="91" cy="94" r="2.1" fill="#B5651D" opacity="0.7"/>
        <circle cx="109" cy="94" r="2.1" fill="#B5651D" opacity="0.7"/>

        ${blush}
        ${eyes}
        ${mouth}
        ${tangerineTopSVG(100, 27, 1)}
        ${extras}
      </svg>
    `;
  }

  function lumeiSVG(mood = 'happy', size = 155, options = {}) {
    const { holdingSign = false } = options;
    let eyes = `
      <ellipse cx="70" cy="80" rx="8.5" ry="9.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.5"/>
      <ellipse cx="110" cy="80" rx="8.5" ry="9.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.5"/>
      <circle cx="71" cy="81" r="5.5" fill="${OUTLINE}"/>
      <circle cx="109" cy="81" r="5.5" fill="${OUTLINE}"/>
      <circle cx="73" cy="78" r="2.2" fill="#FFFFFF"/>
      <circle cx="111" cy="78" r="2.2" fill="#FFFFFF"/>
      <path d="M61 73 L57 70 M119 73 L123 70" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>
    `;

    let mouth = `
      <path d="M79 109 Q90 117 101 109" fill="none" stroke="${OUTLINE}" stroke-width="2.6" stroke-linecap="round"/>
    `;

    let tears = '';

    let arms = `
      <path d="M56 138 Q42 146 46 156" fill="none" stroke="#FFD54F" stroke-width="10" stroke-linecap="round"/>
      <path d="M56 138 Q42 146 46 156" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M124 138 Q138 146 134 156" fill="none" stroke="#FFD54F" stroke-width="10" stroke-linecap="round"/>
      <path d="M124 138 Q138 146 134 156" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
    `;

    if (mood === 'cheering') {
      eyes = `
        <path d="M61 82 Q70 72 79 82" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
        <path d="M101 82 Q110 72 119 82" fill="none" stroke="${OUTLINE}" stroke-width="3" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M77 106 Q90 122 103 106 Z" fill="#FF758F" stroke="${OUTLINE}" stroke-width="2.4" stroke-linejoin="round"/>
      `;
      arms = `
        <g class="arm-wave-left">
          <path d="M56 136 Q38 118 42 102" fill="none" stroke="#FFD54F" stroke-width="10" stroke-linecap="round"/>
          <path d="M56 136 Q38 118 42 102" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
        </g>
        <g class="arm-wave-right">
          <path d="M124 136 Q142 118 138 102" fill="none" stroke="#FFD54F" stroke-width="10" stroke-linecap="round"/>
          <path d="M124 136 Q142 118 138 102" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
        </g>
      `;
    } else if (mood === 'curious') {
      eyes = `
        <ellipse cx="70" cy="80" rx="8.5" ry="9.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.5"/>
        <ellipse cx="110" cy="80" rx="8.5" ry="9.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.5"/>
        <circle cx="68" cy="81" r="5.3" fill="${OUTLINE}"/>
        <circle cx="108" cy="81" r="5.3" fill="${OUTLINE}"/>
        <circle cx="70" cy="78" r="2" fill="#FFFFFF"/>
        <circle cx="110" cy="78" r="2" fill="#FFFFFF"/>
        <path d="M62 66 Q70 64 77 67" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M103 67 Q110 64 118 66" fill="none" stroke="${OUTLINE}" stroke-width="2.2" stroke-linecap="round"/>
      `;
      mouth = `
        <circle cx="90" cy="111" r="3.6" fill="#FF9EB5" stroke="${OUTLINE}" stroke-width="2.2"/>
      `;
    } else if (mood === 'crying') {
      eyes = `
        <ellipse cx="70" cy="80" rx="9" ry="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.5"/>
        <ellipse cx="110" cy="80" rx="9" ry="10" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.5"/>
        <path d="M62 84 Q70 91 78 84 Q73 89 70 89 Q67 89 62 84 Z" fill="#8EDBFF" opacity="0.92"/>
        <path d="M102 84 Q110 91 118 84 Q113 89 110 89 Q107 89 102 84 Z" fill="#8EDBFF" opacity="0.92"/>
        <circle cx="71" cy="80" r="5.8" fill="${OUTLINE}"/>
        <circle cx="109" cy="80" r="5.8" fill="${OUTLINE}"/>
        <circle cx="73" cy="76.5" r="2.5" fill="#FFFFFF"/>
        <circle cx="111" cy="76.5" r="2.5" fill="#FFFFFF"/>
        <circle cx="68" cy="83.5" r="1.4" fill="#FFFFFF"/>
        <circle cx="106" cy="83.5" r="1.4" fill="#FFFFFF"/>
        <path d="M60 66 Q69 61 77 67" fill="none" stroke="${OUTLINE}" stroke-width="2.3" stroke-linecap="round"/>
        <path d="M120 66 Q111 61 103 67" fill="none" stroke="${OUTLINE}" stroke-width="2.3" stroke-linecap="round"/>
      `;
      mouth = `
        <path d="M81 112 Q86 108 90 111 Q94 108 99 112" fill="none" stroke="${OUTLINE}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      `;
      if (!holdingSign) {
        arms = `
          <path d="M56 136 Q38 122 44 108" fill="none" stroke="#FFD54F" stroke-width="10" stroke-linecap="round"/>
          <path d="M56 136 Q38 122 44 108" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M124 136 Q142 122 136 108" fill="none" stroke="#FFD54F" stroke-width="10" stroke-linecap="round"/>
          <path d="M124 136 Q142 122 136 108" fill="none" stroke="${OUTLINE}" stroke-width="2.8" stroke-linecap="round"/>
        `;
      }
      tears = `
        <path class="tear-drop" d="M66 89 Q70 97 66 102 Q62 97 66 89 Z" fill="#7AD3FF" stroke="${OUTLINE}" stroke-width="1.7"/>
        <path class="tear-drop tear-delay" d="M114 89 Q118 97 114 102 Q110 97 114 89 Z" fill="#7AD3FF" stroke="${OUTLINE}" stroke-width="1.7"/>
      `;
    }

    return `
      <svg class="mascot-svg lumei-${mood}" width="${size}" height="${size}" viewBox="0 0 180 206" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lumei (${mood})">
        <!-- Feet -->
        <ellipse cx="72" cy="186" rx="14" ry="8" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.8"/>
        <ellipse cx="108" cy="186" rx="14" ry="8" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.8"/>

        <!-- Arms -->
        ${arms}

        <!-- Pastel Pink Ruffled Dress -->
        <path d="M58 128 Q42 162 46 176 Q68 182 90 176 Q112 182 134 176 Q138 162 122 128 Z"
              fill="#FFB8C9" stroke="${OUTLINE}" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- White dress collar -->
        <path d="M64 128 Q77 140 90 132 Q103 140 116 128" fill="#FFFDF9" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Tiny strawberry motif on dress -->
        <circle cx="67" cy="162" r="4.5" fill="#FF5C77" stroke="${OUTLINE}" stroke-width="1.6"/>
        <path d="M64 157 L67 159 L70 157" stroke="#5CB849" stroke-width="1.8" fill="none" stroke-linecap="round"/>

        <!-- White Ruffled Lace Bonnet Back/Trim -->
        <path d="M40 96 C32 82, 40 66, 48 58 C52 44, 68 38, 90 38 C112 38, 128 44, 132 58 C140 66, 148 82, 140 96 C140 112, 126 120, 114 122 L66 122 C54 120, 40 112, 40 96 Z"
              fill="#FFFDF9" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <!-- Bonnet inner shadow -->
        <path d="M46 92 C44 74, 58 48, 90 48 C122 48, 136 74, 134 92" fill="none" stroke="#E9DFD1" stroke-width="3"/>

        <!-- Cute ears peeking through bonnet -->
        <circle cx="48" cy="64" r="8" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.6"/>
        <circle cx="132" cy="64" r="8" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.6"/>

        <!-- Pink bow on side of bonnet -->
        <g transform="translate(42, 84) rotate(-18)">
          <path d="M0 0 L-10 -6 L-8 6 Z M0 0 L10 -6 L8 6 Z" fill="#FF9EB5" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="0" cy="0" r="3" fill="#FF758F" stroke="${OUTLINE}" stroke-width="1.8"/>
        </g>

        <!-- Lumei Chubby Face -->
        <path d="M51 88 C51 58, 69 48, 90 48 C111 48, 129 58, 129 88 C135 98, 131 124, 90 125 C49 124, 45 98, 51 88 Z"
              fill="#FFD54F" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <ellipse cx="90" cy="103" rx="37" ry="18" fill="#FFB94A" opacity="0.56"/>
        <ellipse cx="60" cy="99" rx="9.5" ry="5.5" fill="#FF8A80" opacity="0.65"/>
        <ellipse cx="120" cy="99" rx="9.5" ry="5.5" fill="#FF8A80" opacity="0.65"/>

        ${eyes}
        ${mouth}
        ${tears}

        <!-- White Saucer + Tangerine with two green leaves on Bonnet -->
        <ellipse cx="90" cy="36" rx="20" ry="5.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.6"/>
        <ellipse cx="90" cy="27" rx="13" ry="10" fill="#FF8A1F" stroke="${OUTLINE}" stroke-width="2.6"/>
        <ellipse cx="86" cy="23" rx="4" ry="2" fill="#FFC56E" opacity="0.85" transform="rotate(-15 86 23)"/>
        <path d="M90 17 Q82 9 76 14 Q81 20 90 17 Z" fill="#5CB849" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M90 17 Q98 9 104 14 Q99 20 90 17 Z" fill="#6BCB57" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>
        ${holdingSign ? `
          <g transform="translate(86, 118) rotate(-5)">
            <rect x="0" y="0" width="82" height="46" rx="8" fill="#FFF4DC" stroke="${OUTLINE}" stroke-width="2.5"/>
            <text x="41" y="19" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="11.5" font-weight="700" fill="${OUTLINE}">pls talk to</text>
            <text x="41" y="34" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-size="11" font-weight="700" fill="#D95B76">this dummy 🍊</text>
          </g>
        ` : ''}
      </svg>
    `;
  }

  function basketLuluSVG(size = 84) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lulu holding flower basket">
        <!-- Ears -->
        <circle cx="36" cy="34" r="7" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.4"/>
        <circle cx="84" cy="34" r="7" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- Head -->
        <path d="M28 52 C28 32, 42 24, 60 24 C78 24, 92 32, 92 52 C96 60, 93 78, 60 79 C27 78, 24 60, 28 52 Z"
              fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.8"/>
        <ellipse cx="60" cy="64" rx="28" ry="13" fill="#FFB94A" opacity="0.58"/>
        <ellipse cx="38" cy="62" rx="6" ry="3.5" fill="#FF8A80" opacity="0.65"/>
        <ellipse cx="82" cy="62" rx="6" ry="3.5" fill="#FF8A80" opacity="0.65"/>
        <!-- Eyes -->
        <circle cx="47" cy="48" r="6.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="73" cy="48" r="6.5" fill="#FFFFFF" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="48" cy="48" r="3.8" fill="${OUTLINE}"/>
        <circle cx="72" cy="48" r="3.8" fill="${OUTLINE}"/>
        <circle cx="49.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
        <circle cx="73.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
        <path d="M51 67 Q60 73 69 67" fill="none" stroke="${OUTLINE}" stroke-width="2.4" stroke-linecap="round"/>
        <!-- Mini Tangerine on Head -->
        <ellipse cx="60" cy="18" rx="10" ry="7.5" fill="#FF8A1F" stroke="${OUTLINE}" stroke-width="2.4"/>
        <path d="M60 11 Q63 5 68 4 Q67 10 60 11 Z" fill="#5CB849" stroke="${OUTLINE}" stroke-width="1.8"/>
        <!-- Woven Basket -->
        <path d="M18 78 L102 78 L92 108 Q60 114 28 108 Z" fill="#F4C983" stroke="${OUTLINE}" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M24 90 L96 90 M30 100 L90 100 M44 78 L46 110 M60 78 L60 111 M76 78 L74 110" stroke="#C88D44" stroke-width="2.2"/>
        <rect x="14" y="74" width="92" height="9" rx="4.5" fill="#E6AF5B" stroke="${OUTLINE}" stroke-width="2.6"/>
      </svg>
    `;
  }

  function bouquetSVG(size = 220) {
    return `
      <svg class="bouquet-svg" width="${size}" height="${size}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Forgiveness Flowers Bouquet">
        <!-- Foliage -->
        <ellipse cx="74" cy="96" rx="22" ry="10" fill="#7ED49E" stroke="${OUTLINE}" stroke-width="2.4" transform="rotate(-35 74 96)"/>
        <ellipse cx="166" cy="96" rx="22" ry="10" fill="#7ED49E" stroke="${OUTLINE}" stroke-width="2.4" transform="rotate(35 166 96)"/>
        <ellipse cx="120" cy="60" rx="14" ry="26" fill="#8FE3B0" stroke="${OUTLINE}" stroke-width="2.4"/>
        <!-- Stems -->
        <path d="M90 100 L118 165 M120 75 L120 165 M150 100 L122 165" stroke="#4CA66B" stroke-width="4" stroke-linecap="round"/>
        <!-- Wrapping Paper -->
        <path d="M62 118 L120 218 L178 118 Q120 132 62 118 Z" fill="#FFF4DC" stroke="${OUTLINE}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M74 122 L120 205 L166 122" fill="#FFE8EC" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Lavender & Tangerine Blossom Sprigs -->
        <g fill="#FFB86C" stroke="${OUTLINE}" stroke-width="1.8">
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
          <circle cx="0" cy="0" r="10" fill="#FFD54F" stroke="${OUTLINE}" stroke-width="2.4"/>
        </g>
        <!-- Peach Blossom Right -->
        <g transform="translate(158, 92)">
          <circle cx="0" cy="-12" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="12" cy="-3" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="7" cy="10" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="-7" cy="10" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="-12" cy="-3" r="9" fill="#FFD1DC" stroke="${OUTLINE}" stroke-width="2.2"/>
          <circle cx="0" cy="0" r="7" fill="#FF9F43" stroke="${OUTLINE}" stroke-width="2"/>
        </g>
        <!-- Cute Tangerine & Cream Blooms -->
        <circle cx="96" cy="106" r="11" fill="#FFAE52" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="96" cy="106" r="4" fill="#FFF3B0"/>
        <circle cx="132" cy="112" r="11" fill="#FFE082" stroke="${OUTLINE}" stroke-width="2.2"/>
        <circle cx="132" cy="112" r="4" fill="#FFFFFF"/>
        <!-- Ribbon Bow -->
        <path d="M120 166 Q94 152 94 172 Q94 184 120 172 Q146 184 146 172 Q146 152 120 166 Z" fill="#FF9F43" stroke="${OUTLINE}" stroke-width="2.6"/>
        <circle cx="120" cy="169" r="7" fill="#FF8EA6" stroke="${OUTLINE}" stroke-width="2.4"/>
      </svg>
    `;
  }

  function tangerineBadgeSVG(filled = false, size = 24) {
    const body = filled ? '#FF8A1F' : '#FCE8CF';
    const leaf = filled ? '#5CB849' : '#D9D2C5';
    const shine = filled ? '#FFC56E' : '#FFF8EE';
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="16" cy="18" rx="11" ry="9.5" fill="${body}" stroke="${OUTLINE}" stroke-width="2.2"/>
        <ellipse cx="12.5" cy="14.5" rx="3.4" ry="1.8" fill="${shine}" opacity="0.85" transform="rotate(-18 12.5 14.5)"/>
        <path d="M16 8.5 Q18 3.5 23 3 Q22 7.5 16 8.5 Z" fill="${leaf}" stroke="${OUTLINE}" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `;
  }

  function miniHangyodonSVG(size = 42) {
    const hOutline = '#1F4B57';
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M32 16 Q35 6 40 13 Q45 5 48 16" fill="#5CC8BE" stroke="${hOutline}" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M16 34 Q8 30 10 40 Q6 44 13 48 Q10 54 18 50" fill="#8AE4DC" stroke="${hOutline}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M64 34 Q72 30 70 40 Q74 44 67 48 Q70 54 62 50" fill="#8AE4DC" stroke="${hOutline}" stroke-width="2.2" stroke-linejoin="round"/>
        <ellipse cx="40" cy="43" rx="25" ry="23" fill="#5CC8BE" stroke="${hOutline}" stroke-width="2.6"/>
        <ellipse cx="23" cy="49" rx="4.5" ry="2.6" fill="#FF9EB5" opacity="0.78"/>
        <ellipse cx="57" cy="49" rx="4.5" ry="2.6" fill="#FF9EB5" opacity="0.78"/>
        <circle cx="30" cy="38" r="7.5" fill="#FFFFFF" stroke="${hOutline}" stroke-width="2.2"/>
        <circle cx="50" cy="38" r="7.5" fill="#FFFFFF" stroke="${hOutline}" stroke-width="2.2"/>
        <circle cx="31" cy="38" r="3.6" fill="${hOutline}"/>
        <circle cx="49" cy="38" r="3.6" fill="${hOutline}"/>
        <circle cx="32.2" cy="36.2" r="1.4" fill="#FFFFFF"/>
        <circle cx="50.2" cy="36.2" r="1.4" fill="#FFFFFF"/>
        <path d="M29 53 Q40 47 51 53 Q54 58 48 61 Q40 65 32 61 Q26 58 29 53 Z" fill="#FF8EA6" stroke="${hOutline}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M31 56 Q40 60 49 56" fill="none" stroke="${hOutline}" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `;
  }

  return {
    luluSVG,
    lumeiSVG,
    basketLuluSVG,
    bouquetSVG,
    tangerineBadgeSVG,
    miniHangyodonSVG,
  };
})();
