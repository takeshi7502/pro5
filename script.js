const DISCORD_USER_ID = '648036769769717760';
const DECORATIONS = [
  'anime-dang-yeu.png',
  'anime-do-mo-hoi.png',
  'anime-gian-du.png',
  'anime-hon-lia-kho-xac.png',
  'anime-mat-long-lanh.png',
  'anime-nani.png',
  'anime-toa-nang-luong.png',
  'fantasy-hoa-kiem.png',
  'fantasy-ma-thuat.png',
  'fantasy-tinh-linh.png',
  'a_57807030ab60f7ac0c4a1998aa091bbf.png',
];

const terminalScreen = document.getElementById('terminal-screen');
const profileScreen = document.getElementById('profile-screen');
const enterButton = document.getElementById('enter-console-btn');
const cmdTabs = document.getElementById('cmd-tabs');
const cmdNewTab = document.getElementById('cmd-new-tab');
const cmdLog = document.getElementById('cmd-log');
const cmdForm = document.getElementById('cmd-form');
const cmdInput = document.getElementById('cmd-input');

const presenceEls = {
  avatar: document.getElementById('avatar-image'),
  decoration: document.getElementById('avatar-decoration'),
  displayName: document.getElementById('display-name'),
  username: document.getElementById('username'),
  orb: document.getElementById('status-orb'),
  statusText: document.getElementById('status-text'),
  customStatusLine: document.getElementById('custom-status-line'),
  updated: document.getElementById('last-updated'),
  clientPlatformText: document.getElementById('client-platform-text'),
  clientPlatformBtn: document.getElementById('client-platform-btn'),
  activityCard: document.getElementById('activity-card'),
  activityIcon: document.getElementById('activity-icon'),
  activityName: document.getElementById('activity-name'),
  activityDetail: document.getElementById('activity-detail'),
  activityTime: document.getElementById('activity-time'),
  spotifyStatus: document.getElementById('spotify-status'),
  publicFlags: document.getElementById('public-flags'),
  typingName: document.getElementById('profile-typing-name'),
};

const statusLabels = {
  online: 'Đang online',
  idle: 'Đang rảnh',
  dnd: 'Đừng làm phiền',
  offline: 'Đang offline',
};

const profileTypingWords = ['Takeshi', 'Freelancer', 'Hikikomori', 'Neet', 'Fan Anime'];

const activityTypes = {
  0: { label: 'Đang chơi', icon: '🎮' },
  1: { label: 'Đang stream', icon: '📡' },
  2: { label: 'Đang nghe', icon: '♪' },
  3: { label: 'Đang xem', icon: '▶' },
  5: { label: 'Đang thi đấu', icon: '⚔' },
};

const discordBadges = [
  { bit: 1 << 0, icon: '🛡️', label: 'Discord Staff' },
  { bit: 1 << 1, icon: '🤝', label: 'Partnered Server Owner' },
  { bit: 1 << 2, icon: '🎤', label: 'HypeSquad Events' },
  { bit: 1 << 3, icon: '🐞', label: 'Bug Hunter Level 1' },
  { bit: 1 << 6, icon: '🦁', label: 'HypeSquad Bravery' },
  { bit: 1 << 7, icon: '💡', label: 'HypeSquad Brilliance' },
  { bit: 1 << 8, icon: '⚖️', label: 'HypeSquad Balance' },
  { bit: 1 << 9, icon: '✨', label: 'Early Supporter' },
  { bit: 1 << 14, icon: '🐞', label: 'Bug Hunter Level 2' },
  { bit: 1 << 16, icon: '🤖', label: 'Verified Bot' },
  { bit: 1 << 17, icon: '👨‍💻', label: 'Early Verified Bot Developer' },
  { bit: 1 << 18, icon: '🛡', label: 'Discord Certified Moderator' },
  { bit: 1 << 22, icon: '🌱', label: 'Active Developer' },
];

const introLines = [
  'C:\\Users\\Takeshi> whoami',
  'takeshi.dev',
  '',
  'C:\\Users\\Takeshi> profile --boot',
  '[OK] Loading personal interface...',
  '[OK] Connecting Discord presence...',
  '[OK] Preparing avatar decoration...',
  '[OK] Mounting local music file...',
  '',
  'Alias        : Takeshi',
  'Style        : Discord-inspired anime profile',
  'Location     : Vietnam',
  'Passion      : Anime, gaming, late-night code',
  'Current Mode : Quiet but online',
  '',
  'Press Enter to continue.',
];

let activeTabId = 'boot';
let tabCount = 1;
let introTimer;
const cmdTabsState = [
  {
    id: 'boot',
    title: 'cmd',
    log: 'Microsoft Windows [Version 11.0.22631.0000]\n(c) Microsoft Corporation. All rights reserved.\n\n',
    input: '',
    boot: true,
    interactive: false,
    typing: true,
  },
];

function activeCmdTab() {
  return cmdTabsState.find((tab) => tab.id === activeTabId) || cmdTabsState[0];
}

function renderCmdTabs() {
  cmdTabs.innerHTML = cmdTabsState.map((tab) => `
    <button class="cmd-tab ${tab.id === activeTabId ? 'active-tab' : ''}" type="button" data-tab-id="${tab.id}" role="tab" aria-selected="${tab.id === activeTabId}">
      <span class="cmd-tab-title">${tab.title}</span>
      ${cmdTabsState.length > 1 && !tab.boot ? '<span class="cmd-tab-close" data-close-tab>×</span>' : ''}
    </button>
  `).join('');
}

