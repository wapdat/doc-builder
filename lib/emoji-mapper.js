/**
 * Emoji to Phosphor Icons mapping
 * Maps Unicode emojis to their Phosphor icon equivalents
 */

const emojiToPhosphor = {
  // Status & Validation
  '✅': '<i class="ph ph-check-circle" aria-label="checked"></i>',
  '✓': '<i class="ph ph-check" aria-label="check"></i>',
  '✔️': '<i class="ph ph-check-square" aria-label="checked"></i>',
  '❌': '<i class="ph ph-x-circle" aria-label="error"></i>',
  '❓': '<i class="ph ph-question" aria-label="question"></i>',
  '❗': '<i class="ph ph-warning" aria-label="warning"></i>',
  '⚠️': '<i class="ph ph-warning-circle" aria-label="warning"></i>',
  '⛔': '<i class="ph ph-prohibit" aria-label="prohibited"></i>',
  '🚫': '<i class="ph ph-prohibit-inset" aria-label="not allowed"></i>',
  
  // Development & Tech
  '💻': '<i class="ph ph-laptop" aria-label="laptop"></i>',
  '🖥️': '<i class="ph ph-desktop" aria-label="desktop"></i>',
  '📱': '<i class="ph ph-device-mobile" aria-label="mobile"></i>',
  '⌨️': '<i class="ph ph-keyboard" aria-label="keyboard"></i>',
  '🖱️': '<i class="ph ph-mouse" aria-label="mouse"></i>',
  '💾': '<i class="ph ph-floppy-disk" aria-label="save"></i>',
  '💿': '<i class="ph ph-disc" aria-label="disc"></i>',
  '🔧': '<i class="ph ph-wrench" aria-label="settings"></i>',
  '🔨': '<i class="ph ph-hammer" aria-label="build"></i>',
  '⚙️': '<i class="ph ph-gear" aria-label="settings"></i>',
  '🛠️': '<i class="ph ph-gear-six" aria-label="tools"></i>',
  '⚡': '<i class="ph ph-lightning" aria-label="fast"></i>',
  '🔌': '<i class="ph ph-plug" aria-label="plugin"></i>',
  '💡': '<i class="ph ph-lightbulb" aria-label="idea"></i>',
  '🐛': '<i class="ph ph-bug" aria-label="bug"></i>',
  '🐞': '<i class="ph ph-bug-beetle" aria-label="bug"></i>',
  '🤖': '<i class="ph ph-robot" aria-label="automation"></i>',
  
  // Documents & Files
  '📝': '<i class="ph ph-note-pencil" aria-label="edit"></i>',
  '📄': '<i class="ph ph-file-text" aria-label="document"></i>',
  '📃': '<i class="ph ph-file" aria-label="file"></i>',
  '📋': '<i class="ph ph-clipboard-text" aria-label="clipboard"></i>',
  '📁': '<i class="ph ph-folder" aria-label="folder"></i>',
  '📂': '<i class="ph ph-folder-open" aria-label="open folder"></i>',
  '🗂️': '<i class="ph ph-folders" aria-label="folders"></i>',
  '📚': '<i class="ph ph-books" aria-label="documentation"></i>',
  '📖': '<i class="ph ph-book-open" aria-label="reading"></i>',
  '📕': '<i class="ph ph-book" aria-label="book"></i>',
  '📗': '<i class="ph ph-book" aria-label="book"></i>',
  '📘': '<i class="ph ph-book" aria-label="book"></i>',
  '📙': '<i class="ph ph-book" aria-label="book"></i>',
  '📓': '<i class="ph ph-notebook" aria-label="notebook"></i>',
  '📔': '<i class="ph ph-notebook" aria-label="journal"></i>',
  
  // UI & Design
  '🎨': '<i class="ph ph-palette" aria-label="design"></i>',
  '🖌️': '<i class="ph ph-paint-brush" aria-label="paint"></i>',
  '🖍️': '<i class="ph ph-pencil" aria-label="draw"></i>',
  '✏️': '<i class="ph ph-pencil-simple" aria-label="edit"></i>',
  '✒️': '<i class="ph ph-pen" aria-label="write"></i>',
  '🖊️': '<i class="ph ph-pen-nib" aria-label="pen"></i>',
  '🖋️': '<i class="ph ph-pen-nib-straight" aria-label="fountain pen"></i>',
  '📐': '<i class="ph ph-ruler" aria-label="measure"></i>',
  '📏': '<i class="ph ph-ruler" aria-label="ruler"></i>',
  
  // Actions & Navigation
  '🚀': '<i class="ph ph-rocket-launch" aria-label="launch"></i>',
  '✈️': '<i class="ph ph-airplane" aria-label="deploy"></i>',
  '🎯': '<i class="ph ph-target" aria-label="goal"></i>',
  '🏁': '<i class="ph ph-flag-checkered" aria-label="finish"></i>',
  '🚩': '<i class="ph ph-flag" aria-label="flag"></i>',
  '📍': '<i class="ph ph-push-pin" aria-label="pin"></i>',
  '📌': '<i class="ph ph-push-pin" aria-label="pinned"></i>',
  '🔗': '<i class="ph ph-link" aria-label="link"></i>',
  '⚓': '<i class="ph ph-anchor" aria-label="anchor"></i>',
  '🧭': '<i class="ph ph-compass" aria-label="navigation"></i>',
  '🗺️': '<i class="ph ph-map-trifold" aria-label="map"></i>',
  
  // Communication
  '📧': '<i class="ph ph-envelope" aria-label="email"></i>',
  '📨': '<i class="ph ph-envelope-open" aria-label="inbox"></i>',
  '📬': '<i class="ph ph-mailbox" aria-label="mailbox"></i>',
  '📮': '<i class="ph ph-mailbox" aria-label="postbox"></i>',
  '💬': '<i class="ph ph-chat-circle" aria-label="chat"></i>',
  '💭': '<i class="ph ph-chat-circle-dots" aria-label="thinking"></i>',
  '🗨️': '<i class="ph ph-chat-teardrop" aria-label="comment"></i>',
  '📢': '<i class="ph ph-megaphone" aria-label="announce"></i>',
  '📣': '<i class="ph ph-megaphone-simple" aria-label="broadcast"></i>',
  '🔔': '<i class="ph ph-bell" aria-label="notification"></i>',
  '🔕': '<i class="ph ph-bell-slash" aria-label="muted"></i>',
  
  // Security
  '🔐': '<i class="ph ph-lock-key" aria-label="secure"></i>',
  '🔒': '<i class="ph ph-lock" aria-label="locked"></i>',
  '🔓': '<i class="ph ph-lock-open" aria-label="unlocked"></i>',
  '🔑': '<i class="ph ph-key" aria-label="key"></i>',
  '🗝️': '<i class="ph ph-key" aria-label="key"></i>',
  '🛡️': '<i class="ph ph-shield" aria-label="security"></i>',
  '⚔️': '<i class="ph ph-sword" aria-label="battle"></i>',
  
  // Analytics & Data
  '📊': '<i class="ph ph-chart-bar" aria-label="chart"></i>',
  '📈': '<i class="ph ph-chart-line-up" aria-label="growth"></i>',
  '📉': '<i class="ph ph-chart-line-down" aria-label="decline"></i>',
  '🔍': '<i class="ph ph-magnifying-glass" aria-label="search"></i>',
  '🔎': '<i class="ph ph-magnifying-glass-plus" aria-label="zoom in"></i>',
  '🔬': '<i class="ph ph-flask" aria-label="experiment"></i>',
  '🔭': '<i class="ph ph-binoculars" aria-label="explore"></i>',
  
  // Time
  '⏰': '<i class="ph ph-alarm" aria-label="alarm"></i>',
  '⏱️': '<i class="ph ph-timer" aria-label="timer"></i>',
  '⏲️': '<i class="ph ph-timer" aria-label="stopwatch"></i>',
  '🕐': '<i class="ph ph-clock" aria-label="time"></i>',
  '📅': '<i class="ph ph-calendar" aria-label="calendar"></i>',
  '📆': '<i class="ph ph-calendar-blank" aria-label="date"></i>',
  '🗓️': '<i class="ph ph-calendar" aria-label="schedule"></i>',
  
  // Media
  '📷': '<i class="ph ph-camera" aria-label="photo"></i>',
  '📸': '<i class="ph ph-camera" aria-label="screenshot"></i>',
  '📹': '<i class="ph ph-video-camera" aria-label="video"></i>',
  '🎥': '<i class="ph ph-film-strip" aria-label="movie"></i>',
  '📽️': '<i class="ph ph-film-slate" aria-label="production"></i>',
  '🎬': '<i class="ph ph-film-slate" aria-label="action"></i>',
  '🎤': '<i class="ph ph-microphone" aria-label="microphone"></i>',
  '🎧': '<i class="ph ph-headphones" aria-label="audio"></i>',
  '🎵': '<i class="ph ph-music-note" aria-label="music"></i>',
  '🎶': '<i class="ph ph-music-notes" aria-label="music"></i>',
  '🔊': '<i class="ph ph-speaker-high" aria-label="volume high"></i>',
  '🔇': '<i class="ph ph-speaker-none" aria-label="muted"></i>',
  '🔈': '<i class="ph ph-speaker-low" aria-label="volume low"></i>',
  
  // Nature & Weather
  '☀️': '<i class="ph ph-sun" aria-label="sunny"></i>',
  '🌙': '<i class="ph ph-moon" aria-label="night"></i>',
  '⭐': '<i class="ph ph-star" aria-label="star"></i>',
  '🌟': '<i class="ph ph-star-four" aria-label="sparkle"></i>',
  '✨': '<i class="ph ph-sparkle" aria-label="special"></i>',
  '☁️': '<i class="ph ph-cloud" aria-label="cloud"></i>',
  '🌧️': '<i class="ph ph-cloud-rain" aria-label="rain"></i>',
  '❄️': '<i class="ph ph-snowflake" aria-label="snow"></i>',
  '🔥': '<i class="ph ph-fire" aria-label="hot"></i>',
  '💧': '<i class="ph ph-drop" aria-label="water"></i>',
  '🌊': '<i class="ph ph-waves" aria-label="wave"></i>',
  
  // People & Activities
  '👤': '<i class="ph ph-user" aria-label="user"></i>',
  '👥': '<i class="ph ph-users" aria-label="team"></i>',
  '👨‍💻': '<i class="ph ph-user-circle" aria-label="developer"></i>',
  '🏃': '<i class="ph ph-person-simple-run" aria-label="running"></i>',
  '🚶': '<i class="ph ph-person-simple-walk" aria-label="walking"></i>',
  '🤝': '<i class="ph ph-handshake" aria-label="partnership"></i>',
  '👍': '<i class="ph ph-thumbs-up" aria-label="approve"></i>',
  '👎': '<i class="ph ph-thumbs-down" aria-label="disapprove"></i>',
  '👏': '<i class="ph ph-hands-clapping" aria-label="applause"></i>',
  '🙌': '<i class="ph ph-hands-clapping" aria-label="celebrate"></i>',
  '💪': '<i class="ph ph-hand-fist" aria-label="strong"></i>',
  
  // Objects & Things
  '🏠': '<i class="ph ph-house" aria-label="home"></i>',
  '🏢': '<i class="ph ph-buildings" aria-label="office"></i>',
  '🏭': '<i class="ph ph-factory" aria-label="factory"></i>',
  '🚗': '<i class="ph ph-car" aria-label="car"></i>',
  '🚌': '<i class="ph ph-bus" aria-label="bus"></i>',
  '🚂': '<i class="ph ph-train" aria-label="train"></i>',
  '🚁': '<i class="ph ph-airplane" aria-label="helicopter"></i>',
  '🚢': '<i class="ph ph-boat" aria-label="ship"></i>',
  '🎁': '<i class="ph ph-gift" aria-label="gift"></i>',
  '🎈': '<i class="ph ph-balloon" aria-label="celebration"></i>',
  '🎉': '<i class="ph ph-confetti" aria-label="party"></i>',
  '🏆': '<i class="ph ph-trophy" aria-label="achievement"></i>',
  '🥇': '<i class="ph ph-medal" aria-label="first place"></i>',
  '🎮': '<i class="ph ph-game-controller" aria-label="gaming"></i>',
  '🎲': '<i class="ph ph-dice-five" aria-label="random"></i>',
  
  // Food & Drink
  '☕': '<i class="ph ph-coffee" aria-label="coffee"></i>',
  '🍔': '<i class="ph ph-hamburger" aria-label="burger"></i>',
  '🍕': '<i class="ph ph-pizza" aria-label="pizza"></i>',
  '🍰': '<i class="ph ph-cake" aria-label="cake"></i>',
  '🍺': '<i class="ph ph-beer-stein" aria-label="beer"></i>',
  '🍷': '<i class="ph ph-wine" aria-label="wine"></i>',
  
  // Money & Commerce
  '💰': '<i class="ph ph-money" aria-label="money"></i>',
  '💵': '<i class="ph ph-currency-dollar" aria-label="dollar"></i>',
  '💳': '<i class="ph ph-credit-card" aria-label="payment"></i>',
  '🏦': '<i class="ph ph-bank" aria-label="bank"></i>',
  '🛒': '<i class="ph ph-shopping-cart" aria-label="cart"></i>',
  '🛍️': '<i class="ph ph-shopping-bag" aria-label="shopping"></i>',
  '📦': '<i class="ph ph-package" aria-label="package"></i>',
  
  // Symbols
  '➕': '<i class="ph ph-plus" aria-label="add"></i>',
  '➖': '<i class="ph ph-minus" aria-label="remove"></i>',
  '✖️': '<i class="ph ph-x" aria-label="close"></i>',
  '♻️': '<i class="ph ph-recycle" aria-label="recycle"></i>',
  '❤️': '<i class="ph ph-heart" aria-label="love"></i>',
  '💔': '<i class="ph ph-heart-break" aria-label="broken heart"></i>',
  '⏭️': '<i class="ph ph-skip-forward" aria-label="next"></i>',
  '⏮️': '<i class="ph ph-skip-back" aria-label="previous"></i>',
  '⏸️': '<i class="ph ph-pause" aria-label="pause"></i>',
  '▶️': '<i class="ph ph-play" aria-label="play"></i>',
  '⏹️': '<i class="ph ph-stop" aria-label="stop"></i>',
  
  // Special
  '🌈': '<i class="ph ph-rainbow" aria-label="diversity"></i>',
  '🦄': '<i class="ph ph-shooting-star" aria-label="unique"></i>',
  '🎭': '<i class="ph ph-mask-happy" aria-label="theater"></i>',
  '🎪': '<i class="ph ph-tent" aria-label="circus"></i>',
  '🏳️': '<i class="ph ph-flag" aria-label="flag"></i>',
  '🏴': '<i class="ph ph-flag" aria-label="flag"></i>',
  '🏴‍☠️': '<i class="ph ph-skull" aria-label="danger"></i>',
};