function renderCmdBody() {
  const tab = activeCmdTab();
  cmdLog.textContent = tab.log;
  cmdLog.classList.toggle('typing', Boolean(tab.typing));
  cmdForm.classList.toggle('hidden', !tab.interactive);
  cmdInput.value = tab.input || '';
}

function renderCmd() {
  renderCmdTabs();
  renderCmdBody();
}

function switchCmdTab(tabId) {
  activeTabId = tabId;
  renderCmd();
  cmdInput.focus();
}

function typeIntro() {
  const tab = activeCmdTab();
  const prefix = tab.log;
  const text = introLines.join('\n');
  let index = 0;
  introTimer = setInterval(() => {
    tab.log = prefix + text.slice(0, index);
    if (tab.id === activeTabId) renderCmdBody();
    index += 1;
    if (index > text.length) {
      tab.typing = false;
      clearInterval(introTimer);
      if (tab.id === activeTabId) renderCmdBody();
    }
  }, 18);
}
renderCmd();
typeIntro();

function showScreen(screen) {
  [terminalScreen, profileScreen].forEach((item) => item.classList.remove('active'));
  screen.classList.add('active');
  document.body.classList.toggle('terminal-active', screen === terminalScreen);
  if (screen === profileScreen && typeof syncPanelPlacement === 'function') {
    syncPanelPlacement();
  }
}

function typeTextForTab(tab, text, speed = 14, onDone = () => {}) {
  let index = 0;
  const prefix = tab.log;
  tab.typing = true;
  const timer = setInterval(() => {
    tab.log = prefix + text.slice(0, index);
    if (tab.id === activeTabId) renderCmdBody();
    index += 1;
    if (index > text.length) {
      tab.typing = false;
      clearInterval(timer);
      onDone();
      if (tab.id === activeTabId) renderCmdBody();
    }
  }, speed);
}

enterButton.addEventListener('click', enterConsole);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && terminalScreen.classList.contains('active') && document.activeElement !== cmdInput) enterConsole();
});

function openCmdTab() {
  const existingInteractiveTab = cmdTabsState.find((tab) => tab.interactive || tab.id === 'cmd-input-tab');
  if (existingInteractiveTab) {
    switchCmdTab(existingInteractiveTab.id);
    return;
  }

  tabCount += 1;
  const id = 'cmd-input-tab';
  const staticHeader = [
    'Microsoft Windows [Version 11.0.22631.0000]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
  ].join('\n');
  const tips = [
    '\nGợi ý: nhập website như youtube.com rồi nhấn Enter để mở tab mới.',
    'Gợi ý: thử các lệnh help, status, ping, dir, profile, clear.',
    '',
  ].join('\n');
  const tab = {
    id,
    title: 'cmd 2',
    log: staticHeader,
    input: '',
    boot: false,
    interactive: false,
    typing: true,
  };
  cmdTabsState.push(tab);
  switchCmdTab(id);
  typeTextForTab(tab, tips, 12, () => {
    tab.interactive = true;
  });
}

function closeCmdTab(tabId) {
  if (cmdTabsState.length === 1) return;
  const index = cmdTabsState.findIndex((tab) => tab.id === tabId);
  if (index === -1 || cmdTabsState[index].boot) return;
  cmdTabsState.splice(index, 1);
  if (activeTabId === tabId) activeTabId = cmdTabsState[Math.max(0, index - 1)].id;
  renderCmd();
}

function normalizeUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w-]+(\.[\w-]+)+/.test(value)) return `https://${value}`;
  return '';
}

function fakeCommand(command) {
  const lower = command.toLowerCase();
  if (['help', '?'].includes(lower)) return 'Available: help, clear, profile, status, ping, dir, scan, run <anything>, or paste a URL.';
  if (lower === 'profile') return 'Opening Takeshi profile interface... done. Press Enter outside this input to continue.';
  if (lower === 'status') return 'Discord presence daemon: ONLINE\nAnime energy: 98%\nCute cursor: armed.';
  if (lower === 'ping') return 'Pinging moonlight.anime [127.0.0.1]... Reply: time=7ms TTL=uwu';
  if (lower === 'dir') return ' Directory of C:\\Users\\Takeshi\n\n<DIR> anime\n<DIR> lofi\n<DIR> secrets\nprofile.exe';
  if (lower.startsWith('run ') || lower.startsWith('npm ') || lower.startsWith('python ') || lower.startsWith('git ')) {
    return `Executing "${command}"...\n[OK] Pretending very professionally. No errors found.`;
  }
  return `"${command}" is not recognized... but it looks cool, so I will allow it. ✦`;
}

cmdTabs.addEventListener('click', (event) => {
  const tabButton = event.target.closest('.cmd-tab');
  if (!tabButton) return;
  const tabId = tabButton.dataset.tabId;
  if (event.target.closest('[data-close-tab]')) closeCmdTab(tabId);
  else switchCmdTab(tabId);
});
cmdNewTab.addEventListener('click', openCmdTab);
cmdInput.addEventListener('input', () => {
  activeCmdTab().input = cmdInput.value;
});
cmdForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const tab = activeCmdTab();
  const command = cmdInput.value.trim();
  if (!command) return;
  if (['cls', 'clear'].includes(command.toLowerCase())) {
    tab.log = '';
    tab.input = '';
    renderCmdBody();
    return;
  }
  tab.log += `${tab.log.endsWith('\n') ? '' : '\n'}C:\\Users\\Takeshi> ${command}\n`;
  const url = normalizeUrl(command);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    tab.log += `Opening ${url} in a new tab...\n`;
  } else {
    tab.log += `${fakeCommand(command)}\n`;
  }
  tab.input = '';
  renderCmdBody();
});