/**
 * Replace emojis with Phosphor icons in HTML
 * @param {string} html - The HTML content to process
 * @param {object} config - Configuration options
 * @returns {string} - HTML with emojis replaced by icons
 */
function replaceEmojisWithIcons(html, config = {}) {
  // Check if feature is enabled
  if (!config.features?.phosphorIcons) return html;
  
  // Build regex pattern once with all emoji patterns
  // Sort by length to match longer emojis first (e.g., ⚠️ before ⚠)
  const emojiPattern = new RegExp(
    Object.keys(emojiToPhosphor)
      .sort((a, b) => b.length - a.length)
      .map(emoji => emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|'),
    'g'
  );
  
  // Get weight class if custom weight is specified
  const weightClass = config.features.phosphorWeight && config.features.phosphorWeight !== 'regular' 
    ? `ph-${config.features.phosphorWeight}` 
    : 'ph';
  
  // Apply size styling if configured
  const sizeStyle = config.features.phosphorSize 
    ? ` style="font-size: ${config.features.phosphorSize}"` 
    : '';
  
  return html.replace(emojiPattern, match => {
    let iconHtml = emojiToPhosphor[match];
    if (!iconHtml) return match;
    
    // Update weight class if not regular
    if (weightClass !== 'ph') {
      iconHtml = iconHtml.replace('class="ph ', `class="${weightClass} `);
    }
    
    // Apply custom size if configured
    if (sizeStyle) {
      iconHtml = iconHtml.replace('<i class="', `<i${sizeStyle} class="`);
    }
    
    return iconHtml;
  });
}

module.exports = {
  emojiToPhosphor,
  replaceEmojisWithIcons
};