function setStatusClass(status) {
  const normalized = ['online', 'idle', 'dnd', 'offline'].includes(status) ? status : 'offline';
  presenceEls.orb.className = `status-orb ${normalized}`;
  const dot = presenceEls.statusText.querySelector('.inline-dot');
  if (dot) dot.className = `inline-dot ${normalized}`;
  return normalized;
}

function getAvatarUrl(user) {
  if (!user?.avatar) return '';
  const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
}

function getDiscordDecorationUrls(user) {
  const asset = user?.avatar_decoration_data?.asset;
  if (!asset) return [];
  const normalized = asset.replace(/^avatar-decoration-presets\//, '');
  return [
    `https://cdn.discordapp.com/avatar-decoration-presets/${normalized}.png?size=240&passthrough=true`,
    `https://cdn.discordapp.com/avatar-decoration-presets/${normalized}.png?size=96&passthrough=true`,
  ];
}

function getEmojiText(emoji) {
  if (!emoji) return '';
  if (emoji.id) return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
  return emoji.name || '';
}

function getElapsedText(timestamps) {
  if (!timestamps?.start) return '';
  const elapsed = Math.max(0, Date.now() - timestamps.start);
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours) return `Đã chạy ${hours}h ${minutes % 60}m`;
  return `Đã chạy ${minutes}m`;
}

function findCustomStatus(activities = []) {
  return activities.find((activity) => activity.type === 4);
}

function findPrimaryActivity(activities = []) {
  return activities.find((activity) => activity.type !== 4);
}

function describeActivity(activity, spotify) {
  if (spotify) {
    return {
      visible: true,
      icon: '♪',
      name: `Spotify · ${spotify.song || 'Đang nghe nhạc'}`,
      detail: [spotify.artist, spotify.album].filter(Boolean).join(' · ') || 'Đang phát qua Spotify.',
    };
  }

  if (!activity) return { visible: false, icon: '✦', name: '', detail: '', time: '' };
  const meta = activityTypes[activity.type] || { label: 'Hoạt động', icon: '✦' };
  return {
    visible: true,
    icon: meta.icon,
    name: `${meta.label} ${activity.name || ''}`.trim(),
    detail: [activity.details, activity.state].filter(Boolean).join(' · ') || 'Hoạt động đang chạy.',
    time: getElapsedText(activity.timestamps),
  };
}

function getClientText(data) {
  return [
    data.active_on_discord_desktop && 'Desktop',
    data.active_on_discord_mobile && 'Mobile',
    data.active_on_discord_web && 'Web',
  ].filter(Boolean).join(' · ');
}

function getCustomStatusText(activity) {
  if (!activity) return '';
  return [getEmojiText(activity.emoji), activity.state].filter(Boolean).join(' ').trim();
}

function updateActivityCard(activity) {
  presenceEls.activityCard.classList.toggle('hidden', !activity.visible);
  if (!activity.visible) return;
  presenceEls.activityIcon.textContent = activity.icon;
  presenceEls.activityName.textContent = activity.name;
  presenceEls.activityDetail.textContent = activity.detail;
  presenceEls.activityTime.textContent = activity.time;
}

const clanBadge = document.getElementById('clan-badge');
const clanBadgeIcon = document.getElementById('clan-badge-icon');
const clanBadgeTag = document.getElementById('clan-badge-tag');

const discordBadgeFlags = [
  { bit: 1 << 0, label: 'Nhân viên Discord (Discord Staff)', icon: './data/badges/discord-staff.svg' },
  { bit: 1 << 1, label: 'Chủ sở hữu máy chủ đối tác (Partnered Server Owner)', icon: './data/badges/discord-partner.svg' },
  { bit: 1 << 2, label: 'HypeSquad Events Coordinator', icon: './data/badges/hypesquad-event.svg' },
  { bit: 1 << 3, label: 'Thợ săn lỗi cấp 1 (Bug Hunter Level 1)', icon: './data/badges/bug-hunter-lv1.svg' },
  { bit: 1 << 6, label: 'HypeSquad Dũng Cảm (Bravery)', icon: './data/badges/hypesquad-bravery.svg' },
  { bit: 1 << 7, label: 'HypeSquad Lỗi Lạc (Brilliance)', icon: './data/badges/hypesquad-brilliance.svg' },
  { bit: 1 << 8, label: 'HypeSquad Cân Bằng (Balance)', icon: './data/badges/hypesquad-balance.svg' },
  { bit: 1 << 9, label: 'Người ủng hộ sớm (Early Supporter)', icon: './data/badges/early-supporter.svg' },
  { bit: 1 << 14, label: 'Thợ săn lỗi cấp 2 (Bug Hunter Level 2)', icon: './data/badges/bug-hunter-lv2.svg' },
  { bit: 1 << 17, label: 'Nhà phát triển bot xác minh sớm (Early Verified Bot Developer)', icon: './data/badges/early-verified-bot-developer.svg' },
  { bit: 1 << 18, label: 'Điều hành viên được chứng nhận (Discord Certified Moderator)', icon: './data/badges/discord-certified-moderator.svg' },
  { bit: 1 << 22, label: 'Nhà phát triển tích cực (Active Developer)', icon: './data/badges/active-developer.svg' },
];

function renderDiscordBadges(user) {
  if (!presenceEls.publicFlags) return;
  const flags = Number(user?.public_flags) || 0;
  const badges = [];

  // 1. Bitfield badges decoded from public_flags
  for (const badge of discordBadgeFlags) {
    if ((flags & badge.bit) === badge.bit) {
      badges.push({ name: badge.label, icon: badge.icon, nitro: false });
    }
  }

  // 2. Discord Nitro badge (detected from avatar decoration or animated avatar)
  const hasNitro = Boolean(
    user?.avatar_decoration_data ||
    user?.avatar?.startsWith('a_') ||
    user?.banner?.startsWith('a_')
  );

  if (hasNitro) {
    badges.push({
      name: 'Thuê bao Discord Nitro',
      icon: './data/badges/nitro-new.svg',
      nitro: true,
    });
    badges.push({
      name: 'Server Booster',
      icon: './data/badges/boost-6-month.svg',
      nitro: true,
    });
  }

  // 3. Legacy Username badge
  if (user?.discriminator === '0' || user?.username) {
    const legacyName = user?.username ? `${user.username}#7502` : 'takeshi#7502';
    badges.push({
      name: `Nguyên bản là ${legacyName}`,
      icon: './data/badges/legacy-username.svg',
      nitro: false,
    });
  }

  if (!badges.length) {
    presenceEls.publicFlags.innerHTML = '<span class="discord-badge empty">Không có huy hiệu</span>';
    return;
  }

  presenceEls.publicFlags.innerHTML = badges.map((badge) => `
    <span class="discord-badge ${badge.nitro ? 'nitro' : ''}" data-tooltip="${badge.name}" aria-label="${badge.name}">
      <img src="${badge.icon}" alt="${badge.name}">
    </span>
  `).join('');
}

function updateClanBadge(primaryGuild) {
  if (!clanBadge) return;
  if (primaryGuild && primaryGuild.tag && primaryGuild.identity_enabled !== false) {
    clanBadge.style.display = 'inline-flex';
    if (clanBadgeTag) clanBadgeTag.textContent = primaryGuild.tag;

    if (primaryGuild.badge && primaryGuild.identity_guild_id) {
      const badgeUrl = `https://cdn.discordapp.com/clan-badges/${primaryGuild.identity_guild_id}/${primaryGuild.badge}.png?size=32`;
      if (clanBadgeIcon) {
        clanBadgeIcon.src = badgeUrl;
        clanBadgeIcon.style.display = 'inline-block';
      }
    } else if (clanBadgeIcon) {
      clanBadgeIcon.style.display = 'none';
    }

    clanBadge.title = `Clan: ${primaryGuild.tag} (Guild ID: ${primaryGuild.identity_guild_id || ''})`;
    clanBadge.dataset.guildId = primaryGuild.identity_guild_id || '';
  } else {
    clanBadge.style.display = 'none';
  }
}

function updateMetaFields(data, user) {
  presenceEls.spotifyStatus.textContent = data.listening_to_spotify && data.spotify
    ? `${data.spotify.song || 'Spotify'} · ${data.spotify.artist || 'Unknown'}`
    : 'Chưa phát hiện';
  renderDiscordBadges(user);
  updateClanBadge(user?.primary_guild);
}

function setLocalDecoration() {
  const randomImage = DECORATIONS[Math.floor(Math.random() * DECORATIONS.length)];
  presenceEls.decoration.src = `./data/decoration/${randomImage}`;
  presenceEls.decoration.dataset.source = 'local';
}

function setDiscordDecoration(urls) {
  if (!urls.length) {
    if (presenceEls.decoration.dataset.source !== 'local') setLocalDecoration();
    return;
  }

  let index = 0;
  presenceEls.decoration.dataset.source = 'discord';
  presenceEls.decoration.onerror = () => {
    index += 1;
    if (urls[index]) {
      presenceEls.decoration.src = urls[index];
    } else {
      presenceEls.decoration.onerror = null;
      setLocalDecoration();
    }
  };
  presenceEls.decoration.src = urls[index];
}

function formatVietnamTime() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value || '';
  return `VN ${get('hour')}:${get('minute')}:${get('second')} ${get('dayPeriod')}`;
}

function updateVietnamClock() {
  presenceEls.updated.textContent = formatVietnamTime();
}

updateVietnamClock();
setInterval(updateVietnamClock, 1000);

function startProfileNameTyping() {
  const target = presenceEls.typingName;
  if (!target) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = profileTypingWords[wordIndex];
    target.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex += 1;
      setTimeout(tick, 100);
      return;
    }

    if (!deleting) {
      deleting = true;
      setTimeout(tick, wordIndex === 0 ? 3000 : 1150);
      return;
    }

    if (charIndex > 0) {
      charIndex -= 1;
      setTimeout(tick, 60);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % profileTypingWords.length;
    setTimeout(tick, 260);
  };

  tick();
}

startProfileNameTyping();

async function fetchDiscordPresence() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { cache: 'no-store' });
    const payload = await response.json();
    if (!payload.success) throw new Error('Lanyard returned unsuccessful response');

    const data = payload.data;
    const user = data.discord_user;
    const status = setStatusClass(data.discord_status);
    const statusLabel = statusLabels[status] || 'Đang offline';
    const clientText = getClientText(data);
    const customStatusText = getCustomStatusText(findCustomStatus(data.activities));
    const primaryActivity = describeActivity(findPrimaryActivity(data.activities), data.listening_to_spotify ? data.spotify : null);
    const avatarUrl = getAvatarUrl(user);
    const discordDecorationUrls = getDiscordDecorationUrls(user);

    profileTypingWords[0] = user.global_name || user.display_name || 'Takeshi';
    presenceEls.username.textContent = user.username || 'takeshi';
    presenceEls.customStatusLine.textContent = customStatusText || '...';
    presenceEls.statusText.innerHTML = `<span class="inline-dot ${status}"></span>${statusLabel}`;
    const platformDisplay = clientText || (status === 'offline' ? 'Offline' : 'Online');
    presenceEls.clientPlatformText.textContent = platformDisplay;
    if (presenceEls.clientPlatformBtn) {
      const svgDot = presenceEls.clientPlatformBtn.querySelector('svg circle');
      if (svgDot) {
        const colors = { online: '#3ee87d', idle: '#f0b232', dnd: '#f45b69', offline: '#80848e' };
        svgDot.setAttribute('fill', colors[status] || colors.offline);
      }
    }
    updateVietnamClock();
    if (avatarUrl) presenceEls.avatar.src = avatarUrl;

    setDiscordDecoration(discordDecorationUrls);

    updateActivityCard(primaryActivity);
    updateMetaFields(data, user);
  } catch (error) {
    console.warn('Unable to retrieve Discord presence:', error);
    const status = setStatusClass('offline');
    presenceEls.statusText.innerHTML = `<span class="inline-dot ${status}"></span>Chưa thể đồng bộ Discord`;
    presenceEls.customStatusLine.textContent = '...';
    presenceEls.clientPlatformText.textContent = 'Offline';
    if (presenceEls.clientPlatformBtn) {
      const svgDot = presenceEls.clientPlatformBtn.querySelector('svg circle');
      if (svgDot) svgDot.setAttribute('fill', '#80848e');
    }
    updateVietnamClock();
    presenceEls.spotifyStatus.textContent = 'Không rõ';
    presenceEls.publicFlags.innerHTML = '<span class="discord-badge empty">Không rõ</span>';
  }
}
fetchDiscordPresence();
setInterval(fetchDiscordPresence, 6000);

function rotateDecoration() {
  if (presenceEls.decoration.dataset.source === 'discord') return;
  setLocalDecoration();
}
setInterval(rotateDecoration, 5000);

function enterConsole() {
  if (introTimer) clearInterval(introTimer);
  showScreen(profileScreen);
}

['page-one-link', 'page-two-link'].forEach((id) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.addEventListener('click', (event) => event.preventDefault());
});

const colorTool = {
  page: document.getElementById('tab-colorizer'),
  profile: document.querySelector('.profile-console'),
  open: document.getElementById('mal-link'),
  back: document.getElementById('color-back'),
  text: document.getElementById('tc-input-text'),
  effect: document.getElementById('tc-effect'),
  font: document.getElementById('tc-font'),
  size: document.getElementById('tc-size'),
  c1: document.getElementById('tc-color-1'),
  c2: document.getElementById('tc-color-2'),
  c3: document.getElementById('tc-color-3'),
  bold: document.getElementById('tc-bold'),
  italic: document.getElementById('tc-italic'),
  word: document.getElementById('tc-word'),
  colorLabels: [...document.querySelectorAll('.color-picks label')],
  preview: document.getElementById('tc-preview'),
  output: document.getElementById('tc-output'),
  copy: document.getElementById('tc-copy'),
};

const BOT_STATUS_ENDPOINTS = [
  'http://musicbot-api.takeshi.dev:3000/api/public-status',
  'https://musicbot-api.takeshi.dev/api/public-status',
  'http://localhost:3000/api/public-status',
  'http://127.0.0.1:3000/api/public-status',
  'http://localhost:20128/api/public-status',
  'http://127.0.0.1:20128/api/public-status',
];
const BOT_STATUS_REFRESH_MS = 15000;
let botStatusTimer = null;
let activeBotStatusApi = null;

const botPage = {
  page: document.getElementById('tab-bot'),
  open: document.getElementById('page-two-link'),
  back: document.getElementById('bot-back'),
  avatar: document.getElementById('bot-avatar'),
  statusDot: document.getElementById('bot-status-dot'),
  statusText: document.getElementById('bot-status-text'),
  pageTitle: document.getElementById('bot-page-title'),
  name: document.getElementById('bot-display-name'),
  customStatus: document.getElementById('bot-custom-status'),
  hero: document.querySelector('.bot-hero'),
  invite: document.getElementById('bot-invite-link'),
  updatedAt: document.getElementById('bot-updated-at'),
  ping: document.getElementById('bot-ping'),
  servers: document.getElementById('bot-servers'),
  playing: document.getElementById('bot-playing'),
  connected: document.getElementById('bot-connected'),
  runtime: document.getElementById('bot-runtime'),
  lavalink: document.getElementById('bot-lavalink'),
};

let activeInnerPage = null;

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

function rgbToHex([r, g, b]) {
  return [r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function lerpColor(start, end, step, total) {
  const ratio = total <= 1 ? 0 : step / (total - 1);
  return start.map((value, index) => value + (end[index] - value) * ratio);
}

function colorAt(index, total, effect) {
  const first = hexToRgb(colorTool.c1.value);
  const mid = hexToRgb(colorTool.c2.value);
  const last = hexToRgb(colorTool.c3.value);
  if (effect === 'solid') return rgbToHex(first);
  if (effect === 'rainbow') {
    const hue = Math.round((index / Math.max(1, total)) * 300);
    const tmp = document.createElement('span');
    tmp.style.color = `hsl(${hue}, 100%, 62%)`;
    document.body.appendChild(tmp);
    const rgb = getComputedStyle(tmp).color.match(/\d+/g).slice(0, 3).map(Number);
    tmp.remove();
    return rgbToHex(rgb);
  }
  if (effect === 'three') {
    const half = Math.max(1, Math.floor((total - 1) / 2));
    return index <= half ? rgbToHex(lerpColor(first, mid, index, half + 1)) : rgbToHex(lerpColor(mid, last, index - half, total - half));
  }
  if (effect === 'mirror') {
    const half = Math.max(1, Math.floor((total - 1) / 2));
    return index <= half ? rgbToHex(lerpColor(first, mid, index, half + 1)) : rgbToHex(lerpColor(mid, first, index - half, total - half));
  }
  return rgbToHex(lerpColor(first, last, index, total));
}

function updateColorPickState() {
  const effect = colorTool.effect.value;
  const enabledMap = {
    two: [true, false, true],
    mirror: [true, true, false],
    three: [true, true, true],
    solid: [true, false, false],
    random: [false, false, false],
    rainbow: [false, false, false],
  };
  const enabled = enabledMap[effect] || [true, true, true];
  colorTool.colorLabels.forEach((label, index) => {
    label.classList.toggle('disabled', !enabled[index]);
    const input = label.querySelector('input');
    if (input) input.disabled = !enabled[index];
  });
  colorTool.word.closest('label')?.classList.toggle('disabled', effect !== 'random');
  colorTool.word.disabled = effect !== 'random';
}

function buildUnityRichText() {
  updateColorPickState();
  const raw = colorTool.text.value || '';
  const effect = colorTool.effect.value;
  const tokens = effect === 'random' && colorTool.word.checked ? raw.split(/(\s+)/) : [...raw];
  const visibleTokens = tokens.filter((token) => token.trim()).length || raw.length || 1;
  let visibleIndex = 0;
  let html = '';
  let rich = '';

  tokens.forEach((token, index) => {
    if (!token.trim()) {
      html += token;
      rich += token;
      return;
    }
    const color = effect === 'random'
      ? rgbToHex([Math.random() * 255, Math.random() * 255, Math.random() * 255])
      : colorAt(visibleIndex, visibleTokens, effect);
    html += `<span style="color:#${color}">${token}</span>`;
    rich += `<color=#${color}>${token}</color>`;
    visibleIndex += 1;
  });

  if (colorTool.font.value) {
    html = `<span style="font-family:${colorTool.font.value}">${html}</span>`;
  }
  if (colorTool.size.value !== '0') {
    html = `<span style="font-size:${colorTool.size.value}px">${html}</span>`;
    rich = `<size=${colorTool.size.value}>${rich}</size>`;
  }
  if (colorTool.italic.checked) {
    html = `<i>${html}</i>`;
    rich = `<i>${rich}</i>`;
  }
  if (colorTool.bold.checked) {
    html = `<b>${html}</b>`;
    rich = `<b>${rich}</b>`;
  }

  colorTool.preview.innerHTML = html || 'Preview sẽ hiện ở đây';
  colorTool.output.value = rich;
}

function showInnerPage(page, afterShow) {
  if (!page) return;
  resetCardPointer();
  activeInnerPage?.classList.add('hidden');
  activeInnerPage?.classList.remove('leaving');
  activeInnerPage = page;
  page.style.setProperty('--tilt-x', '0deg');
  page.style.setProperty('--tilt-y', '0deg');
  document.body.classList.add('color-page-active');
  colorTool.profile.classList.remove('slide-to-home');
  colorTool.profile.classList.add('slide-to-color', 'page-mode');
  page.classList.remove('hidden', 'leaving');
  afterShow?.();
  setTimeout(() => {
    colorTool.profile.classList.remove('slide-to-color');
    resetCardPointer();
  }, 760);
}

function hideInnerPage(page) {
  if (!page) return;
  resetCardPointer();
  page.classList.add('leaving');
  colorTool.profile.classList.remove('slide-to-color');
  colorTool.profile.classList.add('slide-to-home');
  setTimeout(() => {
    document.body.classList.remove('color-page-active');
    colorTool.profile.classList.remove('page-mode', 'slide-to-home');
    page.classList.add('hidden');
    page.classList.remove('leaving');
    if (activeInnerPage === page) activeInnerPage = null;
    resetCardPointer();
  }, 560);
}

function showColorPage() {
  showInnerPage(colorTool.page, buildUnityRichText);
}

function hideColorPage() {
  hideInnerPage(colorTool.page);
}

function setText(element, value) {
  if (element) element.textContent = value;
}

function setBotStatusDot(status = 'offline') {
  if (!botPage.statusDot) return;
  botPage.statusDot.className = `bot-status-dot ${status}`;
}

function formatUpdatedAt(value) {
  const date = value ? new Date(value) : new Date();
  return `Cập nhật ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
}

function renderBotStatus(data) {
  const bot = data.bot || {};
  const music = data.music || {};
  const lavalink = data.lavalink || {};
  const nodes = lavalink.nodes || [];
  const status = bot.status || 'offline';
  const onlineNodes = Number.isFinite(lavalink.onlineCount)
    ? lavalink.onlineCount
    : nodes.filter(node => node.online).length;
  const lavalinkText = onlineNodes > 0
    ? `Đang chạy: ${onlineNodes} node・Online`
    : 'Đang chạy: 0 node・Offline';

  if (botPage.avatar && bot.avatar) botPage.avatar.src = bot.avatar;
  if (botPage.hero) {
    botPage.hero.style.backgroundImage = bot.banner
      ? `linear-gradient(135deg, rgba(9,12,26,.86), rgba(16,18,35,.64) 54%, rgba(8,11,22,.88)), url('${bot.banner}')`
      : '';
  }
  setBotStatusDot(status);
  setText(botPage.statusText, `${status.toUpperCase()}${bot.tag ? ` • ${bot.tag}` : ''}`);
  setText(botPage.pageTitle, bot.name || 'Music Bot');
  setText(botPage.name, bot.name || 'Music Bot');
  setText(botPage.customStatus, bot.customStatus || 'Không có custom status');
  setText(botPage.ping, `${music.ping ?? '--'}ms`);
  setText(botPage.servers, music.servers ?? '--');
  setText(botPage.playing, `${music.playingRooms ?? '--'} phòng`);
  setText(botPage.connected, `${music.connectedRooms ?? '--'} phòng`);
  setText(botPage.runtime, music.runtime || '--');
  setText(botPage.lavalink, lavalinkText);
  setText(botPage.updatedAt, formatUpdatedAt(data.updatedAt));

  if (botPage.invite && bot.inviteUrl) {
    botPage.invite.href = bot.inviteUrl;
    botPage.invite.classList.remove('disabled');
  }
}

function renderBotStatusError() {
  setBotStatusDot('offline');
  setText(botPage.statusText, 'OFFLINE • Không kết nối được API');
  setText(botPage.customStatus, 'Kiểm tra lại xem bot có đang chạy không!');
  setText(botPage.updatedAt, 'API chưa phản hồi');
}

async function requestBotStatus(endpoint) {
  const response = await fetch(`${endpoint}?t=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Status ${response.status}`);
  const data = await response.json();
  if (!data.ok) throw new Error(data.message || 'Bot API not ready');
  activeBotStatusApi = endpoint;
  return data;
}

async function fetchBotStatus() {
  try {
    const endpoints = activeBotStatusApi
      ? [activeBotStatusApi, ...BOT_STATUS_ENDPOINTS.filter(endpoint => endpoint !== activeBotStatusApi)]
      : BOT_STATUS_ENDPOINTS;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        const data = await requestBotStatus(endpoint);
        renderBotStatus(data);
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('No bot API endpoint responded');
  } catch (error) {
    console.warn('Bot status fetch failed:', error);
    renderBotStatusError();
  }
}

function startBotStatusPolling() {
  fetchBotStatus();
  clearInterval(botStatusTimer);
  botStatusTimer = setInterval(fetchBotStatus, BOT_STATUS_REFRESH_MS);
}

function stopBotStatusPolling() {
  clearInterval(botStatusTimer);
  botStatusTimer = null;
}

function showBotPage() {
  showInnerPage(botPage.page, startBotStatusPolling);
}

function hideBotPage() {
  stopBotStatusPolling();
  hideInnerPage(botPage.page);
}

if (colorTool.open) colorTool.open.addEventListener('click', (event) => { event.preventDefault(); showColorPage(); });
if (colorTool.back) colorTool.back.addEventListener('click', hideColorPage);
if (botPage.open) botPage.open.addEventListener('click', (event) => { event.preventDefault(); showBotPage(); });
if (botPage.back) botPage.back.addEventListener('click', hideBotPage);
['input', 'change'].forEach((type) => {
  ['text', 'effect', 'font', 'size', 'c1', 'c2', 'c3', 'bold', 'italic', 'word'].forEach((key) => {
    colorTool[key]?.addEventListener(type, buildUnityRichText);
  });
});
colorTool.copy?.addEventListener('click', async () => {
  await navigator.clipboard.writeText(colorTool.output.value);
  colorTool.copy.textContent = 'Đã copy!';
  setTimeout(() => { colorTool.copy.textContent = 'Copy Unity Rich Text'; }, 1200);
});
buildUnityRichText();

const interactiveCard = document.querySelector('.profile-console');
const pointerGlow = document.getElementById('pointer-glow');
let activeTiltTarget = null;
let rippleCooldown = 0;
let pageRippleCooldown = 0;

const CARD_RIPPLE_INTERVAL = 920;
const PAGE_RIPPLE_INTERVAL = 1250;

function updateGlobalPointer(event) {
  document.body.style.setProperty('--pointer-x', `${event.clientX}px`);
  document.body.style.setProperty('--pointer-y', `${event.clientY}px`);
  document.body.classList.add('pointer-active');
}

function spawnPageRipple() {}

function getTiltTarget() {
  if (!interactiveCard) return null;
  if (activeInnerPage && !activeInnerPage.classList.contains('hidden')) return activeInnerPage;
  return interactiveCard;
}

function updateCardPointer(event) {
  const target = getTiltTarget();
  if (!target) return;
  if (activeTiltTarget && activeTiltTarget !== target) resetCardPointer();
  activeTiltTarget = target;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const px = x / rect.width;
  const py = y / rect.height;
  const tiltY = (px - 0.5) * 2.2;
  const tiltX = (0.5 - py) * 2.2;
  target.style.setProperty('--glow-x', `${px * 100}%`);
  target.style.setProperty('--glow-y', `${py * 100}%`);
  target.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
  target.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
  target.classList.add('interactive-hover');
}

function resetCardPointer() {
  const target = activeTiltTarget || interactiveCard;
  if (!target) return;
  target.classList.remove('interactive-hover');
  target.style.setProperty('--tilt-x', '0deg');
  target.style.setProperty('--tilt-y', '0deg');
  activeTiltTarget = null;
}

function spawnCardRipple() {}

if (pointerGlow) {
  document.addEventListener('pointermove', (event) => {
    updateGlobalPointer(event);
  });
  document.addEventListener('pointerdown', (event) => {
    updateGlobalPointer(event);
  });
  document.addEventListener('pointerleave', () => document.body.classList.remove('pointer-active'));
}

if (interactiveCard) {
  document.addEventListener('pointermove', (event) => {
    const target = getTiltTarget();
    if (!target || !target.contains(event.target)) {
      if (activeTiltTarget) resetCardPointer();
      return;
    }
    updateCardPointer(event);
  });
  document.addEventListener('pointerdown', (event) => {
    const target = getTiltTarget();
    if (!target || !target.contains(event.target)) return;
  });
  document.addEventListener('pointerover', (event) => {
    const target = getTiltTarget();
    if (target && target.contains(event.target)) activeTiltTarget = target;
  });
  document.addEventListener('pointerout', (event) => {
    const target = activeTiltTarget;
    if (target && !target.contains(event.relatedTarget)) resetCardPointer();
  });
}

// Panel Toggle (Collapse / Expand right widgets panel & Mobile Bottom Sheet)
const panelToggleBtn = document.getElementById('panelToggleBtn');
const rightPanelContainer = document.getElementById('rightPanelContainer');
const mobilePanelBackdrop = document.getElementById('mobilePanelBackdrop');
const closeMobilePanelBtn = document.getElementById('closeMobilePanelBtn');

function syncPanelPlacement() {
  const isMobile = window.innerWidth <= 880;
  if (!interactiveCard || !profileScreen || !rightPanelContainer) return;

  if (isMobile) {
    if (rightPanelContainer.parentElement !== profileScreen) {
      profileScreen.appendChild(rightPanelContainer);
    }
  } else {
    if (rightPanelContainer.parentElement !== interactiveCard) {
      interactiveCard.appendChild(rightPanelContainer);
    }
  }
}

window.addEventListener('resize', () => {
  syncPanelPlacement();
  if (window.innerWidth > 880) {
    document.body.classList.remove('mobile-panel-open');
    mobilePanelBackdrop?.classList.remove('active');
  }
});
syncPanelPlacement();

function setPanelState(collapsed) {
  if (!rightPanelContainer) return;
  syncPanelPlacement();
  rightPanelContainer.classList.toggle('collapsed', collapsed);
  interactiveCard?.classList.toggle('collapsed', collapsed);
  panelToggleBtn?.classList.toggle('is-collapsed', collapsed);
  mobilePanelBackdrop?.classList.toggle('active', !collapsed);

  if (collapsed) {
    panelToggleBtn?.setAttribute('title', 'Mở rộng bảng');
    panelToggleBtn?.setAttribute('aria-label', 'Mở rộng bảng');
    document.body.classList.remove('mobile-panel-open');
  } else {
    panelToggleBtn?.setAttribute('title', 'Thu gọn bảng');
    panelToggleBtn?.setAttribute('aria-label', 'Thu gọn bảng');
    if (window.innerWidth <= 880) {
      document.body.classList.add('mobile-panel-open');
    }
  }
}

if (panelToggleBtn && rightPanelContainer) {
  panelToggleBtn.addEventListener('click', () => {
    const isCurrentlyCollapsed = rightPanelContainer.classList.contains('collapsed');
    setPanelState(!isCurrentlyCollapsed);
  });
}

if (closeMobilePanelBtn) {
  closeMobilePanelBtn.addEventListener('click', () => {
    setPanelState(true);
  });
}

if (mobilePanelBackdrop) {
  mobilePanelBackdrop.addEventListener('click', () => {
    setPanelState(true);
  });
}

// ESC key closes panel if open
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && rightPanelContainer && !rightPanelContainer.classList.contains('collapsed')) {
    setPanelState(true);
  }
});

// Mobile drag handle swipe down to close
const dragHandle = document.querySelector('.mobile-drag-handle');
const mobileHeader = document.querySelector('.mobile-panel-header');
let touchStartY = 0;
let touchDiffY = 0;

[dragHandle, mobileHeader].forEach((el) => {
  if (!el) return;
  el.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchDiffY = 0;
  }, { passive: true });

  el.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    touchDiffY = currentY - touchStartY;
    if (touchDiffY > 0 && rightPanelContainer && window.innerWidth <= 880) {
      rightPanelContainer.style.transform = `translateY(${touchDiffY}px)`;
    }
  }, { passive: true });

  el.addEventListener('touchend', () => {
    if (rightPanelContainer) {
      rightPanelContainer.style.transform = '';
    }
    if (touchDiffY > 70) {
      setPanelState(true);
    }
    touchStartY = 0;
    touchDiffY = 0;
  });
});

// Navigation Tabs Switching
const navTabBtns = document.querySelectorAll('.nav-tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

navTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    if (!targetTab) return;

    navTabBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach((c) => c.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const targetContent = document.getElementById(`tab-${targetTab}`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
    if (targetTab === 'colorizer') {
      buildUnityRichText();
    } else if (targetTab === 'bot') {
      startBotStatusPolling();
    } else {
      stopBotStatusPolling();
    }
  });
});
