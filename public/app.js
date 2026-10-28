const TOKEN_KEY = "codex-pocket-token";
const ACTIVE_KEY = "codex-pocket-active";
const INSTALL_DISMISSED_KEY = "codex-pocket-install-dismissed";
const THEME_KEY = "codex-pocket-theme";
const IDENTITY_KEY = "codex-pocket-identity";
const COMPUTER_NAME_PROMPT_PREFIX = "codex-pocket-computer-name-prompted";
const NOTIFICATION_KEY = "codex-pocket-notification-settings";
const DOWNLOAD_HISTORY_KEY = "codex-pocket-download-history";
const CONVERSATION_FILES_KEY = "codex-pocket-conversation-files";
const MODEL_KEY = "codex-pocket-model";
const APPROVAL_KEY = "codex-pocket-approval-policy";
const BOOTSTRAP_CACHE_KEY = "codex-pocket-bootstrap-cache-v1";
const CONVERSATION_CACHE_PREFIX = "codex-pocket-conversation-cache-v1:";
const CACHE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;


const elements = {
  appShell: document.getElementById("appShell"),
  startupLoader: document.getElementById("startupLoader"),
  startupLoaderTitle: document.getElementById("startupLoaderTitle"),
  startupLoaderText: document.getElementById("startupLoaderText"),
  pairingScreen: document.getElementById("pairingScreen"),
  pairingForm: document.getElementById("pairingForm"),
  pairingInput: document.getElementById("pairingInput"),
  pairingStatus: document.getElementById("pairingStatus"),
  scanButton: document.getElementById("scanButton"),
  scanDialog: document.getElementById("scanDialog"),
  closeScanButton: document.getElementById("closeScanButton"),
  scanVideo: document.getElementById("scanVideo"),
  scanStatus: document.getElementById("scanStatus"),
  scanCanvas: document.getElementById("scanCanvas"),
  connectionBadge: document.getElementById("connectionBadge"),
  connectionText: document.getElementById("connectionText"),
  workdirLabel: document.getElementById("workdirLabel"),
  projectSelect: document.getElementById("projectSelect"),
  agentSelect: document.getElementById("agentSelect"),
  sandboxLabel: document.getElementById("sandboxLabel"),
  infoProjects: document.getElementById("infoProjects"),
  messageList: document.getElementById("messageList"),
  conversationLoadingRow: document.getElementById("conversationLoadingRow"),
  conversationLoadingText: document.getElementById("conversationLoadingText"),
  chatStage: document.getElementById("chatStage"),
  emptyState: document.getElementById("emptyState"),
  quickPrompts: document.getElementById("quickPrompts"),
  typingRow: document.getElementById("typingRow"),
  typingAvatar: document.getElementById("typingAvatar"),
  topUnreadBadge: document.getElementById("topUnreadBadge"),
  brandUnreadBadge: document.getElementById("brandUnreadBadge"),
  topbarTitle: document.getElementById("topbarTitle"),
  typingText: document.getElementById("typingText"),
  composer: document.getElementById("composer"),
  messageInput: document.getElementById("messageInput"),
  attachButton: document.getElementById("attachButton"),
  attachmentMenu: document.getElementById("attachmentMenu"),
  pickPhotoButton: document.getElementById("pickPhotoButton"),
  takePhotoButton: document.getElementById("takePhotoButton"),
  photoInput: document.getElementById("photoInput"),
  cameraInput: document.getElementById("cameraInput"),
  videoInput: document.getElementById("videoInput"),
  pickVideoButton: document.getElementById("pickVideoButton"),
  fileInput: document.getElementById("fileInput"),
  pickFileButton: document.getElementById("pickFileButton"),
  quickModelOptions: document.getElementById("quickModelOptions"),
  approvalPolicyOptions: document.getElementById("approvalPolicyOptions"),
  stopTaskSection: document.getElementById("stopTaskSection"),
  sendButton: document.getElementById("sendButton"),
  stopButton: document.getElementById("stopButton"),
  micButton: document.getElementById("micButton"),
  voiceTalkButton: document.getElementById("voiceTalkButton"),


  voiceOverlay: document.getElementById("voiceOverlay"),
  voiceRecordingCard: document.getElementById("voiceRecordingCard"),
  voiceRecordingTime: document.getElementById("voiceRecordingTime"),
  voiceOverlayHint: document.getElementById("voiceOverlayHint"),
  voiceLiveText: document.getElementById("voiceLiveText"),
  mediaViewer: document.getElementById("mediaViewer"),
  mediaViewerStage: document.getElementById("mediaViewerStage"),
  mediaViewerImage: document.getElementById("mediaViewerImage"),
  mediaViewerVideo: document.getElementById("mediaViewerVideo"),
  mediaViewerError: document.getElementById("mediaViewerError"),
  mediaViewerCounter: document.getElementById("mediaViewerCounter"),
  mediaViewerCaption: document.getElementById("mediaViewerCaption"),
  closeMediaViewerButton: document.getElementById("closeMediaViewerButton"),
  saveMediaViewerButton: document.getElementById("saveMediaViewerButton"),
  prevMediaViewerButton: document.getElementById("prevMediaViewerButton"),
  nextMediaViewerButton: document.getElementById("nextMediaViewerButton"),
  queuePanel: document.getElementById("queuePanel"),
  queueCount: document.getElementById("queueCount"),
  cancelAllQueueButton: document.getElementById("cancelAllQueueButton"),
  queueList: document.getElementById("queueList"),
  steerDialog: document.getElementById("steerDialog"),
  steerPreview: document.getElementById("steerPreview"),
  confirmSteerButton: document.getElementById("confirmSteerButton"),
  cancelSteerButton: document.getElementById("cancelSteerButton"),
  closeSteerButton: document.getElementById("closeSteerButton"),
  steerStatus: document.getElementById("steerStatus"),
  approvalAlertDialog: document.getElementById("approvalAlertDialog"),
  approvalAlertText: document.getElementById("approvalAlertText"),
  openApprovalAlertButton: document.getElementById("openApprovalAlertButton"),
  dismissApprovalAlertButton: document.getElementById("dismissApprovalAlertButton"),
  laterApprovalAlertButton: document.getElementById("laterApprovalAlertButton"),
  newChatButton: document.getElementById("newChatButton"),
  drawerNewChat: document.getElementById("drawerNewChat"),
  drawerScanButton: document.getElementById("drawerScanButton"),
  computerProfileList: document.getElementById("computerProfileList"),
  addComputerButton: document.getElementById("addComputerButton"),
  computerProfilesStatus: document.getElementById("computerProfilesStatus"),
  menuButton: document.getElementById("menuButton"),
  drawer: document.getElementById("drawer"),
  drawerBackdrop: document.getElementById("drawerBackdrop"),
  closeDrawerButton: document.getElementById("closeDrawerButton"),
  conversationList: document.getElementById("conversationList"),
  drawerVersion: document.getElementById("drawerVersion"),
  drawerTitle: document.getElementById("drawerTitle"),
  conversationSearch: document.getElementById("conversationSearch"),
  infoButton: document.getElementById("infoButton"),
  importButton: document.getElementById("importButton"),
  importDialog: document.getElementById("importDialog"),
  closeImportButton: document.getElementById("closeImportButton"),
  importSessionList: document.getElementById("importSessionList"),
  importStatus: document.getElementById("importStatus"),
  infoDialog: document.getElementById("infoDialog"),
  closeInfoButton: document.getElementById("closeInfoButton"),
  infoComputerName: document.getElementById("infoComputerName"),
  infoComputerId: document.getElementById("infoComputerId"),
  projectComputerName: document.getElementById("projectComputerName"),
  projectComputerId: document.getElementById("projectComputerId"),
  computerNameSummary: document.getElementById("computerNameSummary"),
  computerNameInput: document.getElementById("computerNameInput"),
  computerNameHelp: document.getElementById("computerNameHelp"),
  computerNameStatus: document.getElementById("computerNameStatus"),
  saveComputerNameButton: document.getElementById("saveComputerNameButton"),
  resetComputerNameButton: document.getElementById("resetComputerNameButton"),
  computerNameDialog: document.getElementById("computerNameDialog"),
  firstComputerNameInput: document.getElementById("firstComputerNameInput"),
  firstComputerNameHelp: document.getElementById("firstComputerNameHelp"),
  firstComputerNameStatus: document.getElementById("firstComputerNameStatus"),
  saveFirstComputerNameButton: document.getElementById("saveFirstComputerNameButton"),
  skipFirstComputerNameButton: document.getElementById("skipFirstComputerNameButton"),
  notificationSummary: document.getElementById("notificationSummary"),
  notificationsEnabled: document.getElementById("notificationsEnabled"),
  notifyCompletion: document.getElementById("notifyCompletion"),
  notifyApproval: document.getElementById("notifyApproval"),
  notificationStatus: document.getElementById("notificationStatus"),
  infoWorkdir: document.getElementById("infoWorkdir"),
  infoSandbox: document.getElementById("infoSandbox"),
  infoTransport: document.getElementById("infoTransport"),
  infoPublicUrl: document.getElementById("infoPublicUrl"),
  infoConnection: document.getElementById("infoConnection"),
  copyPairingButton: document.getElementById("copyPairingButton"),
  forgetButton: document.getElementById("forgetButton"),
  downloadApkLink: document.getElementById("downloadApkLink"),
  downloadConfirmDialog: document.getElementById("downloadConfirmDialog"),
  confirmDownloadButton: document.getElementById("confirmDownloadButton"),
  cancelDownloadButton: document.getElementById("cancelDownloadButton"),
  conversationFileList: document.getElementById("conversationFileList"),
  refreshFilesButton: document.getElementById("refreshFilesButton"),
  modelSelect: document.getElementById("modelSelect"),
  modelSummary: document.getElementById("modelSummary"),
  modelHelp: document.getElementById("modelHelp"),
  modelStatus: document.getElementById("modelStatus"),
  installBanner: document.getElementById("installBanner"),
  installButton: document.getElementById("installButton"),
  dismissInstall: document.getElementById("dismissInstall"),
  toast: document.getElementById("toast"),
  codexAvatarPreview: document.getElementById("codexAvatarPreview"),
  userAvatarPreview: document.getElementById("userAvatarPreview"),
  codexNameInput: document.getElementById("codexNameInput"),
  userNameInput: document.getElementById("userNameInput"),
  codexAvatarButton: document.getElementById("codexAvatarPreview"),
  userAvatarButton: document.getElementById("userAvatarPreview"),
  codexAvatarFile: document.getElementById("codexAvatarFile"),
  userAvatarFile: document.getElementById("userAvatarFile"),
  resetIdentityButton: document.getElementById("resetIdentityButton"),
  saveIdentityButton: document.getElementById("saveIdentityButton"),
  avatarCropDialog: document.getElementById("avatarCropDialog"),
  avatarCropTitle: document.getElementById("avatarCropTitle"),
  avatarCropStage: document.getElementById("avatarCropStage"),
  avatarCropImage: document.getElementById("avatarCropImage"),
  avatarCropZoom: document.getElementById("avatarCropZoom"),
  avatarCropInfo: document.getElementById("avatarCropInfo"),
  closeAvatarCropButton: document.getElementById("closeAvatarCropButton"),
  saveAvatarCropButton: document.getElementById("saveAvatarCropButton"),
  cancelAvatarCropButton: document.getElementById("cancelAvatarCropButton"),
};

const state = {
  token: "",
  config: null,
  computer: null,
  computerProfiles: [],
  projects: [],
  agents: [],
  selectedAgentId: "codex",
  modelsAgentId: "codex",
  selectedProjectPath: "",
  conversations: [],
  active: null,
  events: new Map(),
  lastSeq: 0,
  running: false,
  queuedMessages: [],
  pendingSteerQueueId: "",
  steeringQueueId: "",
  steerAbortController: null,
  polling: false,
  pollTimer: null,
  loadGeneration: 0,
  eventAbort: null,
  eventSocket: null,
  eventReconnectTimer: null,
  lastApiSuccessAt: 0,
  installPrompt: null,
  recognition: null,

  voiceRecorder: null,
  voiceChunks: [],
  voiceStream: null,
  voiceTimer: null,
  voiceUploading: false,
  voicePressActive: false,

  voicePressStartedAt: 0,
  lastVoicePointerAt: 0,

  voiceStartY: 0,
  voiceStartX: 0,
  nativeVoiceActive: false,
  nativeVoicePending: false,
  nativeVoiceBridge: null,
  voiceMode: false,
  voiceEngine: "",
  voiceTextEngine: "",
  voiceRecorderEngine: "",

  voiceDurationMs: 0,
  voiceActive: false,
  voiceProcessing: false,
  voiceReleased: false,
  voiceCancelArmed: false,
  voiceTranscribeArmed: false,
  voiceFanOpen: false,
  voiceFinalTranscript: "",
  voiceTimerStartedAt: 0,
  voiceTicker: null,
  voiceReleaseTimer: null,
  voiceSpeechActive: false,
  voicePartialTranscript: "",
  voiceLevel: 0,
  mediaViewerItems: [],
  mediaViewerIndex: 0,
  mediaViewerScale: 1,
  mediaViewerX: 0,
  mediaViewerY: 0,
  mediaViewerPointer: null,
  mediaViewerTouchStart: null,
  scanStream: null,
  scanTimer: null,
  scanBusy: false,
  scanStartTimer: null,
  toastTimer: null,
  themeMode: "system",
  drawerTab: "chats",
  searchQuery: "",
  pendingThreadTicket: "",
  identity: { codexName: "Codex", userName: "我", codexAvatar: "", userAvatar: "" },
  avatarCrop: null,
  notifications: { enabled: true, completion: true, approval: true },
  globalUnread: null,
  lastAppBadgeCount: null,
  cacheSaveTimer: null,
  bootstrapRetryTimer: null,
  startupLoaderTimer: null,
  computerNamePromptTimer: null,
  conversationsStatus: "idle",
  conversationsError: "",
  bootstrapRetrying: false,
  conversationLoadController: null,
  refreshingConversations: false,
  lastConversationRefreshAt: 0,
  approvalAlertConversationId: "",
  pendingDownloadUrl: "",
  pendingDownloadName: "",
  models: [],
  selectedModel: "",
  approvalPolicy: "on-request",
  readRequests: new Set(),
};

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
const wideDrawerMedia = window.matchMedia("(min-width: 600px) and (min-height: 480px)");

function normalizeThemeMode(mode) {
  return mode === "light" || mode === "dark" ? mode : "system";
}

function applyTheme(mode, { persist = true } = {}) {
  const normalized = normalizeThemeMode(mode);
  const resolved = normalized === "system" ? (themeMedia.matches ? "light" : "dark") : normalized;
  state.themeMode = normalized;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themeMode = normalized;
  document.documentElement.style.colorScheme = resolved;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = resolved === "light" ? "#ededed" : "#2b2b2b";
  for (const button of document.querySelectorAll("[data-theme-choice]")) {
    const active = button.dataset.themeChoice === normalized;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
  if (persist) {
    if (normalized === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, normalized);
  }
}

function setupTheme() {
  let saved = "system";
  try { saved = localStorage.getItem(THEME_KEY) || "system"; } catch {}
  applyTheme(saved, { persist: false });
  for (const button of document.querySelectorAll("[data-theme-choice]")) {
    button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
  }
  const syncSystemTheme = () => {
    if (state.themeMode === "system") applyTheme("system", { persist: false });
  };
  if (themeMedia.addEventListener) themeMedia.addEventListener("change", syncSystemTheme);
  else themeMedia.addListener(syncSystemTheme);
}

function normalizeDisplayName(value, fallback) {
  const name = String(value || "").replace(/\s+/g, " ").trim();
  return name ? name.slice(0, 20) : fallback;
}

function saveIdentity() {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(state.identity));
  } catch {}
}

function renderAvatarPreview(role) {
  const preview = role === "user" ? elements.userAvatarPreview : elements.codexAvatarPreview;
  const dataUrl = role === "user" ? state.identity.userAvatar : state.identity.codexAvatar;
  preview.innerHTML = "";
  if (dataUrl) {
    const image = document.createElement("img");
    image.src = dataUrl;
    image.alt = role === "user" ? state.identity.userName : state.identity.codexName;
    preview.append(image);
  } else if (role === "user") {
    preview.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19c.7-3.5 3-5.4 6.5-5.4s5.8 1.9 6.5 5.4"/></svg>';
  } else {
    preview.textContent = "C";
  }
}

function updateIdentityTextLabels() {
  const userName = normalizeDisplayName(state.identity.userName, "我");
  const codexName = normalizeDisplayName(state.identity.codexName, "Codex");
  document.querySelectorAll('.message.user .message-label').forEach((label) => {
    label.textContent = userName;
  });
  document.querySelectorAll('.message.assistant .message-label').forEach((label) => {
    if (!label.dataset.imageCaption) label.textContent = codexName;
  });
  if (elements.typingText) elements.typingText.textContent = `${codexName} 正在电脑上处理`;
}

function commitIdentityNames() {
  state.identity.codexName = normalizeDisplayName(elements.codexNameInput.value, "Codex");
  state.identity.userName = normalizeDisplayName(elements.userNameInput.value, "我");
  saveIdentity();
  refreshIdentityUi({ rerender: true });
  showToast("名字已保存");
}

function updateIdentityDraft(role, value) {
  state.identity[role] = String(value || "").slice(0, 20);
  saveIdentity();
  updateIdentityTextLabels();
}
function refreshIdentityUi({ rerender = false } = {}) {
  elements.codexNameInput.value = state.identity.codexName;
  elements.userNameInput.value = state.identity.userName;
  renderAvatarPreview("codex");
  renderAvatarPreview("user");
  refreshTypingAvatar();
  updateIdentityTextLabels();
  if (rerender) rerenderMessageList();
}

function rerenderMessageList() {
  const shouldScroll = isNearBottom();
  elements.messageList.innerHTML = "";
  const events = [...state.events.values()].sort((a, b) => a.seq - b.seq);
  for (const event of events) {
    const node = createEventNode(event);
    if (node) elements.messageList.append(node);
  }
  updateEmptyState();
  if (shouldScroll) scrollToBottom();
}

function cleanupAvatarCrop() {
  const crop = state.avatarCrop;
  if (crop?.objectUrl) URL.revokeObjectURL(crop.objectUrl);
  state.avatarCrop = null;
  if (elements.avatarCropImage) {
    elements.avatarCropImage.onload = null;
    elements.avatarCropImage.onerror = null;
    elements.avatarCropImage.removeAttribute("src");
    elements.avatarCropImage.style.width = "";
    elements.avatarCropImage.style.height = "";
    elements.avatarCropImage.style.left = "";
    elements.avatarCropImage.style.top = "";
  }
}

function clampAvatarCropOffset() {
  const crop = state.avatarCrop;
  if (!crop?.image) return;
  const width = crop.image.naturalWidth * crop.baseScale * crop.zoom;
  const height = crop.image.naturalHeight * crop.baseScale * crop.zoom;
  crop.offsetX = width <= crop.stageSize
    ? (crop.stageSize - width) / 2
    : Math.min(0, Math.max(crop.stageSize - width, crop.offsetX));
  crop.offsetY = height <= crop.stageSize
    ? (crop.stageSize - height) / 2
    : Math.min(0, Math.max(crop.stageSize - height, crop.offsetY));
}

function applyAvatarCropTransform() {
  const crop = state.avatarCrop;
  if (!crop?.image) return;
  clampAvatarCropOffset();
  const width = crop.image.naturalWidth * crop.baseScale * crop.zoom;
  const height = crop.image.naturalHeight * crop.baseScale * crop.zoom;
  elements.avatarCropImage.style.width = `${width}px`;
  elements.avatarCropImage.style.height = `${height}px`;
  elements.avatarCropImage.style.left = `${crop.offsetX}px`;
  elements.avatarCropImage.style.top = `${crop.offsetY}px`;
}

function openAvatarCrop(file, role) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("请选择图片文件");
    return;
  }
  cleanupAvatarCrop();
  const objectUrl = URL.createObjectURL(file);
  state.avatarCrop = {
    role,
    file,
    objectUrl,
    image: null,
    stageSize: 280,
    baseScale: 1,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  };
  elements.avatarCropTitle.textContent = role === "user" ? "选择我的头像区域" : "选择 Codex 头像区域";
  elements.avatarCropZoom.value = "1";
  elements.avatarCropInfo.textContent = file.size > 8 * 1024 * 1024
    ? "原图超过 8 MB，保存时会自动压缩。拖动图片选择显示区域。"
    : "拖动图片选择显示区域；可以缩放后裁剪。";
  elements.avatarCropImage.onload = () => {
    const crop = state.avatarCrop;
    if (!crop || crop.objectUrl !== objectUrl) return;
    elements.avatarCropDialog.showModal();
    crop.image = elements.avatarCropImage;
    crop.stageSize = elements.avatarCropStage.clientWidth || 280;
    crop.baseScale = Math.max(crop.stageSize / crop.image.naturalWidth, crop.stageSize / crop.image.naturalHeight);
    crop.zoom = 1;
    crop.offsetX = (crop.stageSize - crop.image.naturalWidth * crop.baseScale) / 2;
    crop.offsetY = (crop.stageSize - crop.image.naturalHeight * crop.baseScale) / 2;
    applyAvatarCropTransform();
  };
  elements.avatarCropImage.onerror = () => {
    cleanupAvatarCrop();
    showToast("无法读取这张图片");
  };
  elements.avatarCropImage.src = objectUrl;
}

function setAvatarCropZoom(value) {
  const crop = state.avatarCrop;
  if (!crop?.image) return;
  const nextZoom = Math.max(1, Math.min(4, Number(value) || 1));
  const oldWidth = crop.image.naturalWidth * crop.baseScale * crop.zoom;
  const oldHeight = crop.image.naturalHeight * crop.baseScale * crop.zoom;
  const centerX = (crop.stageSize / 2 - crop.offsetX) / oldWidth;
  const centerY = (crop.stageSize / 2 - crop.offsetY) / oldHeight;
  crop.zoom = nextZoom;
  const nextWidth = crop.image.naturalWidth * crop.baseScale * crop.zoom;
  const nextHeight = crop.image.naturalHeight * crop.baseScale * crop.zoom;
  crop.offsetX = crop.stageSize / 2 - centerX * nextWidth;
  crop.offsetY = crop.stageSize / 2 - centerY * nextHeight;
  applyAvatarCropTransform();
}

function saveAvatarCrop() {
  const crop = state.avatarCrop;
  if (!crop?.image) return;
  const renderedScale = crop.baseScale * crop.zoom;
  const sourceSize = Math.min(crop.stageSize / renderedScale, crop.image.naturalWidth, crop.image.naturalHeight);
  const sourceX = Math.max(0, Math.min(crop.image.naturalWidth - sourceSize, -crop.offsetX / renderedScale));
  const sourceY = Math.max(0, Math.min(crop.image.naturalHeight - sourceSize, -crop.offsetY / renderedScale));
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(crop.image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.84);
  if (crop.role === "user") state.identity.userAvatar = dataUrl;
  else state.identity.codexAvatar = dataUrl;
  saveIdentity();
  refreshIdentityUi({ rerender: true });
  const compressed = crop.file.size > 8 * 1024 * 1024;
  elements.avatarCropDialog.close();
  showToast(compressed ? "头像已自动压缩并更新" : "头像已更新");
}

function setupIdentity() {
  const defaults = { codexName: "Codex", userName: "我", codexAvatar: "", userAvatar: "" };
  try {
    const saved = JSON.parse(localStorage.getItem(IDENTITY_KEY) || "null");
    if (saved && typeof saved === "object") {
      state.identity = {
        codexName: normalizeDisplayName(saved.codexName, defaults.codexName),
        userName: normalizeDisplayName(saved.userName, defaults.userName),
        codexAvatar: typeof saved.codexAvatar === "string" ? saved.codexAvatar : "",
        userAvatar: typeof saved.userAvatar === "string" ? saved.userAvatar : "",
      };
    }
  } catch {}
  refreshIdentityUi();

  elements.codexNameInput.addEventListener("input", () => {
    updateIdentityDraft("codexName", elements.codexNameInput.value);
  });
  elements.userNameInput.addEventListener("input", () => {
    updateIdentityDraft("userName", elements.userNameInput.value);
  });
  for (const input of [elements.codexNameInput, elements.userNameInput]) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault();
        commitIdentityNames();
      }
    });
  }
  elements.saveIdentityButton.addEventListener("click", commitIdentityNames);
  elements.codexAvatarButton.addEventListener("click", () => elements.codexAvatarFile.click());
  elements.userAvatarButton.addEventListener("click", () => elements.userAvatarFile.click());
  elements.codexAvatarFile.addEventListener("change", () => {
    const file = elements.codexAvatarFile.files?.[0];
    if (file) openAvatarCrop(file, "codex");
    elements.codexAvatarFile.value = "";
  });
  elements.userAvatarFile.addEventListener("change", () => {
    const file = elements.userAvatarFile.files?.[0];
    if (file) openAvatarCrop(file, "user");
    elements.userAvatarFile.value = "";
  });
  elements.resetIdentityButton.addEventListener("click", () => {
    state.identity = defaults;
    try { localStorage.removeItem(IDENTITY_KEY); } catch {}
    refreshIdentityUi({ rerender: true });
    showToast("名字和头像已恢复默认");
  });
}

function setupAvatarCrop() {
  if (!elements.avatarCropDialog) return;
  elements.closeAvatarCropButton.addEventListener("click", () => elements.avatarCropDialog.close());
  elements.cancelAvatarCropButton.addEventListener("click", () => elements.avatarCropDialog.close());
  elements.avatarCropDialog.addEventListener("close", cleanupAvatarCrop);
  elements.saveAvatarCropButton.addEventListener("click", saveAvatarCrop);
  elements.avatarCropZoom.addEventListener("input", () => setAvatarCropZoom(elements.avatarCropZoom.value));

  let drag = null;
  elements.avatarCropStage.addEventListener("pointerdown", (event) => {
    const crop = state.avatarCrop;
    if (!crop?.image) return;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: crop.offsetX,
      offsetY: crop.offsetY,
    };
    elements.avatarCropStage.setPointerCapture(event.pointerId);
  });
  elements.avatarCropStage.addEventListener("pointermove", (event) => {
    const crop = state.avatarCrop;
    if (!drag || !crop || drag.pointerId !== event.pointerId) return;
    crop.offsetX = drag.offsetX + event.clientX - drag.startX;
    crop.offsetY = drag.offsetY + event.clientY - drag.startY;
    applyAvatarCropTransform();
  });
  const stopDrag = (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag = null;
    if (elements.avatarCropStage.hasPointerCapture(event.pointerId)) {
      elements.avatarCropStage.releasePointerCapture(event.pointerId);
    }
  };
  elements.avatarCropStage.addEventListener("pointerup", stopDrag);
  elements.avatarCropStage.addEventListener("pointercancel", stopDrag);
}

function updateNotificationControls() {
  const settings = state.notifications;
  if (elements.notificationsEnabled) elements.notificationsEnabled.checked = settings.enabled;
  if (elements.notifyCompletion) {
    elements.notifyCompletion.checked = settings.completion;
    elements.notifyCompletion.disabled = !settings.enabled;
  }
  if (elements.notifyApproval) {
    elements.notifyApproval.checked = settings.approval;
    elements.notifyApproval.disabled = !settings.enabled;
  }
  if (elements.notificationSummary) {
    elements.notificationSummary.textContent = settings.enabled
      ? [settings.completion ? "完成" : "", settings.approval ? "审核" : ""].filter(Boolean).join(" / ") || "已开启"
      : "已关闭";
  }
}

function saveNotificationSettingsLocally() {
  try {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(state.notifications));
  } catch {}
}

function readNotificationSettings() {
  const bridge = window.CodexPocketNative;
  if (bridge && typeof bridge.getNotificationSettings === "function") {
    try {
      const native = JSON.parse(bridge.getNotificationSettings());
      return {
        enabled: native.enabled !== false,
        completion: native.completion !== false,
        approval: native.approval !== false,
        permissionGranted: native.permissionGranted !== false,
        native: true,
      };
    } catch {}
  }
  try {
    const saved = JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || "null");
    if (saved && typeof saved === "object") {
      return {
        enabled: saved.enabled !== false,
        completion: saved.completion !== false,
        approval: saved.approval !== false,
        permissionGranted: "Notification" in window && Notification.permission === "granted",
        native: false,
      };
    }
  } catch {}
  return {
    enabled: true,
    completion: true,
    approval: true,
    permissionGranted: "Notification" in window && Notification.permission === "granted",
    native: Boolean(bridge),
  };
}

async function applyNotificationSettings({ userInitiated = false } = {}) {
  const settings = state.notifications;
  saveNotificationSettingsLocally();
  updateNotificationControls();
  const bridge = window.CodexPocketNative;
  if (bridge && typeof bridge.configureNotifications === "function") {
    if (userInitiated && settings.enabled && typeof bridge.requestNotificationPermission === "function") {
      bridge.requestNotificationPermission();
    }
    const granted = bridge.configureNotifications(Boolean(settings.enabled), Boolean(settings.completion), Boolean(settings.approval));
    if (elements.notificationStatus) {
      elements.notificationStatus.classList.toggle("error", settings.enabled && !granted);
      elements.notificationStatus.textContent = !settings.enabled
        ? "后台通知已关闭"
        : granted
          ? "后台通知已开启"
          : "请在 Android 系统设置中允许口袋发送通知";
    }
    return;
  }

  if (settings.enabled && "Notification" in window) {
    if (userInitiated && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch {}
    }
    if (elements.notificationStatus) {
      const granted = Notification.permission === "granted";
      elements.notificationStatus.classList.toggle("error", !granted);
      elements.notificationStatus.textContent = granted
        ? "已开启；网页关闭后无法保证后台提醒"
        : "请在浏览器设置中允许通知";
    }
  } else if (elements.notificationStatus) {
    elements.notificationStatus.classList.remove("error");
    elements.notificationStatus.textContent = "后台通知已关闭";
  }
}

function absoluteAppUrl(url) {
  if (!url) return "";
  try {
    return new URL(String(url), window.location.href).href;
  } catch {
    return String(url);
  }
}
function conversationFilesKey() {
  const computer = currentComputer();
  if (!state.active?.id) return "";
  return `${CONVERSATION_FILES_KEY}:${computer.id || "computer"}:${state.active.id}`;
}

function readConversationFiles() {
  const key = conversationFilesKey();
  if (!key) return [];
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeConversationFiles(items) {
  const key = conversationFilesKey();
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(items.slice(0, 80)));
  } catch {}
}

function conversationFileMetadata(url, kind = "") {
  let parsed;
  try { parsed = new URL(url); } catch { return null; }
  const pathName = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).pop() || "");
  const extension = pathName.match(/\.([a-z0-9]{2,8})$/i)?.[1]?.toLowerCase() || "";
  const detected = /^(png|jpe?g|gif|webp|svg|bmp)$/i.test(extension)
    ? "image"
    : extension ? "file" : "link";
  const type = kind && kind !== "link" ? kind : detected;
  return { parsed, pathName, extension, type };
}

function recordConversationFile(url, title = "", kind = "", extra = {}) {
  url = absoluteAppUrl(url);
  if (!url || !state.active?.id) return null;
  const metadata = conversationFileMetadata(url, kind);
  if (!metadata) return null;
  const { parsed, pathName } = metadata;
  const fallbackTitle = pathName || parsed.hostname || url;
  const items = readConversationFiles();
  const existing = items.findIndex((item) => item.url === url);
  const previous = existing >= 0 ? items.splice(existing, 1)[0] : null;
  const entry = {
    ...(previous || {}),
    id: previous?.id || crypto.randomUUID(),
    url,
    title: String(title || previous?.title || fallbackTitle).trim().slice(0, 160),
    type: metadata.type,
    host: parsed.hostname,
    openedAt: Date.now(),
    openCount: (previous?.openCount || 0) + 1,
    ...extra,
  };
  items.unshift(entry);
  writeConversationFiles(items);
  if (state.drawerTab === "files") renderConversationFiles().catch(() => {});
  return entry;
}

function updateConversationFile(url, patch) {
  const items = readConversationFiles();
  const item = items.find((entry) => entry.url === url);
  if (!item) return false;
  Object.assign(item, patch);
  writeConversationFiles(items);
  if (state.drawerTab === "files") renderConversationFiles().catch(() => {});
  return true;
}

function conversationFileTypeLabel(type) {
  return type === "image" ? "图片" : type === "video" ? "视频" : type === "audio" ? "音频" : type === "file" ? "文件" : "链接";
}

function conversationFileName(url, title = "", fileName = "") {
  const metadata = conversationFileMetadata(url);
  const candidate = fileName || title || metadata?.pathName || "codex-download";
  return String(candidate).replace(/[\\/:*?"<>|]/g, "_").slice(0, 160) || "codex-download";
}

function conversationFileMimeType(fileName) {
  const extension = String(fileName || "").split(".").pop()?.toLowerCase();
  return ({
    mp4: "video/mp4",
    mov: "video/quicktime",
    m4v: "video/x-m4v",
    webm: "video/webm",
    mkv: "video/x-matroska",
    mp3: "audio/mpeg",
    m4a: "audio/mp4",
    wav: "audio/wav",
    ogg: "audio/ogg",
    opus: "audio/ogg",
    flac: "audio/flac",
    aac: "audio/aac",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
    zip: "application/zip",
    apk: "application/vnd.android.package-archive",
    txt: "text/plain",
    csv: "text/csv",
    json: "application/json",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  })[extension] || "application/octet-stream";
}

function recordConversationDownload(url, title, downloadId, fileName, mimeType, status = "downloading") {
  url = absoluteAppUrl(url);
  const metadata = conversationFileMetadata(url, "file");
  if (!metadata) return null;
  const items = readConversationFiles();
  const localId = `download-${downloadId}`;
  const existing = items.findIndex((item) => item.id === localId);
  const previous = existing >= 0 ? items.splice(existing, 1)[0] : null;
  const entry = {
    ...(previous || {}),
    id: localId,
    downloadId: String(downloadId),
    url,
    title: String(title || previous?.title || fileName || metadata.pathName || url).trim().slice(0, 160),
    type: "file",
    host: metadata.parsed.hostname,
    fileName,
    mimeType,
    status,
    openedAt: Date.now(),
    openCount: previous?.openCount || 0,
  };
  items.unshift(entry);
  writeConversationFiles(items);
  if (state.drawerTab === "files") renderConversationFiles().catch(() => {});
  return entry;
}

async function downloadConversationFile(url, title = "", preferredFileName = "") {
  url = absoluteAppUrl(url);
  const fileName = conversationFileName(url, title, preferredFileName);
  const mimeType = conversationFileMimeType(fileName);
  const bridge = window.CodexPocketNative;
  if (bridge && typeof bridge.downloadFile === "function") {
    const id = bridge.downloadFile(url, fileName, mimeType);
    if (!id) {
      showToast("文件下载未能启动");
      return false;
    }
    recordConversationDownload(url, title, String(id), fileName, mimeType, "downloading");
    showToast("正在下载到手机，完成后可直接打开");
    return true;
  }
  const externalId = `external-${Date.now()}`;
  recordConversationDownload(url, title, externalId, fileName, mimeType, "external");
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  return true;
}

async function openConversationFile(item) {
  const bridge = window.CodexPocketNative;
  if (item.type === "file" && item.downloadId && bridge && typeof bridge.openDownload === "function") {
    openLocalDownload(item.downloadId, item.mimeType || native?.mimeType || "");
    return;
  }
  if (item.type === "file") {
    await downloadConversationFile(item.url, item.title, item.fileName || "");
    return;
  }
  recordConversationFile(item.url, item.title, item.type);
  const link = document.createElement("a");
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.append(link);
  link.click();
  link.remove();
}

function handleConversationFileLink(event, url, title = "") {
  const metadata = conversationFileMetadata(url);
  const bridge = window.CodexPocketNative;
  if (metadata?.type === "file" && bridge && typeof bridge.downloadFile === "function") {
    event.preventDefault();
    downloadConversationFile(url, title).catch((error) => showToast(error.message || "文件下载失败"));
    return;
  }
  recordConversationFile(url, title, metadata?.type);
}

function cleanDisplayFileName(value) {
  const text = String(value || "").trim();
  return text.replace(/^下载(?:\s*[·_\-—:：]*\s*)/, "").trim() || text;
}

function formatDownloadSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(value < 10 * 1024 ? 1 : 0)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(value < 10 * 1024 * 1024 ? 1 : 0)} MB`;
  return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function appendConversationHistorySection(list, title, help) {
  const heading = document.createElement("div");
  heading.className = "download-section-head";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const small = document.createElement("small");
  small.textContent = help;
  heading.append(strong, small);
  list.append(heading);
}

async function renderConversationFiles() {
  const list = elements.conversationFileList;
  if (!list) return;
  list.innerHTML = "";
  if (!state.active?.id) {
    const empty = document.createElement("p");
    empty.className = "download-empty";
    empty.textContent = "请先选择一条对话";
    list.append(empty);
    return;
  }
  const allItems = readConversationFiles();
  const nativeItems = await getDownloadHistoryItems().catch(() => []);
  const nativeById = new Map(nativeItems.map((entry) => [String(entry.id), entry]));
  const nativeByUrl = new Map(nativeItems.filter((entry) => entry.url).map((entry) => [entry.url, entry]));
  const downloads = [];
  const visits = [];
  let migrated = false;
  for (const item of allItems) {
    if (item.type !== "file") {
      visits.push(item);
      continue;
    }
    const native = item.downloadId ? nativeById.get(String(item.downloadId)) : nativeByUrl.get(item.url);
    if (native && !item.downloadId) {
      item.downloadId = String(native.id);
      item.status = native.status || item.status;
      item.fileName = item.fileName || native.fileName;
      item.mimeType = item.mimeType || native.mimeType;
      migrated = true;
    }
    downloads.push({ item, native });
  }
  if (migrated) writeConversationFiles(allItems);
  if (!downloads.length && !visits.length) {
    const empty = document.createElement("p");
    empty.className = "download-empty";
    empty.textContent = "当前对话还没有文件或访问记录";
    list.append(empty);
    return;
  }

  const bridge = window.CodexPocketNative;
  if (downloads.length) {
    appendConversationHistorySection(list, "文件记录", "点击已完成的文件可直接打开本机文件；移除记录不会删除文件");
    for (const { item, native } of downloads) {
      const card = document.createElement("div");
      card.className = "download-item conversation-file-item";
      const main = document.createElement("div");
      main.className = "download-item-main";
      const title = document.createElement("strong");
      title.textContent = cleanDisplayFileName(native?.fileName || item.fileName || item.title || item.url);
      const meta = document.createElement("small");
      const size = formatDownloadSize(native?.totalBytes || native?.receivedBytes || item.totalBytes);
      meta.textContent = [item.host || "", formatSessionTime(new Date(item.openedAt).toISOString()), size].filter(Boolean).join(" · ");
      const fileStatus = native?.status || item.status || "unknown";
      const canOpenLocal = Boolean(native?.canOpen);
      const status = document.createElement("span");
      status.className = `download-status ${canOpenLocal ? "completed" : fileStatus}`;
      status.textContent = canOpenLocal ? "已完成" : downloadStatusLabel(fileStatus);
      main.append(title, meta, status);
      card.append(main);
      const actions = document.createElement("div");
      actions.className = "download-item-actions";
      const open = document.createElement("button");
      open.type = "button";
      open.className = "primary";
      open.textContent = canOpenLocal
        ? "打开文件"
        : fileStatus === "downloading"
          ? "保存中…"
          : fileStatus === "failed" || fileStatus === "removed"
            ? "重新保存"
            : "保存到手机";
      open.disabled = fileStatus === "downloading" && !canOpenLocal;
      open.addEventListener("click", async () => {
        if (canOpenLocal && bridge && typeof bridge.openDownload === "function") {
          openLocalDownload(item.downloadId, item.mimeType || native?.mimeType || "");
        } else {
          await downloadConversationFile(item.url, item.title, item.fileName || "");
        }
        if (state.drawerTab === "files") renderConversationFiles().catch(() => {});
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "移除记录";
      remove.addEventListener("click", () => {
        if (item.downloadId && bridge && typeof bridge.removeDownload === "function") bridge.removeDownload(String(item.downloadId));
        writeConversationFiles(readConversationFiles().filter((entry) => entry.id !== item.id));
        renderConversationFiles().catch(() => {});
      });
      actions.append(open, remove);
      card.append(actions);
      list.append(card);
    }
  }

  if (visits.length) {
    appendConversationHistorySection(list, "最近访问", "网页和图片仅保留最近打开记录");
    for (const item of visits) {
      const card = document.createElement("div");
      card.className = "download-item conversation-file-item";
      const main = document.createElement("div");
      main.className = "download-item-main";
      const title = document.createElement("strong");
      title.textContent = item.title || item.url;
      const meta = document.createElement("small");
      meta.textContent = `${conversationFileTypeLabel(item.type)} · ${item.host || ""} · ${formatSessionTime(new Date(item.openedAt).toISOString())} · 打开 ${item.openCount || 1} 次`;
      const status = document.createElement("span");
      status.className = "download-status completed";
      status.textContent = "已访问";
      main.append(title, meta, status);
      card.append(main);
      const actions = document.createElement("div");
      actions.className = "download-item-actions";
      const open = document.createElement("button");
      open.type = "button";
      open.className = "primary";
      open.textContent = item.type === "image" ? "查看图片" : "打开链接";
      open.addEventListener("click", () => openConversationFile(item));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "移除记录";
      remove.addEventListener("click", () => {
        writeConversationFiles(readConversationFiles().filter((entry) => entry.id !== item.id));
        renderConversationFiles().catch(() => {});
      });
      actions.append(open, remove);
      card.append(actions);
      list.append(card);
    }
  }
}

function readBrowserDownloadHistory() {
  try {
    const items = JSON.parse(localStorage.getItem(DOWNLOAD_HISTORY_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeBrowserDownloadHistory(items) {
  try {
    localStorage.setItem(DOWNLOAD_HISTORY_KEY, JSON.stringify(items.slice(0, 30)));
  } catch {}
}

function recordBrowserDownload(url, fileName) {
  const items = readBrowserDownloadHistory();
  items.unshift({
    id: `browser-${Date.now()}`,
    url,
    fileName,
    createdAt: Date.now(),
    status: "external",
  });
  writeBrowserDownloadHistory(items);
}

function downloadStatusLabel(status) {
  return ({
    downloading: "正在下载",
    completed: "已完成",
    failed: "保存失败",
    paused: "已暂停",
    removed: "文件已移除",
    external: "浏览器保存",
    unknown: "状态未知",
  })[status] || "状态未知";
}

function getDownloadVersion(fileName) {
  return String(fileName || "").match(/v?(\d+\.\d+\.\d+)/i)?.[1] || "";
}

function openLocalDownload(id, mimeType = "") {
  const bridge = window.CodexPocketNative;
  if (!bridge) return;
  if (typeof bridge.openDownloadWithType === "function") {
    bridge.openDownloadWithType(String(id), String(mimeType || ""));
  } else if (typeof bridge.openDownload === "function") {
    bridge.openDownload(String(id));
  }
}

async function getDownloadHistoryItems() {
  const bridge = window.CodexPocketNative;
  if (bridge && typeof bridge.getDownloadHistory === "function") {
    try {
      const items = JSON.parse(bridge.getDownloadHistory());
      if (Array.isArray(items)) return items;
    } catch {}
  }
  return readBrowserDownloadHistory();
}

function openDownloadConfirmation(url, fileName) {
  state.pendingDownloadUrl = url || elements.downloadApkLink?.href || "";
  state.pendingDownloadName = fileName || elements.downloadApkLink?.getAttribute("download") || "codex-pocket.apk";
  elements.downloadConfirmDialog.showModal();
}

async function renderDownloadHistory() {
  if (!elements.downloadHistoryList) return;
  const items = await getDownloadHistoryItems();
  elements.downloadHistoryList.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "download-empty";
    empty.textContent = "还没有文件记录";
    elements.downloadHistoryList.append(empty);
    return;
  }
  const bridge = window.CodexPocketNative;
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "download-item";
    const main = document.createElement("div");
    main.className = "download-item-main";
    const title = document.createElement("strong");
    title.textContent = cleanDisplayFileName(item.fileName || "口袋文件");
    const version = getDownloadVersion(item.fileName);
    const meta = document.createElement("small");
    const created = Number(item.createdAt) || Date.now();
    meta.textContent = [version ? `v${version}` : "", formatSessionTime(new Date(created).toISOString())].filter(Boolean).join(" · ");
    main.append(title, meta);
    const status = document.createElement("span");
    status.className = `download-status ${item.status || "unknown"}`;
    status.textContent = downloadStatusLabel(item.status);
    main.append(status);
    card.append(main);

    const actions = document.createElement("div");
    actions.className = "download-item-actions";
    if (item.canOpen && bridge && typeof bridge.openDownload === "function") {
      const install = document.createElement("button");
      install.type = "button";
      install.className = "primary";
      install.textContent = "打开安装";
      install.addEventListener("click", () => openLocalDownload(item.id, item.mimeType || ""));
      actions.append(install);
    }
    const again = document.createElement("button");
    again.type = "button";
    again.textContent = item.status === "completed" ? "重新保存" : "继续/重试";
    again.addEventListener("click", () => openDownloadConfirmation(item.url, item.fileName));
    actions.append(again);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "移除记录";
    remove.addEventListener("click", async () => {
      if (bridge && typeof bridge.removeDownload === "function") bridge.removeDownload(String(item.id));
      else writeBrowserDownloadHistory(readBrowserDownloadHistory().filter((entry) => String(entry.id) !== String(item.id)));
      await renderDownloadHistory();
    });
    actions.append(remove);
    card.append(actions);
    elements.downloadHistoryList.append(card);
  }
}

async function performDownload(url, fileName) {
  url = absoluteAppUrl(url);
  const bridge = window.CodexPocketNative;
  if (bridge && typeof bridge.downloadFile === "function") {
    const id = bridge.downloadFile(url, fileName, "application/vnd.android.package-archive");
    if (!id) showToast("下载未能启动");
    window.setTimeout(() => renderDownloadHistory().catch(() => {}), 400);
    return;
  }
  if (bridge && typeof bridge.downloadApk === "function") {
    const id = bridge.downloadApk(url);
    if (!id) showToast("下载未能启动");
    window.setTimeout(() => renderDownloadHistory().catch(() => {}), 400);
    return;
  }
  recordBrowserDownload(url, fileName);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  await renderDownloadHistory();
}

function sendBrowserNotification(kind, title, body) {
  if (window.CodexPocketNative) return;
  if (!("Notification" in window) || !document.hidden || !state.notifications.enabled || Notification.permission !== "granted") return;
  if (kind === "completion" && !state.notifications.completion) return;
  if (kind === "approval" && !state.notifications.approval) return;
  try {
    new Notification(title, { body, icon: "/icon-192.png", tag: kind === "approval" ? "codex-approval" : "codex-complete" });
  } catch {}
}

function composerAgentId() {
  return state.active?.agentId || state.selectedAgentId || "codex";
}

function currentModelDisplayName() {
  if (!state.selectedModel) return composerAgentId() === "workbuddy" ? "WorkBuddy 默认" : "电脑默认";
  return state.models.find((model) => model.id === state.selectedModel)?.displayName || state.selectedModel;
}

function modelPreferenceKey(agentId = composerAgentId()) {
  return `${MODEL_KEY}:${agentId || "codex"}`;
}

function setSelectedModel(value, { notify = false } = {}) {
  state.selectedModel = String(value || "");
  try {
    const key = modelPreferenceKey();
    if (state.selectedModel) localStorage.setItem(key, state.selectedModel);
    else localStorage.removeItem(key);
  } catch {}
  updateModelUi();
  if (elements.modelStatus) {
    elements.modelStatus.classList.remove("error");
    elements.modelStatus.textContent = `后续消息将使用：${currentModelDisplayName()}`;
  }
  if (notify) showToast(`已切换模型：${currentModelDisplayName()}`);
}

function renderQuickModelOptions() {
  if (!elements.quickModelOptions) return;
  elements.quickModelOptions.innerHTML = "";
  const choices = [{ id: "", displayName: composerAgentId() === "workbuddy" ? "WorkBuddy 默认" : "电脑默认", isDefault: false }, ...state.models];
  for (const model of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.modelId = model.id;
    button.classList.toggle("active", state.selectedModel === model.id);
    button.textContent = `${model.displayName || model.id}${model.isDefault ? " · 默认" : ""}`;
    button.addEventListener("click", () => setSelectedModel(model.id, { notify: true }));
    elements.quickModelOptions.append(button);
  }
}

function updateModelUi() {
  if (elements.modelSummary) elements.modelSummary.textContent = currentModelDisplayName();
  if (elements.modelSelect) elements.modelSelect.value = state.selectedModel;
  renderQuickModelOptions();
  const selected = state.models.find((model) => model.id === state.selectedModel);
  if (elements.modelHelp) {
    elements.modelHelp.textContent = selected?.description
      || (state.selectedModel ? "后续消息将使用所选模型。" : `使用 ${agentNameById(composerAgentId())} 的默认模型。`);
  }
}

async function loadAvailableModels({ force = false } = {}) {
  if (!state.token) return;
  const requestAgentId = composerAgentId();
  if (elements.modelStatus) {
    elements.modelStatus.classList.remove("error");
    elements.modelStatus.textContent = "正在读取电脑上的模型…";
  }
  try {
    const query = new URLSearchParams({ agentId: requestAgentId });
    if (force) query.set("refresh", "1");
    const data = await api(`/api/models?${query.toString()}`);
    if (composerAgentId() !== requestAgentId) return;
    state.models = Array.isArray(data.models) ? data.models : [];
    state.modelsAgentId = requestAgentId;
    if (elements.modelSelect) {
      elements.modelSelect.innerHTML = "";
      const fallback = document.createElement("option");
      fallback.value = "";
      fallback.textContent = requestAgentId === "workbuddy" ? "跟随 WorkBuddy 默认" : "跟随电脑默认";
      elements.modelSelect.append(fallback);
      for (const model of state.models) {
        const option = document.createElement("option");
        option.value = model.id;
        option.textContent = `${model.displayName || model.id}${model.isDefault ? "（默认）" : ""}`;
        option.title = model.description || model.id;
        elements.modelSelect.append(option);
      }
    }
    try { state.selectedModel = localStorage.getItem(modelPreferenceKey(requestAgentId)) || ""; } catch { state.selectedModel = ""; }
    if (state.selectedModel && !state.models.some((model) => model.id === state.selectedModel)) {
      state.selectedModel = "";
    }
    updateModelUi();
    if (elements.modelStatus) elements.modelStatus.textContent = `已加载 ${state.models.length} 个模型`;
  } catch (error) {
    if (composerAgentId() !== requestAgentId) return;
    state.models = [];
    state.modelsAgentId = requestAgentId;
    state.selectedModel = "";
    updateModelUi();
    if (elements.modelStatus) {
      elements.modelStatus.classList.add("error");
      elements.modelStatus.textContent = error.message;
    }
  }
}

function setupModelPicker() {
  if (!elements.modelSelect) return;
  try {
    const legacy = localStorage.getItem(MODEL_KEY);
    if (legacy && !localStorage.getItem(modelPreferenceKey())) localStorage.setItem(modelPreferenceKey(), legacy);
    state.selectedModel = localStorage.getItem(modelPreferenceKey()) || "";
  } catch {}
  updateModelUi();
  elements.modelSelect.addEventListener("change", () => setSelectedModel(elements.modelSelect.value, { notify: true }));
}

const APPROVAL_POLICIES = new Set(["on-request", "untrusted", "never"]);

function updateApprovalPolicyUi() {
  if (!elements.approvalPolicyOptions) return;
  for (const button of elements.approvalPolicyOptions.querySelectorAll("[data-approval-policy]")) {
    button.classList.toggle("active", button.dataset.approvalPolicy === state.approvalPolicy);
  }
}

function setupApprovalPolicy() {
  try {
    const saved = localStorage.getItem(APPROVAL_KEY) || "on-request";
    state.approvalPolicy = APPROVAL_POLICIES.has(saved) ? saved : "on-request";
  } catch {
    state.approvalPolicy = "on-request";
  }
  elements.approvalPolicyOptions?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-approval-policy]");
    if (!button) return;
    const value = button.dataset.approvalPolicy;
    if (!APPROVAL_POLICIES.has(value)) return;
    state.approvalPolicy = value;
    try { localStorage.setItem(APPROVAL_KEY, value); } catch {}
    updateApprovalPolicyUi();
    const labels = { "on-request": "按需审批", untrusted: "仅信任操作", never: "不请求审批" };
    showToast(`审批规则：${labels[value] || value}`);
  });
  updateApprovalPolicyUi();
}

function setupNotificationSettings() {
  const saved = readNotificationSettings();
  state.notifications = {
    enabled: saved.enabled && saved.permissionGranted,
    completion: saved.completion,
    approval: saved.approval,
  };
  updateNotificationControls();
  applyNotificationSettings();
  const update = () => {
    state.notifications = {
      enabled: Boolean(elements.notificationsEnabled?.checked),
      completion: Boolean(elements.notifyCompletion?.checked),
      approval: Boolean(elements.notifyApproval?.checked),
    };
    applyNotificationSettings({ userInitiated: true });
  };
  elements.notificationsEnabled?.addEventListener("change", update);
  elements.notifyCompletion?.addEventListener("change", update);
  elements.notifyApproval?.addEventListener("change", update);
}

function setupNativeTextInput() {
  document.addEventListener("focusin", (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.type !== "text") return;
    const nativeBridge = window.CodexPocketNative;
    if (nativeBridge && typeof nativeBridge.showKeyboard === "function") {
      nativeBridge.showKeyboard();
    }
  });
}
const DRAWER_TITLES = { chats: "对话", computers: "电脑", projects: "项目", settings: "设置", files: "文件" };

function setDrawerTab(tab) {
  const next = DRAWER_TITLES[tab] ? tab : "chats";
  state.drawerTab = next;
  if (elements.drawerTitle) elements.drawerTitle.textContent = DRAWER_TITLES[next];
  for (const button of document.querySelectorAll("[data-drawer-tab]")) {
    const active = button.dataset.drawerTab === next;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  }
  for (const panel of document.querySelectorAll("[data-drawer-panel]")) {
    const active = panel.dataset.drawerPanel === next;
    panel.hidden = !active;
    panel.setAttribute("aria-hidden", String(!active));
  }
  if (next === "computers") refreshComputerProfiles();
  if (next === "files") renderConversationFiles().catch(() => {});
}

function setupDrawerNavigation() {
  const tabs = [...document.querySelectorAll("[data-drawer-tab]")];
  for (const [index, button] of tabs.entries()) {
    button.addEventListener("click", () => {
      setDrawerTab(button.dataset.drawerTab);
      if (!wideDrawerMedia.matches) openDrawer();
    });
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      const nextTab = tabs[nextIndex];
      setDrawerTab(nextTab.dataset.drawerTab);
      nextTab.focus();
    });
  }
  elements.conversationSearch.addEventListener("input", () => {
    state.searchQuery = elements.conversationSearch.value.trim().toLocaleLowerCase("zh-CN");
    renderConversationList();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !wideDrawerMedia.matches && elements.drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
  setDrawerTab(state.drawerTab);
  const syncResponsiveDrawer = () => {
    if (wideDrawerMedia.matches) openDrawer();
    else closeDrawer();
  };
  if (wideDrawerMedia.addEventListener) wideDrawerMedia.addEventListener("change", syncResponsiveDrawer);
  else wideDrawerMedia.addListener(syncResponsiveDrawer);
  syncResponsiveDrawer();
}
function extractToken(value) {
  const input = String(value || "").trim();
  if (!input) return "";
  try {
    if (/^https?:\/\//i.test(input)) {
      const url = new URL(input);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const query = url.searchParams;
      return hash.get("token") || query.get("token") || "";
    }
  } catch {}
  const match = input.match(/[#?&]token=([^&\s]+)/i);
  if (match) return decodeURIComponent(match[1]);
  return input;
}

function extractThreadTicket(value) {
  const input = String(value || "").trim();
  if (!input) return "";
  try {
    if (/^https?:\/\//i.test(input)) {
      const url = new URL(input);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      return hash.get("thread") || hash.get("link") || url.searchParams.get("thread") || "";
    }
  } catch {}
  const match = input.match(/[#?&](?:thread|link)=([A-Za-z0-9_-]{32,64})/i);
  return match ? match[1] : "";
}

function readJsonStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

function trimCacheText(value, maxLength = 20_000) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function cacheEventSnapshot(event) {
  if (!event || !event.type) return null;
  if (event.type === "progress" && ["command", "tool", "web"].includes(event.kind)) return null;
  const copy = { ...event };
  if (copy.text) copy.text = trimCacheText(copy.text);
  if (copy.output) copy.output = trimCacheText(copy.output, 2_000);
  if (copy.detail) copy.detail = trimCacheText(copy.detail, 2_000);
  return copy;
}

function writeCachedBootstrap(data) {
  if (!data) return;
  const snapshot = {
    savedAt: Date.now(),
    data: {
      version: data.version || "",
      computer: data.computer || null,
      projects: Array.isArray(data.projects) ? data.projects : [],
      defaultProjectPath: data.defaultProjectPath || "",
      workdir: data.workdir || "",
      workdirName: data.workdirName || "",
      sandbox: data.sandbox || "",
      transport: data.transport || "",
      conversations: (data.conversations || []).slice(0, 100),
      globalUnread: Math.max(0, Number(data.globalUnread) || 0),
    },
  };
  try { localStorage.setItem(BOOTSTRAP_CACHE_KEY, JSON.stringify(snapshot)); } catch {}
}

function readCachedBootstrap() {
  const cached = readJsonStorage(BOOTSTRAP_CACHE_KEY);
  if (!cached?.data || !cached.savedAt || Date.now() - Number(cached.savedAt) > CACHE_MAX_AGE_MS) return null;
  return cached;
}

function writeCachedConversation() {
  const conversation = state.active;
  if (!conversation?.id) return;
  const events = [...state.events.values()]
    .sort((a, b) => Number(a.seq) - Number(b.seq))
    .map(cacheEventSnapshot)
    .filter(Boolean);
  let limit = Math.min(240, events.length);
  while (true) {
    const snapshot = {
      savedAt: Date.now(),
      conversation: {
        ...conversation,
        events: events.slice(-limit),
        queuedMessages: state.queuedMessages,
      },
    };
    try {
      localStorage.setItem(`${CONVERSATION_CACHE_PREFIX}${conversation.id}`, JSON.stringify(snapshot));
      return;
    } catch {
      if (limit === 0) return;
      limit = limit <= 40 ? 0 : Math.floor(limit / 2);
    }
  }
}

function scheduleConversationCache() {
  clearTimeout(state.cacheSaveTimer);
  state.cacheSaveTimer = setTimeout(writeCachedConversation, 250);
}

function readCachedConversation(id) {
  if (!id) return null;
  const cached = readJsonStorage(`${CONVERSATION_CACHE_PREFIX}${id}`);
  if (!cached?.conversation || !cached.savedAt || Date.now() - Number(cached.savedAt) > CACHE_MAX_AGE_MS) return null;
  const conversation = { ...cached.conversation };
  if (["running", "stopping", "waiting_approval"].includes(conversation.status)) conversation.status = "idle";
  return conversation;
}

function clearCachedAppData() {
  try {
    localStorage.removeItem(BOOTSTRAP_CACHE_KEY);
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(CONVERSATION_CACHE_PREFIX)) localStorage.removeItem(key);
    }
  } catch {}
}

function applyBootstrapSnapshot(data) {
  state.config = data;
  state.computer = data.computer || { id: "", name: "这台电脑" };
  state.conversations = (data.conversations || []).map(scopeConversation);
  state.conversationsStatus = "ready";
  state.conversationsError = "";
  state.globalUnread = Number.isFinite(Number(data.globalUnread)) ? Math.max(0, Number(data.globalUnread)) : null;
  populateAgents(data);
  populateProjects(data);
  updateComputerProfileUi();
  elements.workdirLabel.textContent = computerContextLabel(data.workdirName || "Codex");
  elements.sandboxLabel.textContent = data.sandbox || "workspace-write";
  elements.drawerVersion.textContent = data.version ? `v${data.version}` : "缓存";
  renderConversationList();
  showApp();
  updateControls();
}

function captureTokenFromLocation() {
  const url = new URL(window.location.href);
  const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
  const token = hash.get("token") || url.searchParams.get("token") || "";
  const threadTicket = hash.get("thread") || hash.get("link") || url.searchParams.get("thread") || "";
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (threadTicket) state.pendingThreadTicket = threadTicket;
  if (!token && !threadTicket) return;
  url.hash = "";
  url.searchParams.delete("token");
  url.searchParams.delete("thread");
  history.replaceState(null, "", `${url.pathname}${url.search}`);
}

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${state.token}`);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(path, { ...options, headers, cache: "no-store" });
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    state.token = "";
    showPairing("配对已失效，请重新输入链接或令牌。");
    throw new ApiError("配对已失效", 401);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error || `请求失败（${response.status}）`, response.status);
  state.lastApiSuccessAt = Date.now();
  return data;
}

function showStartupLoading(title = "正在连接电脑", text = "正在验证配对并同步对话列表…") {
  clearTimeout(state.startupLoaderTimer);
  if (!elements.startupLoader) return;
  elements.startupLoader.hidden = false;
  elements.startupLoader.classList.remove("done");
  if (elements.startupLoaderTitle) elements.startupLoaderTitle.textContent = title;
  if (elements.startupLoaderText) elements.startupLoaderText.textContent = text;
}

function hideStartupLoading() {
  if (!elements.startupLoader || elements.startupLoader.hidden) return;
  elements.startupLoader.classList.add("done");
  clearTimeout(state.startupLoaderTimer);
  state.startupLoaderTimer = setTimeout(() => {
    if (elements.startupLoader?.classList.contains("done")) elements.startupLoader.hidden = true;
  }, 220);
}

function showPairing(message = "") {
  hideStartupLoading();
  elements.pairingScreen.classList.remove("hidden");
  elements.pairingStatus.textContent = message;
  elements.appShell.setAttribute("aria-hidden", "true");
  setTimeout(() => elements.pairingInput.focus(), 80);
}

function showApp() {
  elements.pairingScreen.classList.add("hidden");
  elements.pairingStatus.textContent = "";
  elements.appShell.setAttribute("aria-hidden", "false");
}

function setConnection(mode, text) {
  elements.connectionBadge.classList.remove("online", "offline");
  if (mode) elements.connectionBadge.classList.add(mode);
  elements.connectionText.textContent = text;
  elements.infoConnection.textContent = text;
}

function projectBaseName(projectPath) {
  return String(projectPath || "").split(/[\\/]/).filter(Boolean).pop() || "";
}

function currentComputer() {
  return state.computer || state.config?.computer || { id: "", name: "这台电脑" };
}

function scopeConversation(conversation) {
  if (!conversation) return conversation;
  const computer = currentComputer();
  return {
    ...conversation,
    computerId: conversation.computerId || computer.id || "",
    computerName: conversation.computerName || computer.name || "这台电脑",
  };
}

function computerContextLabel(projectName = "") {
  const name = currentComputer().name || "这台电脑";
  return projectName ? `${name} · ${projectName}` : name;
}

function updateComputerProfileUi() {
  const computer = currentComputer();
  const shortId = computer.id ? `ID ${computer.id.slice(0, 8)}` : "";
  for (const element of [elements.projectComputerName, elements.infoComputerName]) {
    if (element) element.textContent = computer.name || "这台电脑";
  }
  for (const element of [elements.projectComputerId, elements.infoComputerId]) {
    if (!element) continue;
    element.textContent = computer.id || "";
    element.title = computer.id ? `电脑标识：${computer.id}` : "";
  }
  if (elements.projectComputerId) elements.projectComputerId.textContent = shortId;
  if (elements.computerNameSummary) elements.computerNameSummary.textContent = computer.name || "电脑";
  if (elements.computerNameInput && document.activeElement !== elements.computerNameInput) {
    elements.computerNameInput.value = computer.customName || "";
  }
  if (elements.computerNameInput) elements.computerNameInput.placeholder = computer.defaultName || "电脑 3EB9";
  if (elements.computerNameHelp) elements.computerNameHelp.textContent = `默认名称：${computer.defaultName || "电脑"}`;
}

function normalizeComputerProfile(profile) {
  if (!profile || typeof profile !== "object") return null;
  const id = String(profile.id || "").trim();
  const url = String(profile.url || "").trim();
  if (!id || !/^https:\/\//i.test(url)) return null;
  return {
    id,
    name: String(profile.name || "电脑").trim().slice(0, 48) || "电脑",
    url,
    lastConnectedAt: Number(profile.lastConnectedAt) || 0,
    active: Boolean(profile.active),
  };
}

function refreshComputerProfiles() {
  const bridge = window.CodexPocketNative;
  if (bridge && typeof bridge.getComputerConnections === "function") {
    try {
      const data = JSON.parse(bridge.getComputerConnections() || "{}");
      const profiles = Array.isArray(data) ? data : data.profiles;
      state.computerProfiles = (Array.isArray(profiles) ? profiles : []).map(normalizeComputerProfile).filter(Boolean);
    } catch {
      state.computerProfiles = [];
    }
  } else {
    const computer = currentComputer();
    state.computerProfiles = computer.id && state.token
      ? [{
          id: computer.id,
          name: computer.name || "这台电脑",
          url: `${location.origin}/#token=${encodeURIComponent(state.token)}`,
          lastConnectedAt: Date.now(),
          active: true,
        }]
      : [];
  }
  renderComputerProfiles();
  return state.computerProfiles;
}

function renderComputerProfiles() {
  if (!elements.computerProfileList) return;
  const activeComputer = currentComputer();
  const profiles = state.computerProfiles
    .map((profile) => ({ ...profile, active: profile.id === activeComputer.id || profile.active }))
    .sort((left, right) => Number(right.active) - Number(left.active) || right.lastConnectedAt - left.lastConnectedAt);
  elements.computerProfileList.innerHTML = "";
  if (!profiles.length) {
    const empty = document.createElement("div");
    empty.className = "drawer-empty-state";
    const title = document.createElement("strong");
    title.textContent = "还没有保存的电脑";
    const copy = document.createElement("p");
    copy.textContent = "扫描电脑端二维码即可添加。安卓版支持在多个已保存电脑之间切换。";
    empty.append(title, copy);
    elements.computerProfileList.append(empty);
    return;
  }
  const bridge = window.CodexPocketNative;
  const canSwitch = bridge && typeof bridge.switchComputerConnection === "function";
  const canDelete = bridge && typeof bridge.deleteComputerConnection === "function";
  for (const profile of profiles) {
    const card = document.createElement("article");
    card.className = "computer-profile-card";
    if (profile.active) card.classList.add("active");
    const mark = document.createElement("span");
    mark.className = "computer-profile-mark";
    mark.textContent = String(profile.id).replace(/[^0-9a-f]/gi, "").slice(-4).toUpperCase() || "PC";
    const copy = document.createElement("div");
    copy.className = "computer-profile-copy";
    const name = document.createElement("strong");
    name.textContent = profile.name;
    const host = document.createElement("small");
    try { host.textContent = new URL(profile.url).hostname; } catch { host.textContent = "连接地址不可用"; }
    copy.append(name, host);
    if (profile.active) {
      const current = document.createElement("span");
      current.className = "computer-profile-current";
      current.textContent = "当前电脑";
      copy.append(current);
    }
    card.append(mark, copy);
    if (canSwitch || canDelete) {
      const actions = document.createElement("div");
      actions.className = "computer-profile-actions";
      const switchButton = document.createElement("button");
      switchButton.type = "button";
      switchButton.className = "computer-profile-switch";
      switchButton.textContent = profile.active ? "已连接" : "切换";
      switchButton.disabled = profile.active || !canSwitch;
      switchButton.addEventListener("click", () => switchComputerProfile(profile));
      actions.append(switchButton);
      if (canDelete) {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "computer-profile-delete";
        deleteButton.textContent = "删除";
        deleteButton.addEventListener("click", () => deleteComputerProfile(profile));
        actions.append(deleteButton);
      }
      card.append(actions);
    }
    elements.computerProfileList.append(card);
  }
}

function switchComputerProfile(profile) {
  const bridge = window.CodexPocketNative;
  if (!bridge || typeof bridge.switchComputerConnection !== "function") {
    if (elements.computerProfilesStatus) elements.computerProfilesStatus.textContent = "浏览器版只能连接当前电脑";
    return;
  }
  if (elements.computerProfilesStatus) elements.computerProfilesStatus.textContent = "正在切换电脑…";
  let switched = false;
  try { switched = bridge.switchComputerConnection(profile.id); } catch {}
  if (!switched && elements.computerProfilesStatus) {
    elements.computerProfilesStatus.textContent = "切换失败，请重新扫码连接";
  }
}

function deleteComputerProfile(profile) {
  const label = profile.name || "这台电脑";
  if (!confirm(`从手机删除“${label}”的连接？\n\n不会删除电脑上的 Codex 数据。`)) return;
  const bridge = window.CodexPocketNative;
  if (!bridge || typeof bridge.deleteComputerConnection !== "function") return;
  let removed = false;
  try { removed = bridge.deleteComputerConnection(profile.id); } catch {}
  if (!removed) {
    if (elements.computerProfilesStatus) elements.computerProfilesStatus.textContent = "删除失败";
    return;
  }
  if (profile.active) {
    try { state.eventSocket?.close(); } catch {}
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    clearCachedAppData();
    location.replace(location.origin);
    return;
  }
  refreshComputerProfiles();
}
function applyComputerProfileUpdate(computer) {
  state.computer = computer;
  if (state.config) state.config.computer = computer;
  state.conversations = state.conversations.map((conversation) => ({
    ...conversation,
    computerId: computer.id || "",
    computerName: computer.name || "电脑",
  }));
  if (state.active) {
    state.active = {
      ...state.active,
      computerId: computer.id || "",
      computerName: computer.name || "电脑",
    };
  }
  updateComputerProfileUi();
  renderConversationList();
  persistNativeConnectionUrl();
  refreshComputerProfiles();
  const projectName = state.active?.workdir
    ? projectBaseName(state.active.workdir)
    : (state.config?.workdirName || "Codex");
  elements.workdirLabel.textContent = computerContextLabel(projectName);
}

async function saveComputerDisplayName(value) {
  const namingInput = elements.computerNameInput;
  const saveButton = elements.saveComputerNameButton;
  const resetButton = elements.resetComputerNameButton;
  const status = elements.computerNameStatus;
  if (saveButton) saveButton.disabled = true;
  if (resetButton) resetButton.disabled = true;
  if (status) {
    status.classList.remove("error");
    status.textContent = "正在保存…";
  }
  try {
    const data = await api("/api/computer", {
      method: "PATCH",
      body: JSON.stringify({ name: String(value || "").trim() }),
    });
    applyComputerProfileUpdate(data.computer);
    if (status) status.textContent = "名称已保存";
    showToast(`电脑名称已更新为：${data.computer.name}`);
    return data.computer;
  } catch (error) {
    if (status) {
      status.textContent = error.message;
      status.classList.add("error");
    }
    if (error.status !== 401) showToast(error.message);
    return null;
  } finally {
    if (saveButton) saveButton.disabled = false;
    if (resetButton) resetButton.disabled = false;
    if (namingInput) namingInput.value = currentComputer().customName || "";
  }
}

function setupComputerProfile() {
  if (!elements.computerNameInput) return;
  elements.saveComputerNameButton.addEventListener("click", () => {
    saveComputerDisplayName(elements.computerNameInput.value);
  });
  elements.resetComputerNameButton.addEventListener("click", () => {
    elements.computerNameInput.value = "";
    saveComputerDisplayName("");
  });
  elements.computerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      saveComputerDisplayName(elements.computerNameInput.value);
    }
  });
}

function computerNamePromptKey(computerId) {
  return `${COMPUTER_NAME_PROMPT_PREFIX}:${computerId}`;
}

function markComputerNamePrompted(computerId) {
  if (!computerId) return;
  try {
    localStorage.setItem(computerNamePromptKey(computerId), "1");
  } catch {}
}

function maybePromptFirstName() {
  clearTimeout(state.computerNamePromptTimer);
  const computer = currentComputer();
  if (!computer.id || !elements.computerNameDialog) return;
  if (computer.customName) {
    markComputerNamePrompted(computer.id);
    return;
  }
  let prompted = false;
  try {
    prompted = localStorage.getItem(computerNamePromptKey(computer.id)) === "1";
  } catch {}
  if (prompted || elements.computerNameDialog.open) return;
  elements.firstComputerNameInput.value = "";
  elements.firstComputerNameInput.placeholder = computer.defaultName || "电脑 3EB9";
  elements.firstComputerNameHelp.textContent = `检测到新电脑。默认名称：${computer.defaultName || "电脑"}，之后可以在“设置 → 当前电脑”中修改。`;
  elements.firstComputerNameStatus.textContent = "";
  state.computerNamePromptTimer = setTimeout(() => {
    if (elements.computerNameDialog.open) return;
    if (elements.appShell.getAttribute("aria-hidden") === "true") return;
    elements.computerNameDialog.showModal();
    setTimeout(() => elements.firstComputerNameInput.focus(), 100);
  }, 180);
}
async function saveFirstNameFromPrompt() {
  const name = elements.firstComputerNameInput.value.trim();
  if (!name) {
    elements.firstComputerNameStatus.textContent = "请输入名称，或选择“暂时使用默认名称”。";
    return;
  }
  elements.saveFirstComputerNameButton.disabled = true;
  elements.skipFirstComputerNameButton.disabled = true;
  elements.firstComputerNameStatus.textContent = "正在保存…";
  try {
    const computer = await saveComputerDisplayName(name);
    if (!computer) {
      elements.firstComputerNameStatus.textContent = "保存失败，请重试。";
      return;
    }
    markComputerNamePrompted(computer.id);
    elements.computerNameDialog.close();
  } finally {
    elements.saveFirstComputerNameButton.disabled = false;
    elements.skipFirstComputerNameButton.disabled = false;
  }
}

function setupComputerNamePrompt() {
  if (!elements.computerNameDialog) return;
  elements.saveFirstComputerNameButton.addEventListener("click", saveFirstNameFromPrompt);
  elements.skipFirstComputerNameButton.addEventListener("click", () => {
    const computer = currentComputer();
    markComputerNamePrompted(computer.id);
    elements.computerNameDialog.close();
    showToast(`将使用默认名称：${computer.defaultName || "电脑"}`);
  });
  elements.firstComputerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      saveFirstNameFromPrompt();
    }
  });
}

function agentNameById(agentId) {
  const agent = state.agents.find((item) => item.id === agentId);
  return agent?.name || (agentId === "workbuddy" ? "WorkBuddy" : "Codex");
}

function populateAgents(config) {
  const previousAgents = state.agents;
  state.agents = Array.isArray(config.agents) ? config.agents : [{ id: "codex", name: "Codex", available: true }];
  let saved = "codex";
  try { saved = localStorage.getItem("codex-pocket-agent") || "codex"; } catch {}
  const preferred = (previousAgents.length ? state.agents.find((agent) => agent.id === state.selectedAgentId && agent.available) : null)
    || state.agents.find((agent) => agent.id === saved && agent.available)
    || state.agents.find((agent) => agent.available)
    || state.agents[0];
  state.selectedAgentId = preferred?.id || "codex";
  if (elements.agentSelect) {
    elements.agentSelect.innerHTML = "";
    for (const agent of state.agents) {
      const option = document.createElement("option");
      option.value = agent.id;
      option.textContent = `${agent.name || agent.id}${agent.available ? "" : "（未运行）"}`;
      option.disabled = !agent.available;
      elements.agentSelect.append(option);
    }
    elements.agentSelect.value = state.selectedAgentId;
    elements.agentSelect.disabled = state.agents.filter((agent) => agent.available).length < 2;
  }
}

async function refreshAgentAvailability() {
  if (!state.token) return;
  try {
    const data = await api("/api/agents");
    const previousAgentId = state.selectedAgentId;
    populateAgents(data);
    if (previousAgentId !== state.selectedAgentId) {
      state.models = [];
      state.selectedModel = "";
      updateModelUi();
      await loadAvailableModels();
    }
  } catch {}
}

function populateProjects(config) {
  state.projects = Array.isArray(config.projects) ? config.projects : [];
  const saved = localStorage.getItem("codex-pocket-project");
  const preferred = state.projects.find((project) => project.path === saved && project.exists)
    || state.projects.find((project) => project.path === config.defaultProjectPath && project.exists)
    || state.projects.find((project) => project.exists)
    || state.projects[0];
  state.selectedProjectPath = preferred?.path || "";
  elements.projectSelect.innerHTML = "";
  for (const project of state.projects) {
    const option = document.createElement("option");
    option.value = project.path;
    option.textContent = `${project.name}${project.exists ? "" : "（目录不存在）"}`;
    option.title = project.path;
    option.disabled = !project.exists;
    elements.projectSelect.append(option);
  }
  if (state.selectedProjectPath) elements.projectSelect.value = state.selectedProjectPath;
  elements.projectSelect.disabled = state.projects.length < 2;
}
function showToast(message) {
  clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  state.toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

function isNearBottom() {
  return elements.chatStage.scrollHeight - elements.chatStage.scrollTop - elements.chatStage.clientHeight < 170;
}

function scrollToBottom(smooth = false) {
  requestAnimationFrame(() => {
    elements.chatStage.scrollTo({ top: elements.chatStage.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  });
}

function inlineContent(text) {
  const fragment = document.createDocumentFragment();
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<]+)/gi;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) fragment.append(document.createTextNode(text.slice(cursor, match.index)));
    const token = match[0];
    if (token.startsWith("`")) {
      const code = document.createElement("code");
      code.textContent = token.slice(1, -1);
      fragment.append(code);
    } else if (token.startsWith("**")) {
      const strong = document.createElement("strong");
      strong.textContent = token.slice(2, -2);
      fragment.append(strong);
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/i);
      if (linkMatch) {
        const link = document.createElement("a");
        link.href = linkMatch[2];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = linkMatch[1];
        link.addEventListener("click", (event) => handleConversationFileLink(event, link.href, link.textContent));
        fragment.append(link);
      } else {
        fragment.append(document.createTextNode(token));
      }
    } else {
      const link = document.createElement("a");
      link.href = token;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = token;
      link.addEventListener("click", (event) => handleConversationFileLink(event, link.href, link.textContent));
      fragment.append(link);
    }
    cursor = match.index + token.length;
  }
  if (cursor < text.length) fragment.append(document.createTextNode(text.slice(cursor)));
  return fragment;
}

function appendInlineBlocks(container, text) {
  const blocks = text.split(/\n{2,}/);
  for (const rawBlock of blocks) {
    const block = rawBlock.trim();
    if (!block) continue;
    const heading = block.match(/^(#{1,3})\s+(.+)$/);
    if (heading && block.split("\n").length === 1) {
      const node = document.createElement(`h${heading[1].length}`);
      node.append(inlineContent(heading[2]));
      container.append(node);
      continue;
    }

    const lines = block.split("\n");
    const isBullets = lines.every((line) => /^[-*]\s+/.test(line));
    const isNumbered = lines.every((line) => /^\d+\.\s+/.test(line));
    if (isBullets || isNumbered) {
      const list = document.createElement(isBullets ? "ul" : "ol");
      for (const line of lines) {
        const item = document.createElement("li");
        item.append(inlineContent(line.replace(/^([-*]|\d+\.)\s+/, "")));
        list.append(item);
      }
      container.append(list);
      continue;
    }

    const paragraph = document.createElement("p");
    lines.forEach((line, index) => {
      if (index) paragraph.append(document.createElement("br"));
      paragraph.append(inlineContent(line));
    });
    container.append(paragraph);
  }
}

function displayMessageText(text) {
  return String(text || "")
    .replace(
      /!?\[[^\]\n]*\]\((?:file:\/\/\/?|[A-Za-z]:[\\/]|\\\\)[^)\n]+?\.(?:mp4|mov|m4v|webm|mkv|mp3|m4a|wav|ogg|opus|flac|aac|png|jpg|jpeg|webp|gif|pdf|docx?|xlsx?|pptx?|zip)\)/gi,
      "",
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
function renderMarkdown(container, text) {
  const source = String(text || "");
  const fence = /```([^\n]*)\n([\s\S]*?)```/g;
  let cursor = 0;
  for (const match of source.matchAll(fence)) {
    appendInlineBlocks(container, source.slice(cursor, match.index));
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    if (match[1].trim()) code.dataset.language = match[1].trim();
    code.textContent = match[2].replace(/\n$/, "");
    pre.append(code);
    container.append(pre);
    cursor = match.index + match[0].length;
  }
  appendInlineBlocks(container, source.slice(cursor));
}

function addCopyAction(message, text) {
  const actions = document.createElement("div");
  actions.className = "message-actions";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "复制";
  button.addEventListener("click", async () => {
    await copyText(text);
    showToast("已复制");
  });
  actions.append(button);
  message.append(actions);
}

function fillAvatarContent(avatar, isUser) {
  const dataUrl = isUser ? state.identity.userAvatar : state.identity.codexAvatar;
  avatar.innerHTML = "";
  if (dataUrl) {
    const image = document.createElement("img");
    image.src = dataUrl;
    image.alt = "";
    avatar.append(image);
  } else if (isUser) {
    avatar.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19c.7-3.5 3-5.4 6.5-5.4s5.8 1.9 6.5 5.4"/></svg>';
  } else {
    avatar.textContent = "C";
  }
}

function createMessageAvatar(isUser) {
  const avatar = document.createElement("div");
  avatar.className = `message-avatar ${isUser ? "user" : "codex"}`;
  avatar.setAttribute("aria-hidden", "true");
  fillAvatarContent(avatar, isUser);
  return avatar;
}

function refreshTypingAvatar() {
  if (elements.typingAvatar) fillAvatarContent(elements.typingAvatar, false);
}

async function recallMessage(seq) {
  const event = state.events.get(seq);
  if (!event || !state.active?.id) return;
  const warning = event.delivery === "queued" || event.delivery === "desktop-queued"
    ? "撤回这条排队消息？它会从等待队列中移除。"
    : "撤回这条消息？Codex 会回退到发送前的对话版本，并在电脑端留下撤回记录。当前回合之后的回复也会被移除。";
  if (!confirm(warning)) return;
  try {
    const data = await api(`/api/conversations/${state.active.id}/messages/${seq}/recall`, { method: "POST" });
    const conversation = scopeConversation(data.conversation);
    conversation.queuedMessages = data.queuedMessages || [];
    resetConversationView(conversation);
    showToast(data.reverted ? "消息已撤回，并回退到发送前的版本" : "消息已撤回");
  } catch (error) {
    if (error.status !== 401) showToast(error.message || "撤回失败");
  }
}

function createRecallEvent(event) {
  const line = document.createElement("div");
  line.className = "recall-line";
  line.textContent = event.text || "你撤回了一条消息";
  return line;
}

function showApprovalAlert(message) {
  state.approvalAlertConversationId = String(message?.conversationId || "");
  if (elements.approvalAlertText) {
    elements.approvalAlertText.textContent = message?.text || message?.title || "电脑上的 Codex 正在等待权限审核。";
  }
  if (elements.approvalAlertDialog && !elements.approvalAlertDialog.open) {
    elements.approvalAlertDialog.showModal();
  }
}

function closeApprovalAlert() {
  if (elements.approvalAlertDialog?.open) elements.approvalAlertDialog.close();
}

function isAutomationControlPrompt(text) {
  const value = String(text || "").replace(/^[\uFEFF\u200B-\u200D\u2060\s]+/, "");
  return /<heartbeat\b/i.test(value)
    || /<automation\s+id=/i.test(value)
    || (/<automation\b/i.test(value) && /<instructions>/i.test(value));
}

function sanitizeAutomationResultText(text) {
  const value = String(text || "");
  if (!/<heartbeat\b/i.test(value) || !/<(?:decision|automation_id|message)\b/i.test(value)) return value;
  const stripped = value.replace(/<heartbeat\b[\s\S]*?(?:<\/heartbeat>|$)/gi, "").trim();
  const decision = value.match(/<decision>\s*([^<]+?)\s*<\/decision>/i)?.[1]?.trim() || "";
  const message = value.match(/<message>\s*([\s\S]*?)\s*<\/message>/i)?.[1]?.trim() || "";
  if (/DONT_NOTIFY/i.test(decision)) return stripped;
  return stripped || message;
}

function sanitizeEventForDisplay(event) {
  if (!event || event.hidden || isAutomationControlPrompt(event.text)) return null;
  if (event.type !== "assistant_message") return event;
  const text = sanitizeAutomationResultText(event.text);
  if (!text) return null;
  return text === event.text ? event : { ...event, text };
}

function createMessageEvent(event) {
  if (event.hidden || isAutomationControlPrompt(event.text)) return null;
  const isUser = event.type === "user_message";
  const visibleText = isUser ? String(event.displayText || event.text || "") : displayMessageText(event.text);
  if (!visibleText) return null;
  const article = document.createElement("article");
  article.className = `message ${isUser ? "user" : "assistant"}`;
  article.dataset.seq = String(event.seq);
  const body = document.createElement("div");
  body.className = "message-body";
  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = isUser ? state.identity.userName : state.identity.codexName;
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  renderMarkdown(bubble, visibleText);
  body.append(label, bubble);
  if (!isUser) addCopyAction(body, visibleText);
  if (isUser && !event.recalled && Date.now() - new Date(event.ts).getTime() <= 2 * 60_000) {
    const actions = document.createElement("div");
    actions.className = "message-actions";
    const recall = document.createElement("button");
    recall.type = "button";
    recall.textContent = "撤回";
    recall.addEventListener("click", () => recallMessage(event.seq));
    actions.append(recall);
    body.append(actions);
  }
  const avatar = createMessageAvatar(isUser);
  article.append(avatar, body);
  return article;
}

function createProgressEvent(event) {
  const details = document.createElement("details");
  details.className = "progress-card";
  if (event.ok === true) details.classList.add("ok");
  if (event.ok === false) details.classList.add("failed");
  const summary = document.createElement("summary");
  const icon = document.createElement("span");
  icon.className = "progress-icon";
  icon.textContent = event.ok === false ? "!" : event.ok === true ? "✓" : "›";
  const copy = document.createElement("span");
  copy.className = "progress-copy";
  const title = document.createElement("strong");
  title.textContent = event.text || "执行步骤";
  copy.append(title);
  if (event.detail) {
    const detail = document.createElement("code");
    detail.textContent = event.detail;
    copy.append(detail);
  }
  summary.append(icon, copy);
  details.append(summary);
  if (event.output) {
    const pre = document.createElement("pre");
    pre.textContent = event.output;
    details.append(pre);
  }
  return details;
}

function updateImageCountdown(element) {
  const value = element.dataset.expiresAt;
  if (!value) return;
  const remaining = new Date(value).getTime() - Date.now();
  if (remaining <= 0) {
    element.textContent = "二维码可能已失效，请重新打开登录页";
    element.classList.add("expired");
    return;
  }
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  element.textContent = `请在 ${minutes}:${seconds} 内扫码`;
  element.classList.remove("expired");
}

function createImageEvent(event) {
  const isUser = event.role === "user" || event.userImage === true;
  if (isUser && event.url) {
    return createMediaEvent({
      ...event,
      type: "media",
      kind: "image",
      inline: true,
      userMedia: true,
      role: "user",
    });
  }
  const article = document.createElement("article");
  article.className = `message ${isUser ? "user" : "assistant"}`;
  const body = document.createElement("div");
  body.className = "message-body";
  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = isUser ? state.identity.userName : (event.caption || "电脑浏览器截图");
  label.dataset.imageCaption = "true";
  const bubble = document.createElement("div");
  bubble.className = `message-bubble image-message${isUser ? " user-image" : ""}`;
  const link = document.createElement("a");
  link.href = event.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.addEventListener("click", () => recordConversationFile(link.href, event.caption || "对话图片", "image"));
  const image = document.createElement("img");
  image.src = event.url;
  image.alt = event.caption || "电脑浏览器截图";
  image.loading = "eager";
  link.append(image);
  bubble.append(link);
  if (event.path) {
    const localPath = document.createElement("div");
    localPath.className = "image-local-path";
    localPath.textContent = `电脑路径：${event.path}`;
    bubble.append(localPath);
  }
  if (event.expiresAt) {
    const countdown = document.createElement("div");
    countdown.className = "image-countdown";
    countdown.dataset.expiresAt = event.expiresAt;
    updateImageCountdown(countdown);
    bubble.append(countdown);
  }
  body.append(label, bubble);
  article.append(createMessageAvatar(isUser), body);
  return article;
}
function mediaTypeLabel(event) {
  if (event.kind === "image") return "图片";
  if (event.kind === "video") return "MP4 视频";
  if (event.kind === "audio") return "音频";
  return event.mimeType || "文件";
}

function recordMediaVisit(event) {
  const type = event.kind === "image" ? "image" : event.kind === "video" ? "video" : event.kind === "audio" ? "audio" : "link";
  recordConversationFile(event.url, event.caption || event.fileName, type, {
    fileName: event.fileName,
    mimeType: event.mimeType,
  });
}

function openMediaWithPhoneApp(event) {
  const bridge = window.CodexPocketNative;
  const url = event?.url;
  if (!url) return;
  recordMediaVisit(event);
  if (bridge && typeof bridge.openFileUrl === "function") {
    bridge.openFileUrl(url, event.fileName, event.mimeType || "");
    showToast("正在用手机默认应用打开…");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

async function downloadMediaToPhone(event) {
  recordMediaVisit(event);
  await downloadConversationFile(event.url, event.fileName, event.fileName);
}

function pauseAllVideos(except = null) {
  for (const video of document.querySelectorAll("video")) {
    if (video === except || video.paused) continue;
    try { video.pause(); } catch {}
  }
}

function fitMediaViewerToViewport() {
  if (!elements.mediaViewer) return;
  const viewport = window.visualViewport;
  const width = Math.max(1, Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth));
  const height = Math.max(1, Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight));
  elements.mediaViewer.style.setProperty("--viewer-width", `${width}px`);
  elements.mediaViewer.style.setProperty("--viewer-height", `${height}px`);
}

function handleMediaViewerViewportChange() {
  if (!elements.mediaViewer?.open) return;
  requestAnimationFrame(() => {
    fitMediaViewerToViewport();
    if (!elements.mediaViewerImage.hidden) {
      state.mediaViewerScale = 1;
      state.mediaViewerX = 0;
      state.mediaViewerY = 0;
      applyMediaViewerTransform();
    }
  });
}
function resetMediaViewerTransform() {
  state.mediaViewerScale = 1;
  state.mediaViewerX = 0;
  state.mediaViewerY = 0;
  state.mediaViewerPointer = null;
  state.mediaViewerTouchStart = null;
  const image = elements.mediaViewerImage;
  if (image) {
    image.style.transform = "";
    image.style.cursor = "zoom-in";
  }
}

function applyMediaViewerTransform() {
  const image = elements.mediaViewerImage;
  if (!image) return;
  image.style.transform = `translate3d(${state.mediaViewerX}px, ${state.mediaViewerY}px, 0) scale(${state.mediaViewerScale})`;
  image.style.cursor = state.mediaViewerScale > 1 ? "grab" : "zoom-in";
}

function viewerItemsFor(event) {
  const items = [...state.events.values()].filter((item) => (
    item.type === "media" &&
    item.url &&
    (item.kind === "image" || (item.kind === "video" && item.inline))
  ));
  return items.length ? items : [event];
}

function currentMediaViewerItem() {
  return state.mediaViewerItems[state.mediaViewerIndex] || null;
}

function renderMediaViewer() {
  fitMediaViewerToViewport();
  const item = currentMediaViewerItem();
  if (!item || !elements.mediaViewer?.open) return;
  elements.mediaViewer.classList.toggle("video-active", item.kind === "video");
  pauseAllVideos();
  resetMediaViewerTransform();
  const image = elements.mediaViewerImage;
  const video = elements.mediaViewerVideo;
  image.hidden = true;
  video.hidden = true;
  elements.mediaViewerError.hidden = true;
  image.removeAttribute("src");
  video.pause();
  video.removeAttribute("src");
  video.load();
  elements.mediaViewerCounter.textContent = state.mediaViewerItems.length > 1
    ? `${state.mediaViewerIndex + 1} / ${state.mediaViewerItems.length}`
    : "";
  elements.mediaViewerCaption.textContent = item.caption || item.fileName || "";
  elements.prevMediaViewerButton.disabled = state.mediaViewerIndex <= 0;
  elements.nextMediaViewerButton.disabled = state.mediaViewerIndex >= state.mediaViewerItems.length - 1;
  elements.prevMediaViewerButton.hidden = state.mediaViewerItems.length <= 1;
  elements.nextMediaViewerButton.hidden = state.mediaViewerItems.length <= 1;
  if (!item.pending) recordMediaVisit(item);

  if (item.kind === "image") {
    image.src = item.url;
    image.alt = item.caption || item.fileName || "图片";
    image.hidden = false;
    image.onerror = () => {
      image.hidden = true;
      elements.mediaViewerError.hidden = false;
      elements.mediaViewerError.textContent = "图片加载失败";
    };
    return;
  }

  video.src = item.url;
  video.hidden = false;
  video.playsInline = true;
  video.controls = true;
  video.preload = "auto";
  video.onplay = () => pauseAllVideos(video);
  video.onerror = () => {
    video.hidden = true;
    elements.mediaViewerError.hidden = false;
    elements.mediaViewerError.textContent = "视频加载失败";
  };
  video.play().catch(() => {});
}

function openMediaViewer(event) {
  if (!elements.mediaViewer || !event?.url) return;
  pauseAllVideos();
  state.mediaViewerItems = event.pending ? [event] : viewerItemsFor(event);
  state.mediaViewerIndex = event.pending
    ? 0
    : Math.max(0, state.mediaViewerItems.findIndex((item) => item.seq === event.seq));
  if (!event.pending) recordMediaVisit(event);
  fitMediaViewerToViewport();
  if (!elements.mediaViewer.open) elements.mediaViewer.showModal();
  fitMediaViewerToViewport();
  renderMediaViewer();
}

function closeMediaViewer() {
  const video = elements.mediaViewerVideo;
  if (video) {
    try { video.pause(); } catch {}
    video.removeAttribute("src");
    video.load();
  }
  if (elements.mediaViewer?.open) elements.mediaViewer.close();
  resetMediaViewerTransform();
}

function stepMediaViewer(offset) {
  const next = state.mediaViewerIndex + offset;
  if (next < 0 || next >= state.mediaViewerItems.length) return;
  state.mediaViewerIndex = next;
  renderMediaViewer();
}

function setupMediaViewer() {
  if (!elements.mediaViewer) return;
  document.addEventListener("play", (event) => {
    if (event.target instanceof HTMLVideoElement) pauseAllVideos(event.target);
  }, true);
  elements.closeMediaViewerButton.addEventListener("click", closeMediaViewer);
  elements.prevMediaViewerButton.addEventListener("click", () => stepMediaViewer(-1));
  elements.nextMediaViewerButton.addEventListener("click", () => stepMediaViewer(1));
  elements.saveMediaViewerButton.addEventListener("click", () => {
    const item = currentMediaViewerItem();
    if (item) downloadMediaToPhone(item).catch((error) => showToast(error.message || "下载失败"));
  });
  elements.mediaViewer.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeMediaViewer();
  });
  window.addEventListener("resize", handleMediaViewerViewportChange, { passive: true });
  window.addEventListener("orientationchange", handleMediaViewerViewportChange, { passive: true });
  window.visualViewport?.addEventListener("resize", handleMediaViewerViewportChange, { passive: true });
  if (window.ResizeObserver) {
    const viewerObserver = new ResizeObserver(handleMediaViewerViewportChange);
    viewerObserver.observe(elements.mediaViewer);
  }
  elements.mediaViewer.addEventListener("close", () => {
    pauseAllVideos();
    const video = elements.mediaViewerVideo;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  });

  const stage = elements.mediaViewerStage;
  let pinchDistance = 0;
  let pinchScale = 1;
  let panX = 0;
  let panY = 0;
  let lastTapAt = 0;
  let swipeStart = null;

  stage.addEventListener("touchstart", (event) => {
    if (elements.mediaViewerImage.hidden) return;
    if (event.touches.length === 2) {
      const [a, b] = event.touches;
      pinchDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
      pinchScale = state.mediaViewerScale;
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      swipeStart = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      panX = state.mediaViewerX;
      panY = state.mediaViewerY;
    }
  }, { passive: false });

  stage.addEventListener("touchmove", (event) => {
    if (elements.mediaViewerImage.hidden) return;
    if (event.touches.length === 2) {
      const [a, b] = event.touches;
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
      state.mediaViewerScale = Math.max(1, Math.min(4, pinchScale * distance / pinchDistance));
      if (state.mediaViewerScale === 1) {
        state.mediaViewerX = 0;
        state.mediaViewerY = 0;
      }
      applyMediaViewerTransform();
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1 && state.mediaViewerScale > 1) {
      const touch = event.touches[0];
      state.mediaViewerX = panX + touch.clientX - swipeStart.x;
      state.mediaViewerY = panY + touch.clientY - swipeStart.y;
      applyMediaViewerTransform();
      event.preventDefault();
    }
  }, { passive: false });

  stage.addEventListener("touchend", (event) => {
    if (elements.mediaViewerImage.hidden) return;
    if (event.touches.length === 0 && state.mediaViewerScale <= 1.01 && swipeStart) {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - swipeStart.x;
      const dy = touch.clientY - swipeStart.y;
      const dt = Date.now() - swipeStart.time;
      if (Math.abs(dx) > 58 && Math.abs(dx) > Math.abs(dy)) {
        stepMediaViewer(dx < 0 ? 1 : -1);
      } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
        closeMediaViewer();
      } else if (dt < 240 && Math.abs(dx) < 14 && Math.abs(dy) < 14) {
        const now = Date.now();
        if (now - lastTapAt < 300) {
          state.mediaViewerScale = state.mediaViewerScale > 1 ? 1 : 2;
          state.mediaViewerX = 0;
          state.mediaViewerY = 0;
          applyMediaViewerTransform();
          lastTapAt = 0;
        } else {
          lastTapAt = now;
        }
      }
    }
    swipeStart = null;
    if (state.mediaViewerScale <= 1.01) {
      state.mediaViewerScale = 1;
      state.mediaViewerX = 0;
      state.mediaViewerY = 0;
      applyMediaViewerTransform();
    }
  });
}

function createMediaEvent(event) {
  const isUser = event.role === "user" || event.userMedia === true;
  const article = document.createElement("article");
  article.className = `message ${isUser ? "user" : "assistant"}`;
  const body = document.createElement("div");
  body.className = "message-body";
  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = isUser ? state.identity.userName : (event.caption || event.fileName || "电脑生成的文件");

  if (event.voiceMessage && event.kind === "audio" && event.url) {
    label.textContent = isUser ? state.identity.userName : state.identity.codexName;
    const bubble = document.createElement("div");
    bubble.className = `message-bubble voice-message-bubble${isUser ? " user-voice" : ""}`;
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.hidden = true;
    audio.src = event.url;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "voice-message-play";
    button.setAttribute("aria-label", "播放语音消息");
    const icon = document.createElement("span");
    icon.className = "voice-message-icon";
    icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z"/></svg>';
    const bars = document.createElement("span");
    bars.className = "voice-message-bars";
    bars.innerHTML = "<i></i><i></i><i></i><i></i><i></i>";
    const duration = document.createElement("span");
    duration.className = "voice-message-duration";
    duration.textContent = event.durationMs ? formatVoiceDuration(event.durationMs) : "语音";
    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        duration.textContent = formatVoiceDuration(audio.duration * 1000);
      }
    }, { once: true });
    audio.addEventListener("play", () => {
      pauseAllVideos();
      bubble.classList.add("playing");
      button.setAttribute("aria-label", "暂停语音消息");
      recordMediaVisit(event);
    });
    audio.addEventListener("pause", () => {
      bubble.classList.remove("playing");
      button.setAttribute("aria-label", "播放语音消息");
    });
    audio.addEventListener("ended", () => {
      bubble.classList.remove("playing");
      button.setAttribute("aria-label", "播放语音消息");
    });
    button.append(icon, bars, duration);
    button.addEventListener("click", () => {
      if (audio.paused) audio.play().catch(() => showToast("语音播放失败"));
      else audio.pause();
    });
    bubble.append(button, audio);
    body.append(label, bubble);
    article.append(createMessageAvatar(isUser), body);
    return article;
  }
  if (event.kind === "image" && event.url) {
    const bubble = document.createElement("div");
    bubble.className = `message-bubble visual-media-bubble${isUser ? " user-media" : ""}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "media-thumb-button image-thumb";
    button.setAttribute("aria-label", `查看图片 ${event.caption || event.fileName || ""}`);
    const image = document.createElement("img");
    image.className = "media-thumb-image";
    image.src = event.url;
    image.alt = event.caption || event.fileName || (isUser ? "手机发送的图片" : "电脑生成的图片");
    image.loading = "eager";
    button.append(image);
    button.addEventListener("click", () => openMediaViewer(event));
    bubble.append(button);
    body.append(label, bubble);
    if (event.pending) {
      const uploadState = document.createElement("span");
      uploadState.className = "media-upload-state";
      uploadState.textContent = "正在发送到电脑…";
      body.append(uploadState);
    }
    article.append(createMessageAvatar(isUser), body);
    return article;
  }

  if (event.kind === "video" && event.inline && event.url) {
    const bubble = document.createElement("div");
    bubble.className = `message-bubble visual-media-bubble video-message-bubble${isUser ? " user-media" : ""}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "media-thumb-button video-thumb";
    button.setAttribute("aria-label", `播放视频 ${event.caption || event.fileName || ""}`);
    const video = document.createElement("video");
    video.className = "media-thumb-video";
    video.src = event.url;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.tabIndex = -1;
    const play = document.createElement("span");
    play.className = "video-play-mark";
    play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6V6Z"/></svg>';
    const duration = document.createElement("span");
    duration.className = "video-duration";
    duration.textContent = "视频";
    video.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        duration.textContent = formatVoiceDuration(video.duration * 1000);
      }
      if (video.videoWidth && video.videoHeight) {
        const ratio = video.videoWidth / video.videoHeight;
        button.style.setProperty("--video-aspect", String(ratio));
        button.classList.toggle("portrait", ratio < 1);
        button.classList.toggle("landscape", ratio >= 1);
      }
      try { video.currentTime = Math.min(0.1, video.duration || 0); } catch {}
    }, { once: true });
    button.append(video, play, duration);
    button.addEventListener("click", () => openMediaViewer(event));
    bubble.append(button);
    body.append(label, bubble);
    if (event.pending) {
      const uploadState = document.createElement("span");
      uploadState.className = "media-upload-state";
      uploadState.textContent = "正在发送到电脑…";
      body.append(uploadState);
    }
    article.append(createMessageAvatar(isUser), body);
    return article;
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble media-message";
  const card = document.createElement("div");
  card.className = `media-card ${event.kind || "file"}`;
  const head = document.createElement("div");
  head.className = "media-head";
  const mark = document.createElement("span");
  mark.className = "media-kind";
  mark.textContent = event.kind === "audio" ? "AUD" : "FILE";
  const copy = document.createElement("div");
  copy.className = "media-copy";
  const title = document.createElement("strong");
  title.textContent = event.caption || event.fileName || "电脑生成的文件";
  const meta = document.createElement("small");
  meta.textContent = [mediaTypeLabel(event), formatDownloadSize(event.size)].filter(Boolean).join(" · ");
  copy.append(title, meta);
  head.append(mark, copy);
  card.append(head);

  if (event.kind === "audio" && event.url) {
    const audio = document.createElement("audio");
    audio.className = "media-preview-audio";
    audio.src = event.url;
    audio.controls = true;
    audio.preload = "metadata";
    audio.addEventListener("play", () => recordMediaVisit(event), { once: true });
    card.append(audio);
  } else {
    const fileBox = document.createElement("div");
    fileBox.className = "media-file-box";
    fileBox.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.8h8l4 4V21H6z"/><path d="M14 2.8V7h4M9 12h6M9 15.5h6"/></svg>';
    const fileCopy = document.createElement("div");
    const fileTitle = document.createElement("strong");
    fileTitle.textContent = event.fileName || "电脑文件";
    const fileHelp = document.createElement("small");
    fileHelp.textContent = event.pending ? "正在发送到电脑…" : "用手机默认浏览器或其他应用打开";
    fileCopy.append(fileTitle, fileHelp);
    fileBox.append(fileCopy);
    card.append(fileBox);
  }

  const actions = document.createElement("div");
  actions.className = "media-actions";
  if (event.kind !== "audio" && !event.pending) {
    const open = document.createElement("button");
    open.type = "button";
    open.className = "primary";
    open.textContent = "用其他应用打开";
    open.addEventListener("click", () => openMediaWithPhoneApp(event));
    actions.append(open);
  }
  const save = document.createElement("button");
  save.type = "button";
  save.className = event.kind === "audio" ? "primary" : "";
  save.textContent = "保存到手机";
  save.addEventListener("click", () => {
    save.disabled = true;
    downloadMediaToPhone(event)
      .catch((error) => showToast(error.message || "下载失败"))
      .finally(() => { save.disabled = false; });
  });
  actions.append(save);
  if (!event.pending) card.append(actions);
  bubble.append(card);
  body.append(label, bubble);
  if (event.pending) {
    const uploadState = document.createElement("span");
    uploadState.className = "media-upload-state";
    uploadState.textContent = "正在发送到电脑…";
    body.append(uploadState);
  }
  article.append(createMessageAvatar(isUser), body);
  return article;
}
function resolveApprovalCard(approvalId, decision, text) {
  const card = document.querySelector(`[data-approval-id="${approvalId}"]`);
  if (!card) return;
  card.classList.remove("pending");
  card.classList.add(decision === "accept" ? "accepted" : "rejected");
  const actions = card.querySelector(".approval-actions");
  if (actions) actions.remove();
  const status = card.querySelector(".approval-status");
  if (status) status.textContent = text || (decision === "accept" ? "已允许本次操作" : "已拒绝本次操作");
  document.title = "口袋";
}

function createApprovalEvent(event) {
  const card = document.createElement("section");
  card.className = "approval-card pending";
  card.dataset.approvalId = event.approvalId;
  const head = document.createElement("div");
  head.className = "approval-head";
  const mark = document.createElement("span");
  mark.className = "approval-mark";
  mark.textContent = "!";
  const copy = document.createElement("div");
  copy.className = "approval-copy";
  const title = document.createElement("strong");
  title.textContent = event.title || "需要权限确认";
  const description = document.createElement("p");
  description.textContent = event.text || "Codex 需要你的确认才能继续。";
  copy.append(title, description);
  head.append(mark, copy);
  card.append(head);
  if (event.detail || event.cwd) {
    const detail = document.createElement("pre");
    detail.className = "approval-detail";
    detail.textContent = [event.detail, event.cwd ? `工作目录：${event.cwd}` : ""].filter(Boolean).join("\n");
    card.append(detail);
  }
  const status = document.createElement("p");
  status.className = "approval-status";
  status.textContent = "等待你的确认";
  const actions = document.createElement("div");
  actions.className = "approval-actions";
  const approve = document.createElement("button");
  approve.type = "button";
  approve.className = "approval-approve";
  approve.textContent = "允许这一次";
  const deny = document.createElement("button");
  deny.type = "button";
  deny.className = "approval-deny";
  deny.textContent = "拒绝";
  actions.append(approve, deny);
  card.append(status, actions);

  const respond = async (decision) => {
    approve.disabled = true;
    deny.disabled = true;
    status.textContent = "正在提交…";
    try {
      await api(`/api/conversations/${state.active.id}/approvals/${encodeURIComponent(event.approvalId)}`, {
        method: "POST",
        body: JSON.stringify({ decision }),
      });
      resolveApprovalCard(event.approvalId, decision);
      schedulePoll(100);
    } catch (error) {
      approve.disabled = false;
      deny.disabled = false;
      status.textContent = error.message;
      showToast(error.message);
    }
  };
  approve.addEventListener("click", () => respond("accept"));
  deny.addEventListener("click", () => respond("decline"));
  return card;
}

function createEventNode(event) {
  if (event.type === "recall") return createRecallEvent(event);
  if (event.type === "user_message" || event.type === "assistant_message") return createMessageEvent(event);
  if (event.type === "approval") return createApprovalEvent(event);
  if (event.type === "approval_result") {
    resolveApprovalCard(event.approvalId, event.decision, event.text);
    return null;
  }
  if (event.type === "image") return createImageEvent(event);
  if (event.type === "media") return createMediaEvent(event);
  if (event.type === "progress") {
    if (event.kind === "command" || event.kind === "tool" || event.kind === "web") return null;
    return createProgressEvent(event);
  }
  if (event.type === "error") {
    const card = document.createElement("div");
    card.className = "error-card";
    card.textContent = event.text;
    return card;
  }
  if (event.type === "status") {
    if (!event.text || event.status === "running") return null;
    const line = document.createElement("div");
    line.className = "status-line";
    if (event.status === "failed") line.classList.add("error");
    line.textContent = event.text;
    return line;
  }
  return null;
}

function updateAppIconBadge(total) {
  const count = Math.max(0, Number(total) || 0);
  if (state.lastAppBadgeCount === count) return;
  state.lastAppBadgeCount = count;
  const bridge = window.CodexPocketNative;
  if (bridge && typeof bridge.setAppBadge === "function") {
    try { bridge.setAppBadge(count); } catch {}
    return;
  }
  try {
    if (count > 0 && typeof navigator.setAppBadge === "function") navigator.setAppBadge(count);
    else if (count === 0 && typeof navigator.clearAppBadge === "function") navigator.clearAppBadge();
  } catch {}
}

function updateUnreadBadge() {
  const localTotal = state.conversations.reduce((sum, conversation) => sum + Math.max(0, Number(conversation.unreadCount) || 0), 0);
  const total = Math.max(0, Number.isFinite(state.globalUnread) ? state.globalUnread : localTotal);
  const label = total > 99 ? "99+" : String(total);
  for (const badge of [elements.topUnreadBadge, elements.brandUnreadBadge]) {
    if (!badge) continue;
    badge.hidden = total === 0;
    badge.textContent = label;
    badge.setAttribute("aria-label", `未读消息 ${total} 条`);
  }
  elements.menuButton?.setAttribute("aria-label", total > 0 ? `打开对话列表，${total} 条未读消息` : "打开对话列表");
  updateAppIconBadge(total);
}

async function refreshGlobalUnread() {
  const data = await api("/api/global-unread");
  const count = Number(data.count);
  if (Number.isFinite(count) && count >= 0) {
    state.globalUnread = count;
    updateUnreadBadge();
  }
}

async function markConversationRead(id) {
  if (!id || document.hidden || state.readRequests.has(id)) return;
  const conversation = state.conversations.find((item) => item.id === id);
  if (!conversation || !conversation.unreadCount) return;
  state.readRequests.add(id);
  try {
    const data = await api(`/api/conversations/${id}/read`, { method: "POST" });
    conversation.unreadCount = 0;
    if (state.active?.id === id) state.active.unreadCount = 0;
    updateUnreadBadge();
    renderConversationList();
    writeCachedBootstrap({
      ...(state.config || {}),
      conversations: state.conversations,
      globalUnread: state.globalUnread,
    });
    refreshGlobalUnread().catch(() => {});
    scheduleConversationCache();
  } catch (error) {
    if (error.status !== 401) console.warn(error);
  } finally {
    state.readRequests.delete(id);
  }
}

function closeConversationSwipes(except = null) {
  for (const row of elements.conversationList.querySelectorAll(".conversation-item.actions-open")) {
    if (row === except) continue;
    row.classList.remove("actions-open");
    const content = row.querySelector(".conv-swipe-content");
    if (content) content.style.transform = "";
  }
}

function setupConversationSwipe(row, content) {
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let moved = false;
  let horizontal = false;
  content.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".conv-swipe-actions")) return;
    startX = event.clientX;
    startY = event.clientY;
    startOffset = row.classList.contains("actions-open") ? -132 : 0;
    moved = false;
    horizontal = false;
    try { content.setPointerCapture(event.pointerId); } catch {}
  });
  content.addEventListener("pointermove", (event) => {
    if (!content.hasPointerCapture?.(event.pointerId)) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!horizontal && Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy)) horizontal = true;
    if (!horizontal) return;
    moved = true;
    row.dataset.suppressClick = "1";
    content.style.transition = "none";
    content.style.transform = `translateX(${Math.max(-132, Math.min(0, startOffset + dx))}px)`;
  });
  const finish = (event) => {
    if (!content.hasPointerCapture?.(event.pointerId)) return;
    try { content.releasePointerCapture(event.pointerId); } catch {}
    content.style.transition = "";
    const current = Number.parseFloat(content.style.transform.match(/-?\d+(?:\.\d+)?/)?.[0] || String(startOffset));
    content.style.transform = "";
    const open = current < -64;
    row.classList.toggle("actions-open", open);
    if (open) closeConversationSwipes(row);
    if (moved) window.setTimeout(() => { delete row.dataset.suppressClick; }, 0);
  };
  content.addEventListener("pointerup", finish);
  content.addEventListener("pointercancel", finish);
  content.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    row.classList.add("actions-open");
    closeConversationSwipes(row);
  });
}

async function archiveConversation(conversation) {
  if (conversation.status === "running" || conversation.status === "waiting_approval") {
    showToast("任务运行中，结束后再归档");
    return;
  }
  try {
    const data = await api(`/api/conversations/${conversation.id}/archive`, { method: "POST" });
    state.conversations = state.conversations.filter((item) => item.id !== conversation.id);
    if (state.active?.id === conversation.id) {
      state.active = null;
      state.events = new Map();
      state.lastSeq = 0;
      setQueuedMessages([]);
      elements.messageList.innerHTML = "";
      localStorage.removeItem(ACTIVE_KEY);
      if (state.conversations[0]) await loadConversation(state.conversations[0].id);
      else resetConversationView(null);
    } else {
      renderConversationList();
    }
    showToast(data.shared ? "对话已归档并同步到 Codex" : "对话已从 Pocket 归档");
  } catch (error) {
    if (error.status !== 401) showToast(error.message);
  }
}

function renderConversationList() {
  updateUnreadBadge();
  elements.conversationList.innerHTML = "";
  if (!state.conversations.length) {
    const empty = document.createElement("div");
    empty.className = "drawer-empty-state";
    const status = state.conversationsStatus || "idle";
    if (status === "loading" || status === "idle") {
      const spinner = document.createElement("span");
      spinner.className = "drawer-empty-spinner";
      spinner.setAttribute("aria-hidden", "true");
      const title = document.createElement("strong");
      title.textContent = "正在加载对话";
      const copy = document.createElement("p");
      copy.textContent = "正在从这台新电脑同步对话列表…";
      empty.append(spinner, title, copy);
    } else if (status === "error") {
      empty.classList.add("error");
      const title = document.createElement("strong");
      title.textContent = "对话列表加载失败";
      const copy = document.createElement("p");
      copy.textContent = state.conversationsError || "请检查电脑端是否在线后重试。";
      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = "重新加载";
      retry.addEventListener("click", async () => {
        retry.disabled = true;
        try { await refreshConversationsWithRetry(); }
        catch (error) { showToast(error.message || "加载对话失败"); }
        finally { retry.disabled = false; }
      });
      empty.append(title, copy, retry);
    } else {
      const title = document.createElement("strong");
      title.textContent = "这台电脑还没有对话";
      const copy = document.createElement("p");
      copy.textContent = "新电脑已经连接成功，可以直接新建对话，或导入电脑上的 Codex 对话。";
      const actions = document.createElement("div");
      actions.className = "drawer-empty-state-actions";
      const create = document.createElement("button");
      create.type = "button";
      create.textContent = "新建对话";
      create.addEventListener("click", () => createConversation().catch((error) => showToast(error.message)));
      const importButton = document.createElement("button");
      importButton.type = "button";
      importButton.textContent = "导入 Codex 对话";
      importButton.addEventListener("click", openImportDialog);
      actions.append(create, importButton);
      empty.append(title, copy, actions);
    }
    elements.conversationList.append(empty);
    return;
  }

  const query = state.searchQuery.trim().toLocaleLowerCase("zh-CN");
  const conversations = query
    ? state.conversations.filter((conversation) => {
        const projectName = projectBaseName(conversation.workdir) || "";
        return [conversation.title || "新对话", projectName, conversation.workdir || ""]
          .some((value) => value.toLocaleLowerCase("zh-CN").includes(query));
      })
    : state.conversations;
  if (!conversations.length) {
    const empty = document.createElement("p");
    empty.className = "drawer-empty-state";
    empty.textContent = "没有匹配的对话";
    elements.conversationList.append(empty);
    return;
  }

  for (const conversation of conversations) {
    const row = document.createElement("div");
    row.className = "conversation-item";
    if (state.active?.id === conversation.id) row.classList.add("active");
    const unreadCount = Math.max(0, Number(conversation.unreadCount) || 0);
    if (unreadCount > 0) row.classList.add("unread");

    const select = document.createElement("button");
    select.type = "button";
    select.className = "conv-select";
    const main = document.createElement("span");
    main.className = "conv-main";
    const title = document.createElement("strong");
    title.textContent = conversation.title || "新对话";
    const meta = document.createElement("small");
    const dateLabel = new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(conversation.updatedAt));
    const computerName = conversation.computerName || currentComputer().name || "这台电脑";
    meta.textContent = `${agentNameById(conversation.agentId)} · ${computerName} · ${projectBaseName(conversation.workdir) || "workspace"} · ${dateLabel}${conversation.sourceCodexSessionId ? " · 实时同步" : ""}`;
    main.append(title, meta);
    select.append(main);
    if (unreadCount > 0) {
      const unread = document.createElement("span");
      unread.className = "conv-unread-badge";
      unread.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
      unread.setAttribute("aria-label", `${unreadCount} 条未读消息`);
      select.append(unread);
    }
    if (conversation.status === "running" || conversation.status === "waiting_approval") {
      const dot = document.createElement("span");
      dot.className = "conv-running";
      select.append(dot);
    }
    select.setAttribute(
      "aria-label",
      unreadCount > 0 ? `${conversation.title || "新对话"}，${unreadCount} 条未读消息` : conversation.title || "新对话",
    );
    select.addEventListener("click", (event) => {
      if (row.dataset.suppressClick === "1") {
        event.preventDefault();
        return;
      }
      if (row.classList.contains("actions-open")) {
        closeConversationSwipes();
        return;
      }
      selectConversation(conversation.id);
    });

    const content = document.createElement("div");
    content.className = "conv-swipe-content";
    content.append(select);
    const actions = document.createElement("div");
    actions.className = "conv-swipe-actions";
    const archive = document.createElement("button");
    archive.type = "button";
    archive.className = "conv-archive";
    archive.textContent = "归档";
    archive.setAttribute("aria-label", `归档对话 ${conversation.title}`);
    archive.addEventListener("click", () => archiveConversation(conversation));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "conv-delete";
    remove.textContent = "删除";
    remove.setAttribute("aria-label", `删除对话 ${conversation.title}`);
    remove.addEventListener("click", () => deleteConversation(conversation));
    actions.append(archive, remove);
    row.append(content, actions);
    setupConversationSwipe(row, content);
    elements.conversationList.append(row);
  }
}

function setQueuedMessages(messages) {
  state.queuedMessages = Array.isArray(messages)
    ? messages.filter((item) => item?.id && item?.text).map((item) => ({
        id: String(item.id),
        text: String(item.text),
        displayText: String(item.displayText || item.text),
        createdAt: item.createdAt || new Date().toISOString(),
      }))
    : [];
  renderQueuePanel();
  scheduleConversationCache();
}

function renderQueuePanel() {
  if (!elements.queuePanel || !elements.queueList) return;
  const messages = state.queuedMessages;
  elements.queuePanel.hidden = messages.length === 0;
  if (elements.queueCount) elements.queueCount.textContent = `(${messages.length})`;
  if (elements.cancelAllQueueButton) {
    elements.cancelAllQueueButton.hidden = messages.length === 0;
    elements.cancelAllQueueButton.disabled = messages.length === 0;
  }
  elements.queueList.innerHTML = "";
  for (const [index, item] of messages.entries()) {
    const row = document.createElement("div");
    row.className = "queue-item";
    const copy = document.createElement("div");
    copy.className = "queue-item-copy";
    const text = document.createElement("span");
    text.textContent = item.displayText || item.text;
    text.title = item.displayText || item.text;
    const meta = document.createElement("small");
    meta.textContent = `排队 ${index + 1} · 当前回合结束后自动发送`;
    copy.append(text, meta);
    const actions = document.createElement("div");
    actions.className = "queue-item-actions";
    const steer = document.createElement("button");
    steer.type = "button";
    steer.textContent = state.steeringQueueId === item.id ? "引导中…" : "立即引导";
    steer.disabled = !state.running || state.steeringQueueId === item.id;
    steer.addEventListener("click", () => {
      state.pendingSteerQueueId = item.id;
      if (elements.steerPreview) elements.steerPreview.textContent = item.text;
      if (elements.steerStatus) {
        elements.steerStatus.hidden = true;
        elements.steerStatus.textContent = "";
        elements.steerStatus.classList.remove("error");
      }
      elements.steerDialog?.showModal();
    });
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "queue-item-cancel";
    cancel.textContent = "取消排队";
    cancel.addEventListener("click", () => cancelQueuedMessage(item.id, cancel));
    actions.append(steer, cancel);
    row.append(copy, actions);
    elements.queueList.append(row);
  }
}

function setSteerStatus(message, isError = false) {
  if (!elements.steerStatus) return;
  elements.steerStatus.hidden = !message;
  elements.steerStatus.textContent = message;
  elements.steerStatus.classList.toggle("error", isError);
}

function closeSteerDialog() {
  state.steerAbortController?.abort();
  state.steerAbortController = null;
  state.pendingSteerQueueId = "";
  setSteerStatus("");
  elements.steerDialog?.close();
}

async function cancelAllQueuedMessages() {
  if (!state.active?.id) return;
  state.steerAbortController?.abort();
  state.steerAbortController = null;
  state.pendingSteerQueueId = "";
  state.steeringQueueId = "";
  if (elements.steerDialog?.open) elements.steerDialog.close();
  if (elements.cancelAllQueueButton) {
    elements.cancelAllQueueButton.disabled = true;
    elements.cancelAllQueueButton.textContent = "取消中…";
  }
  try {
    const data = await api(`/api/conversations/${state.active.id}/queue/cancel-all`, { method: "POST" });
    setQueuedMessages(data.queuedMessages || []);
    showToast("已取消全部排队消息");
    schedulePoll(120);
  } catch (error) {
    if (error.status !== 401) showToast(error.message || "取消全部排队失败");
  } finally {
    if (elements.cancelAllQueueButton) {
      elements.cancelAllQueueButton.disabled = !state.queuedMessages.length;
      elements.cancelAllQueueButton.textContent = "全部取消";
    }
  }
}

async function cancelQueuedMessage(queueId, button) {
  if (!queueId || !state.active?.id || !button) return;
  button.disabled = true;
  const previousText = button.textContent;
  button.textContent = "取消中…";
  try {
    const data = await api(`/api/conversations/${state.active.id}/queue/${queueId}/cancel`, { method: "POST" });
    setQueuedMessages(data.queuedMessages || []);
    if (state.pendingSteerQueueId === queueId) closeSteerDialog();
    showToast("已取消这条排队消息");
    schedulePoll(120);
  } catch (error) {
    if (error.status !== 401) showToast(error.message || "取消排队失败");
  } finally {
    if (button.isConnected) {
      button.disabled = false;
      button.textContent = previousText;
    }
  }
}

async function steerQueuedMessage() {
  const queueId = state.pendingSteerQueueId;
  if (!queueId || !state.active?.id) return;
  state.steerAbortController?.abort();
  const controller = new AbortController();
  state.steerAbortController = controller;
  const timeout = setTimeout(() => controller.abort(), 12_000);
  const conversationId = state.active.id;
  state.pendingSteerQueueId = "";
  state.steeringQueueId = queueId;
  setSteerStatus("");
  if (elements.steerDialog?.open) elements.steerDialog.close();
  renderQueuePanel();
  showToast("正在引导电脑上的当前任务…");
  try {
    const data = await api(`/api/conversations/${conversationId}/steer`, {
      method: "POST",
      body: JSON.stringify({ queueId }),
      signal: controller.signal,
    });
    if (state.active?.id === conversationId) {
      setQueuedMessages(data.queuedMessages || []);
      updateControls();
    }
    showToast(data.started ? "已开始发送排队消息" : "已引导到电脑上的当前任务");
    schedulePoll(150);
  } catch (error) {
    const timedOut = controller.signal.aborted;
    if (timedOut) showToast("引导超时，消息仍保留在队列中，可重试或全部取消");
    else if (error.name !== "AbortError" && error.status !== 401) {
      showToast(error.message || "引导失败，消息仍保留在队列中");
    }
  } finally {
    clearTimeout(timeout);
    if (state.steerAbortController === controller) state.steerAbortController = null;
    state.steeringQueueId = "";
    if (state.active?.id === conversationId) {
      renderQueuePanel();
      updateControls();
    }
  }
}

function updateComposerActions() {
  const hasText = Boolean(elements.messageInput.value.trim());
  const menuOpen = elements.attachmentMenu && !elements.attachmentMenu.hidden;
  const voiceBusy = state.voiceActive || state.voiceProcessing;
  elements.messageInput.hidden = state.voiceMode;
  if (elements.voiceTalkButton) {
    elements.voiceTalkButton.hidden = !state.voiceMode;
    elements.voiceTalkButton.disabled = state.voiceProcessing || state.voiceUploading;
    elements.voiceTalkButton.classList.toggle("recording", state.voiceActive);
    elements.voiceTalkButton.textContent = state.voiceProcessing || state.voiceUploading
      ? "处理中…"
      : state.voiceActive
        ? "松开 发送"
        : "按住 说话";
  }

  elements.sendButton.hidden = state.voiceMode || !hasText;
  elements.attachButton.hidden = voiceBusy || (hasText && !state.running && !menuOpen);
  elements.micButton.hidden = !state.recognition;
}

function updateEmptyState() {
  const hasMessages = [...state.events.values()].some((event) => {
    const visible = sanitizeEventForDisplay(event);
    return visible && (visible.type === "user_message" || visible.type === "assistant_message");
  });
  elements.emptyState.hidden = hasMessages;
  elements.typingRow.hidden = !state.running;
  elements.stopButton.hidden = !state.running;
  if (elements.stopTaskSection) elements.stopTaskSection.hidden = !state.running;
  updateComposerActions();
  elements.sendButton.disabled = !elements.messageInput.value.trim();
  renderQueuePanel();
}

function updateActivityCopy(running) {
  const waiting = state.active?.status === "waiting_approval";
  if (elements.typingText) {
    elements.typingText.textContent = waiting
      ? "等待你确认权限"
      : `${state.identity.codexName} 正在电脑上处理`;
  }
}

function updateControls() {
  const running = state.running
    || state.active?.status === "running"
    || state.active?.status === "stopping"
    || state.active?.status === "waiting_approval";
  state.running = running;
  elements.stopButton.hidden = !running;
  if (elements.stopTaskSection) elements.stopTaskSection.hidden = !running;
  elements.typingRow.hidden = !running;
  updateComposerActions();
  elements.sendButton.disabled = !elements.messageInput.value.trim();
  updateActivityCopy(running);
  renderQueuePanel();
}

function appendEvents(events) {
  if (!events?.length) return;
  const shouldScroll = isNearBottom();
  let changed = false;
  for (const event of events) {
    if (!event || state.events.has(event.seq)) continue;
    state.events.set(event.seq, event);
    state.lastSeq = Math.max(state.lastSeq, event.seq);
    const node = createEventNode(event);
    if (node) {
      elements.messageList.append(node);
      changed = true;
    }
  }
  updateEmptyState();
  if (changed && shouldScroll) scrollToBottom();
  scheduleConversationCache();
}

function updateTopbarTitle(conversation = state.active) {
  if (!elements.topbarTitle) return;
  const title = String(conversation?.title || "").trim() || "聊天";
  elements.topbarTitle.textContent = title;
  elements.topbarTitle.title = title;
}
function resetConversationView(conversation) {
  state.active = conversation;
  const activeAgentId = conversation?.agentId || "codex";
  try { localStorage.setItem("codex-pocket-agent", activeAgentId); } catch {}
  if (state.selectedAgentId !== activeAgentId || state.modelsAgentId !== activeAgentId) {
    state.selectedAgentId = activeAgentId;
    if (elements.agentSelect) elements.agentSelect.value = activeAgentId;
    loadAvailableModels({ force: true }).catch(() => {});
  }
  updateTopbarTitle(conversation);
  elements.workdirLabel.textContent = computerContextLabel(conversation?.workdir ? projectBaseName(conversation.workdir) : (state.config?.workdirName || "Codex"));
  state.events = new Map();
  state.lastSeq = 0;
  setQueuedMessages(conversation?.queuedMessages || []);
  elements.messageList.innerHTML = "";
  if (conversation?.events) appendEvents(conversation.events);
  updateControls();
  updateEmptyState();
  if (conversation?.id) localStorage.setItem(ACTIVE_KEY, conversation.id);
  renderConversationList();
  scheduleConversationCache();
  if (state.drawerTab === "files") renderConversationFiles().catch(() => {});
}

function setConversationLoading(visible, text = "正在加载对话…") {
  if (!elements.conversationLoadingRow) return;
  elements.conversationLoadingRow.hidden = !visible;
  if (elements.conversationLoadingText) elements.conversationLoadingText.textContent = text;
}

async function loadConversation(id) {
  const generation = ++state.loadGeneration;
  state.conversationLoadController?.abort();
  const controller = new AbortController();
  state.conversationLoadController = controller;
  let cachedConversation = null;
  if (state.active?.id !== id) {
    cachedConversation = readCachedConversation(id);
    const summary = state.conversations.find((item) => item.id === id);
    if (cachedConversation) resetConversationView(cachedConversation);
    else if (summary) resetConversationView({ ...scopeConversation(summary), events: [], queuedMessages: [] });
    elements.emptyState.hidden = true;
    setConversationLoading(true, cachedConversation ? "已显示缓存，正在同步完整对话…" : "正在加载对话…");
    scrollToBottom();
  }
  try {
    const data = await api(`/api/conversations/${id}?after=0&limit=400`, { signal: controller.signal });
    if (generation !== state.loadGeneration) return;
    state.running = data.running || data.conversation.status === "running" || data.conversation.status === "stopping" || data.conversation.status === "waiting_approval";
    const conversation = scopeConversation(data.conversation);
    conversation.queuedMessages = data.queuedMessages || [];
    resetConversationView(conversation);
    markConversationRead(id).catch(() => {});
    scrollToBottom();
    schedulePoll(800);
  } catch (error) {
    if (error.name === "AbortError") return;
    if (error.status !== 401 && !cachedConversation) showToast(error.message);
  } finally {
    if (generation === state.loadGeneration) {
      if (state.conversationLoadController === controller) state.conversationLoadController = null;
      setConversationLoading(false);
      updateEmptyState();
    }
  }
}

async function selectConversation(id) {
  closeDrawer();
  if (state.active?.id === id) return;
  await loadConversation(id);
}

async function refreshConversations() {
  if (state.refreshingConversations) return state.conversations;
  state.refreshingConversations = true;
  if (!state.conversations.length) {
    state.conversationsStatus = "loading";
    state.conversationsError = "";
    renderConversationList();
  }
  try {
    const data = await api("/api/conversations");
    state.conversations = (data.conversations || []).map(scopeConversation);
    state.conversationsStatus = "ready";
    state.conversationsError = "";
    state.lastConversationRefreshAt = Date.now();
    writeCachedBootstrap({
      ...(state.config || {}),
      conversations: state.conversations,
      globalUnread: state.globalUnread,
    });
    renderConversationList();
    return state.conversations;
  } catch (error) {
    if (!state.conversations.length) {
      state.conversationsStatus = "error";
      state.conversationsError = error.message || "加载对话失败";
      renderConversationList();
    }
    throw error;
  } finally {
    state.refreshingConversations = false;
  }
}
async function refreshConversationsWithRetry(attempts = 3) {
  let lastError = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await refreshConversations();
    } catch (error) {
      lastError = error;
      if (attempt + 1 < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
      }
    }
  }
  throw lastError || new Error("加载对话失败");
}

async function createConversation() {
  state.searchQuery = "";
  elements.conversationSearch.value = "";
  const targetAgentId = state.selectedAgentId || "codex";
  const model = !state.active || state.active.agentId === targetAgentId ? state.selectedModel : "";
  const shouldReloadModels = state.active?.agentId !== targetAgentId;
  const data = await api("/api/conversations", {
    method: "POST",
    body: JSON.stringify({
      projectPath: elements.projectSelect.value || state.selectedProjectPath,
      agentId: targetAgentId,
      model: model || undefined,
    }),
  });
  const conversation = scopeConversation(data.conversation);
  state.conversations = [conversation, ...state.conversations];
  state.running = false;
  resetConversationView(conversation);
  if (shouldReloadModels) await loadAvailableModels({ force: true });
  closeDrawer();
  elements.messageInput.focus();
  return conversation;
}

async function deleteConversation(conversation) {
  if (!confirm(`永久删除“${conversation.title}”？\n\n这会删除口袋中的对话记录，无法恢复。电脑上的 Codex 原始会话不会删除。`)) return;
  try {
    await api(`/api/conversations/${conversation.id}`, { method: "DELETE" });
    state.conversations = state.conversations.filter((item) => item.id !== conversation.id);
    if (state.active?.id === conversation.id) {
      state.active = null;
      state.events = new Map();
      state.lastSeq = 0;
      elements.messageList.innerHTML = "";
      localStorage.removeItem(ACTIVE_KEY);
      if (state.conversations[0]) await loadConversation(state.conversations[0].id);
      else resetConversationView(null);
    } else {
      renderConversationList();
    }
  } catch (error) {
    if (error.status !== 401) showToast(error.message);
  }
}

function beginOptimisticMediaUpload(file, kind, conversationId) {
  if (!file || !conversationId) return null;
  const objectUrl = URL.createObjectURL(file);
  const event = {
    type: "media",
    role: "user",
    kind,
    inline: true,
    userMedia: true,
    pending: true,
    localUpload: true,
    url: objectUrl,
    fileName: file.name || (kind === "video" ? "手机视频" : "手机图片"),
    mimeType: file.type || "",
    size: file.size || 0,
    caption: kind === "video" ? "手机视频" : "手机图片",
    conversationId,
  };
  const node = createMediaEvent(event);
  node.dataset.localUpload = "1";
  node.classList.add("pending-upload");
  elements.messageList.append(node);
  elements.emptyState.hidden = true;
  scrollToBottom();
  return { event, node, objectUrl };
}

function finishOptimisticMediaUpload(optimistic, serverEvent) {
  if (!optimistic) return;
  const node = optimistic.node;
  if (node?.isConnected) node.remove();
  if (optimistic.objectUrl) URL.revokeObjectURL(optimistic.objectUrl);
  if (serverEvent) appendEvents([serverEvent]);
  scrollToBottom();
}

function failOptimisticMediaUpload(optimistic) {
  if (!optimistic) return;
  if (optimistic.node?.isConnected) optimistic.node.remove();
  if (optimistic.objectUrl) URL.revokeObjectURL(optimistic.objectUrl);
  updateEmptyState();
}

async function uploadConversationMedia(file, kind = "image") {
  if (!file) return;
  const isVideo = kind === "video";
  const isFile = kind === "file";
  const mediaLabel = isFile ? "文件" : isVideo ? "视频" : "图片";
  if (!isFile) {
    const prefix = isVideo ? "video" : "image";
    if (!String(file.type || "").startsWith(`${prefix}/`)) {
      showToast(isVideo ? "请选择视频文件" : "请选择图片文件");
      return;
    }
  }
  const limitMb = isFile ? 200 : isVideo ? 150 : 20;
  if (file.size > limitMb * 1024 * 1024) {
    showToast(`${mediaLabel}不能超过 ${limitMb} MB`);
    return;
  }
  let conversation = state.active;
  let optimistic = null;
  try {
    if (!conversation) conversation = await createConversation();
    const caption = elements.messageInput.value.trim();
    optimistic = beginOptimisticMediaUpload(file, kind, conversation.id);
    showToast(`${mediaLabel}已显示，正在传到电脑…`);
    const endpoint = isFile ? "files" : isVideo ? "videos" : "photos";
    const fallbackName = file.name || `phone-${Date.now()}.${isFile ? "bin" : isVideo ? "mp4" : "jpg"}`;
    const response = await fetch(
      `/api/conversations/${conversation.id}/${endpoint}?name=${encodeURIComponent(file.name || fallbackName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
        cache: "no-store",
      },
    );
    if (response.status === 401) {
      failOptimisticMediaUpload(optimistic);
      optimistic = null;
      localStorage.removeItem(TOKEN_KEY);
      state.token = "";
      showPairing("配对已失效，请重新输入链接或令牌。");
      return;
    }
    const uploaded = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(uploaded.error || `${mediaLabel}上传失败（${response.status}）`);
    if (state.active?.id === conversation.id) finishOptimisticMediaUpload(optimistic, uploaded.event);
    else if (optimistic?.objectUrl) URL.revokeObjectURL(optimistic.objectUrl);
    optimistic = null;
    elements.messageInput.value = "";
    resizeComposer();
    const prompt = isFile
      ? [
          caption || `请查看并处理这个文件：${uploaded.fileName}`,
          "",
          `用户通过手机发送了一个文件，已保存到电脑项目文件夹：${uploaded.path}`,
          "请通过电脑本地文件工具读取这个路径，并根据文件类型进行处理。无法处理的格式请明确说明。",
        ].join("\n")
      : isVideo
        ? [
            caption || "请查看并处理这段视频。",
            "",
            `用户通过手机发送了一段视频，已保存到电脑项目文件夹：${uploaded.path}`,
            "请通过电脑本地文件工具读取这个路径。如果当前模型不能直接识别视频，请使用本地工具提取画面、音频或其他信息，并明确告知无法处理的部分。",
          ].join("\n")
        : [
            caption || "请查看这张图片并处理其中的内容。",
            "",
            `用户通过手机发送了一张图片，已保存到电脑项目文件夹：${uploaded.path}`,
            "请通过电脑本地文件工具读取这个路径。如果当前模型不能直接识别图片，请根据本地文件进行分析、OCR 或调用合适工具。",
          ].join("\n");
    state.running = true;
    updateControls();
    const data = await api(`/api/conversations/${conversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify({ text: prompt, model: state.selectedModel || undefined, approvalPolicy: state.approvalPolicy }),
    });
    if (data.steered) showToast(`${mediaLabel}已传到电脑，并已引导当前任务`);
    else if (data.queued) {
      setQueuedMessages(data.queuedMessages || []);
      showToast(`${mediaLabel}已传到电脑，消息已排队`);
    } else {
      showToast(`${mediaLabel}已传到电脑并发送给 Codex`);
    }
    schedulePoll(180);
  } catch (error) {
    failOptimisticMediaUpload(optimistic);
    optimistic = null;
    if (error.status !== 401) showToast(error.message || `${mediaLabel}发送失败`);
    state.running = Boolean(state.active?.status === "running" || state.active?.status === "waiting_approval");
    updateControls();
  } finally {
    if (elements.photoInput) elements.photoInput.value = "";
    if (elements.cameraInput) elements.cameraInput.value = "";
    if (elements.videoInput) elements.videoInput.value = "";
    if (elements.fileInput) elements.fileInput.value = "";
    if (elements.attachmentMenu) elements.attachmentMenu.hidden = true;
  }
}

async function uploadConversationPhoto(file) {
  return uploadConversationMedia(file, "image");
}

async function uploadConversationVideo(file) {
  return uploadConversationMedia(file, "video");
}

async function uploadConversationFile(file) {
  return uploadConversationMedia(file, "file");
}

async function sendMessage() {
  const text = elements.messageInput.value.trim();
  if (!text) return;

  try {
    let conversation = state.active;
    if (!conversation) conversation = await createConversation();
    const wasRunning = state.running;
    state.running = true;
    updateControls();
    elements.messageInput.value = "";
    resizeComposer();
    const data = await api(`/api/conversations/${conversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify({ text, model: state.selectedModel || undefined, approvalPolicy: state.approvalPolicy }),
    });
    if (data.steered) {
      showToast("已引导当前任务");
    } else if (data.queued) {
      setQueuedMessages(data.queuedMessages || []);
      showToast("当前回合无法引导，消息已排队");
    }
    if (state.active?.id === conversation.id) {
      state.running = wasRunning || !data.queued || state.active?.status === "running";
      updateControls();
      schedulePoll(120);
    }
  } catch (error) {
    state.running = Boolean(state.active?.status === "running" || state.active?.status === "waiting_approval");
    updateControls();
    if (error.status !== 401) showToast(error.message);
  }
}

async function stopCurrentTask() {
  if (elements.attachmentMenu) elements.attachmentMenu.hidden = true;
  if (!state.active) return;
  try {
    await api(`/api/conversations/${state.active.id}/stop`, { method: "POST" });
    showToast("正在停止任务…");
    schedulePoll(300);
  } catch (error) {
    if (error.status !== 401) showToast(error.message);
  }
}

async function pollActiveConversation() {
  if (state.polling || !state.active) return;
  state.polling = true;
  const generation = state.loadGeneration;
  const conversationId = state.active.id;
  try {
    const after = state.lastSeq;
    const data = await api(`/api/conversations/${conversationId}?after=${after}`);
    if (generation !== state.loadGeneration || state.active?.id !== conversationId) return;
    const wasRunning = state.running;
    state.active = scopeConversation(data.conversation);
    updateTopbarTitle(state.active);
    state.running = data.running || data.conversation.status === "running" || data.conversation.status === "stopping" || data.conversation.status === "waiting_approval";
    setQueuedMessages(data.queuedMessages || []);
    appendEvents(data.conversation.events);
    if (wasRunning && !state.running) {
      sendBrowserNotification("completion", "Codex 已完成", `${state.identity.codexName} 已处理完当前任务`);
    }
    updateControls();
    const index = state.conversations.findIndex((item) => item.id === conversationId);
    if (index >= 0) state.conversations[index] = scopeConversation(data.conversation);
    renderConversationList();
    if (document.visibilityState === "visible" && state.active?.id === conversationId && data.conversation.unreadCount > 0) {
      markConversationRead(conversationId).catch(() => {});
    }
    setConnection("online", "在线");
    scheduleConversationCache();
    writeCachedBootstrap({
      ...(state.config || {}),
      conversations: state.conversations,
      globalUnread: state.globalUnread,
    });
  } catch (error) {
    if (error.status !== 401) {
      setConnection("", "等待重连");
      console.warn(error);
    }
  } finally {
    state.polling = false;
    schedulePoll(state.running ? 900 : 2000);
  }
}

function schedulePoll(delay) {
  clearTimeout(state.pollTimer);
  if (!state.active) return;
  state.pollTimer = setTimeout(pollActiveConversation, delay);
}

function reconnectEventStream(delay = 1200) {
  clearTimeout(state.eventReconnectTimer);
  state.eventReconnectTimer = setTimeout(connectEventStream, delay);
}

function handleRealtimeMessage(message) {
  if (!message || message.type === "heartbeat") return;
  if (message.type === "queue") {
    if (message.conversationId === state.active?.id) {
      setQueuedMessages(message.queuedMessages || []);
      updateControls();
    }
    return;
  }
  if (message.type === "unread") {
    const count = Number(message.count);
    if (Number.isFinite(count) && count >= 0) {
      state.globalUnread = count;
      updateUnreadBadge();
    }
    return;
  }
  if (message.type === "approval") {
    showApprovalAlert(message);
    showToast(`需要权限审核：${message.title || "Codex 正在等待确认"}`);
    sendBrowserNotification("approval", "Codex 需要权限确认", message.title || "打开口袋处理权限审核");
    refreshConversations().catch(() => {});
    if (state.active?.id === message.conversationId) schedulePoll(40);
    else if (document.hidden) document.title = "口袋 · 待确认";
    return;
  }
  if (message.type !== "conversation") return;
  const conversation = state.conversations.find((item) => item.id === message.id);
  if (message.archivedAt) {
    state.conversations = state.conversations.filter((item) => item.id !== message.id);
    renderConversationList();
    if (state.active?.id === message.id) {
      state.active = null;
      if (state.conversations[0]) loadConversation(state.conversations[0].id).catch(() => {});
      else resetConversationView(null);
    }
    return;
  }
  if (conversation) {
    conversation.status = message.status;
    conversation.updatedAt = message.updatedAt;
    conversation.lastSeq = message.lastSeq;
    conversation.unreadCount = message.unreadCount ?? conversation.unreadCount ?? 0;
    renderConversationList();
    writeCachedBootstrap({
      ...(state.config || {}),
      conversations: state.conversations,
      globalUnread: state.globalUnread,
    });
    scheduleConversationCache();
    if (state.active?.id === message.id && conversation.unreadCount > 0) markConversationRead(conversation.id).catch(() => {});
  } else {
    refreshConversations().catch(() => {});
  }
  if (state.active?.id === message.id) schedulePoll(40);
}

function connectEventStream() {
  if (typeof WebSocket === "function") {
    connectWebSocket();
    return;
  }
  connectSseFallback();
}

function connectWebSocket() {
  if (state.eventSocket && (state.eventSocket.readyState === WebSocket.OPEN || state.eventSocket.readyState === WebSocket.CONNECTING)) return;
  if (state.eventAbort) {
    state.eventAbort.abort();
    state.eventAbort = null;
  }
  const scheme = location.protocol === "https:" ? "wss:" : "ws:";
  let socket;
  try {
    socket = new WebSocket(`${scheme}//${location.host}/api/ws`, ["codex-pocket-v1", state.token]);
  } catch {
    connectSseFallback();
    return;
  }
  state.eventSocket = socket;
  socket.addEventListener("open", () => {
    state.lastApiSuccessAt = Date.now();
    setConnection("online", "在线");
    refreshConversationsWithRetry(2).catch(() => {});
  });
  socket.addEventListener("message", (event) => {
    state.lastApiSuccessAt = Date.now();
    try {
      handleRealtimeMessage(JSON.parse(event.data));
    } catch {}
  });
  socket.addEventListener("close", () => {
    if (state.eventSocket !== socket) return;
    state.eventSocket = null;
    const apiHealthy = Date.now() - state.lastApiSuccessAt < 15_000;
    setConnection(apiHealthy ? "online" : "", apiHealthy ? "在线" : "等待重连");
    checkHealth();
    reconnectEventStream(apiHealthy ? 900 : 2200);
  });
  socket.addEventListener("error", () => {
    try { socket.close(); } catch {}
  });
}

async function connectSseFallback() {
  if (state.eventAbort) state.eventAbort.abort();
  const controller = new AbortController();
  state.eventAbort = controller;
  try {
    const response = await fetch("/api/events", {
      headers: { Authorization: `Bearer ${state.token}` },
      signal: controller.signal,
      cache: "no-store",
    });
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      state.token = "";
      showPairing("配对已失效，请重新输入链接或令牌。");
      return;
    }
    if (!response.ok || !response.body) throw new Error(`实时通道失败（${response.status}）`);
    state.lastApiSuccessAt = Date.now();
    setConnection("online", "在线");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = buffer.indexOf("\n\n")) >= 0) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const data = block.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
        if (!data) continue;
        try {
          handleRealtimeMessage(JSON.parse(data));
        } catch {}
      }
    }
    if (!controller.signal.aborted) reconnectEventStream(1000);
  } catch (error) {
    if (!controller.signal.aborted) {
      const apiHealthy = Date.now() - state.lastApiSuccessAt < 15_000;
      setConnection(apiHealthy ? "online" : "", apiHealthy ? "在线" : "等待重连");
      reconnectEventStream(1800);
    }
  }
}
async function checkHealth() {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    if (!response.ok) throw new Error("offline");
    state.lastApiSuccessAt = Date.now();
    setConnection("online", "在线");
    refreshGlobalUnread().catch(() => {});
  } catch {
    setConnection("", "等待重连");
  }
}

function resizeComposer() {
  elements.messageInput.style.height = "auto";
  elements.messageInput.style.height = `${Math.min(elements.messageInput.scrollHeight, 150)}px`;
  elements.sendButton.disabled = !elements.messageInput.value.trim();
  updateComposerActions();
}

function openDrawer() {
  elements.drawer.classList.add("open");
  elements.drawer.setAttribute("aria-hidden", "false");
  elements.drawerBackdrop.hidden = wideDrawerMedia.matches;
  void refreshAgentAvailability();
  const stale = Date.now() - state.lastConversationRefreshAt > 4000 || !state.conversations.length;
  if (stale) {
    refreshConversationsWithRetry(2).catch((error) => {
      if (error.status !== 401) showToast(error.message || "加载对话失败");
    });
  }
}

function closeDrawer() {
  closeConversationSwipes();
  if (wideDrawerMedia.matches) {
    elements.drawer.classList.add("open");
    elements.drawer.setAttribute("aria-hidden", "false");
    elements.drawerBackdrop.hidden = true;
    return;
  }
  elements.drawer.classList.remove("open");
  elements.drawer.setAttribute("aria-hidden", "true");
  elements.drawerBackdrop.hidden = true;
}

function openInfo() {
  closeDrawer();
  updateComputerProfileUi();
  elements.infoWorkdir.textContent = state.active?.workdir || state.config?.workdir || "—";
  elements.infoProjects.textContent = state.projects.map((project) => `${project.name}: ${project.path}`).join("\n") || "—";
  elements.infoSandbox.textContent = state.config?.sandbox || "—";
  elements.infoTransport.textContent = state.config?.transport === "app-server" ? "共享 app-server（同线程）" : "独立 exec";
  elements.infoPublicUrl.textContent = state.config?.publicUrl || location.origin;
  elements.infoDialog.showModal();
}

function formatSessionTime(value) {
  try {
    return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  } catch {
    return "";
  }
}

function renderImportSessions(sessions) {
  elements.importSessionList.innerHTML = "";
  if (!sessions.length) {
    const empty = document.createElement("div");
    empty.className = "import-empty";
    empty.textContent = "没有找到可导入的 Codex 对话。";
    elements.importSessionList.append(empty);
    return;
  }

  for (const session of sessions) {
    const row = document.createElement("div");
    row.className = "import-session";
    const main = document.createElement("div");
    main.className = "import-session-main";
    const title = document.createElement("strong");
    title.textContent = session.title || "Codex 对话";
    const meta = document.createElement("small");
    const project = projectBaseName(session.cwd) || "无项目";
    const model = session.modelProvider ? ` · ${session.modelProvider}` : "";
    meta.textContent = `${project}${model} · ${formatSessionTime(session.updatedAt)}`;
    meta.title = session.cwd || "";
    main.append(title, meta);
    row.append(main);

    if (session.importedConversationId) {
      const badge = document.createElement("span");
      badge.className = "imported-badge";
      badge.textContent = "已导入";
      row.append(badge);
    } else {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "导入";
      button.addEventListener("click", () => importCodexSession(session, button));
      row.append(button);
    }
    elements.importSessionList.append(row);
  }
}

async function openImportDialog() {
  closeDrawer();
  elements.importStatus.textContent = "正在读取电脑上的 Codex 对话…";
  elements.importSessionList.innerHTML = "";
  elements.importDialog.showModal();
  try {
    const data = await api("/api/codex-sessions?limit=40");
    elements.importStatus.textContent = "";
    renderImportSessions(data.sessions || []);
  } catch (error) {
    if (error.status !== 401) elements.importStatus.textContent = error.message;
  }
}

async function importCodexSession(session, button) {
  button.disabled = true;
  button.textContent = "导入中";
  elements.importStatus.textContent = "";
  try {
    const data = await api("/api/codex-sessions/import", {
      method: "POST",
      body: JSON.stringify({ sessionId: session.id }),
    });
    const conversation = scopeConversation(data.conversation);
    const index = state.conversations.findIndex((item) => item.id === conversation.id);
    if (index >= 0) state.conversations[index] = conversation;
    else state.conversations.unshift(conversation);
    state.running = false;
    elements.importDialog.close();
    resetConversationView(conversation);
    scrollToBottom();
    schedulePoll(4500);
    showToast(data.alreadyImported ? "这个对话已经导入过" : "Codex 对话已导入");
  } catch (error) {
    button.disabled = false;
    button.textContent = "重试";
    if (error.status !== 401) elements.importStatus.textContent = error.message;
  }
}
const VOICE_MIN_DURATION_MS = 800;
const VOICE_MAX_DURATION_MS = 60_000;
const VOICE_CANCEL_ARM_PX = 82;
const VOICE_CANCEL_RESET_PX = 52;
const VOICE_FAN_OPEN_PX = 58;
const VOICE_FAN_CLOSE_PX = 24;
const VOICE_MIC_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>';
const VOICE_KEYBOARD_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 9.5h.01M10.5 9.5h.01M14 9.5h.01M17 9.5h.01M7 13h.01M10.5 13h.01M14 13h.01M17 13h.01M8 16h8"/></svg>';

function preferredAudioMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || "";
}

function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mimeType || "audio/mp4" });
}

function formatVoiceDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function nativeVoiceMessage(message) {
  const text = String(message || "").replace(/^error:/i, "").trim();
  return text || "无法使用语音输入";
}

function applyVoiceLevel(level) {
  const normalized = Math.max(0, Math.min(1, (Number(level) + 2) / 12));
  state.voiceLevel = normalized;
  elements.voiceRecordingCard?.style.setProperty("--voice-level", String(normalized));
  elements.voiceRecordingCard?.style.setProperty("--voice-scale", String(0.55 + normalized * 0.75));
}

function showVoiceOverlay(mode, hint, liveText = "") {
  if (!elements.voiceOverlay) return;
  elements.voiceOverlay.hidden = false;
  elements.voiceOverlay.style.display = "flex";
  const card = elements.voiceRecordingCard;
  const recordingMode = mode === "recording";
  card?.classList.toggle("cancel", mode === "cancel" || (recordingMode && state.voiceCancelArmed));
  card?.classList.toggle("transcribe", recordingMode && state.voiceTranscribeArmed);
  card?.classList.toggle("fan-open", recordingMode && state.voiceFanOpen);
  card?.classList.toggle("processing", mode === "processing");
  card?.classList.toggle("ready", mode === "ready");
  if (elements.voiceOverlayHint) elements.voiceOverlayHint.textContent = hint;
  if (elements.voiceRecordingTime) elements.voiceRecordingTime.hidden = mode === "processing" || mode === "ready";
  if (elements.voiceLiveText) {
    elements.voiceLiveText.hidden = !liveText;
    elements.voiceLiveText.textContent = liveText;
  }
}

function hideVoiceOverlay() {
  if (elements.voiceOverlay) {
    elements.voiceOverlay.hidden = true;
    elements.voiceOverlay.style.display = "none";
  }
  elements.voiceRecordingCard?.classList.remove("cancel", "transcribe", "fan-open", "processing", "ready");
  elements.voiceRecordingCard?.style.setProperty("--voice-level", "0");
  elements.voiceRecordingCard?.style.setProperty("--voice-scale", "0.35");
  if (elements.voiceLiveText) elements.voiceLiveText.textContent = "";
}

function startVoiceTicker() {
  clearInterval(state.voiceTimer);
  state.voiceTimerStartedAt = Date.now();
  if (elements.voiceRecordingTime) elements.voiceRecordingTime.textContent = "0:00";
  state.voiceTimer = setInterval(() => {
    if (!state.voiceActive) return;
    const elapsed = Date.now() - state.voiceTimerStartedAt;
    if (elements.voiceRecordingTime) {
      elements.voiceRecordingTime.textContent = formatVoiceDuration(elapsed);
      elements.voiceRecordingTime.classList.toggle("ending", elapsed >= VOICE_MAX_DURATION_MS - 10_000);
    }
    if (elapsed >= VOICE_MAX_DURATION_MS) finishVoiceSession("voice").catch(() => {});
  }, 100);
}

function stopVoiceTicker() {
  clearInterval(state.voiceTimer);
  state.voiceTimer = null;
  elements.voiceRecordingTime?.classList.remove("ending");
}

function setVoiceFanOpen(open) {
  const next = Boolean(open);
  if (state.voiceFanOpen === next) return;
  state.voiceFanOpen = next;
  elements.voiceRecordingCard?.classList.toggle("fan-open", next);
  if (!next) setVoiceGesture("");
  if (elements.voiceOverlayHint) {
    elements.voiceOverlayHint.textContent = next
      ? "松开发送语音 · 左右选择取消或转文字"
      : "按住说话，上滑取消或转文字";
  }
}

function setVoiceGesture(gesture) {
  const next = gesture === "cancel" || gesture === "text" ? gesture : "";
  if (
    state.voiceCancelArmed === (next === "cancel") &&
    state.voiceTranscribeArmed === (next === "text")
  ) return;
  state.voiceCancelArmed = next === "cancel";
  state.voiceTranscribeArmed = next === "text";
  elements.voiceRecordingCard?.classList.toggle("cancel", next === "cancel");
  elements.voiceRecordingCard?.classList.toggle("transcribe", next === "text");
  if (elements.voiceOverlayHint) {
    elements.voiceOverlayHint.textContent = next === "cancel"
      ? "松开手指，取消发送"
      : next === "text"
        ? "松开手指，转成文字"
        : state.voiceFanOpen
          ? "松开发送语音 · 左右选择取消或转文字"
          : "按住说话，上滑取消或转文字";
  }
}
function updateVoiceModeIcon() {
  if (!elements.micButton) return;
  elements.micButton.innerHTML = state.voiceMode ? VOICE_KEYBOARD_ICON : VOICE_MIC_ICON;
  elements.micButton.classList.toggle("voice-mode", state.voiceMode);
  elements.micButton.setAttribute("aria-label", state.voiceMode ? "切换到键盘输入" : "切换到语音输入");
}

function setVoiceMode(enabled) {
  if (state.voiceProcessing || state.voiceActive) return;
  state.voiceMode = Boolean(enabled && state.recognition);
  updateVoiceModeIcon();
  updateComposerActions();
  if (state.voiceMode) {
    elements.messageInput.blur();
  } else {
    elements.messageInput.focus();
  }
}

function isGarbledTranscript(text) {
  const value = String(text || "");
  const replacements = (value.match(/\uFFFD/g) || []).length;
  return replacements >= 2
    || /锟斤拷|烫烫烫|屯屯屯/.test(value)
    || /[ÃÂâ][\u0080-\u00FF]/.test(value);
}
function clearVoiceSessionUi() {
  stopVoiceTicker();
  clearTimeout(state.voiceReleaseTimer);
  state.voiceReleaseTimer = null;
  state.voiceActive = false;
  state.voiceProcessing = false;
  state.voiceReleased = false;
  state.voiceCancelArmed = false;
  state.voiceTranscribeArmed = false;
  state.voiceFanOpen = false;
  state.voiceFinalTranscript = "";
  state.voicePartialTranscript = "";
  state.voiceSpeechActive = false;
  state.nativeVoiceActive = false;
  state.nativeVoicePending = false;
  state.voiceLevel = 0;
  state.voiceDurationMs = 0;
  state.voiceUploading = false;
  hideVoiceOverlay();
  updateComposerActions();
}

function cancelActiveVoiceSession() {
  const bridge = window.CodexPocketNative;
  if (state.voiceEngine === "native-speech") {
    try { bridge?.cancelSpeechRecognition?.(); } catch {}
  } else if (state.voiceEngine === "native-recorder") {
    try { bridge?.cancelVoiceRecording?.(); } catch {}
  } else if (state.voiceEngine === "web-recorder") {
    cancelWebVoiceRecorder();
  }
}

function failVoiceSession(message) {
  const previousEngine = state.voiceEngine;
  const text = nativeVoiceMessage(message);
  cancelActiveVoiceSession();
  clearVoiceSessionUi();
  if (
    previousEngine === "native-speech" &&
    /(不支持|不可用|未就绪|没有开放|乱码)/.test(text) &&
    typeof window.CodexPocketNative?.startVoiceRecording === "function"
  ) {
    state.voiceTextEngine = "native-recorder";
    state.voiceEngine = "native-recorder";
    elements.micButton.title = "长按发语音，上滑展开取消或转文字";
    showToast(`${text}，下次将使用电脑识别`);
    return;
  }
  showToast(text);
}

async function transcribeVoiceBlob(blob, mimeType) {
  state.voiceUploading = true;
  updateComposerActions();
  try {
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.token}`,
        "Content-Type": mimeType || blob.type || "application/octet-stream",
      },
      body: blob,
      cache: "no-store",
    });
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      state.token = "";
      showPairing("配对已失效，请重新输入链接或令牌。");
      throw new Error("配对已失效");
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `电脑语音识别失败（${response.status}）`);
    const transcript = String(data.text || "").trim();
    if (!transcript) throw new Error("没有识别到语音，请重新录制");
    return transcript;
  } finally {
    state.voiceUploading = false;
    updateComposerActions();
  }
}

async function completeVoiceTranscript(transcript) {
  const text = String(transcript || "").trim();
  if (!text) {
    failVoiceSession("没有识别到语音，请重新录制");
    return;
  }
  clearTimeout(state.voiceReleaseTimer);
  state.voiceReleaseTimer = null;
  state.voiceProcessing = true;
  state.voiceActive = false;
  showVoiceOverlay("ready", "识别完成，正在发送…", text);
  updateComposerActions();
  await new Promise((resolve) => setTimeout(resolve, 180));
  clearVoiceSessionUi();
  elements.messageInput.value = text;
  resizeComposer();
  await sendMessage();
}

async function processVoiceBlob(blob, mimeType) {
  try {
    const transcript = await transcribeVoiceBlob(blob, mimeType);
    await completeVoiceTranscript(transcript);
  } catch (error) {
    failVoiceSession(error.message || "电脑语音识别失败");
  }
}

async function sendDirectVoiceMessage(blob, mimeType, durationMs) {
  state.voiceActive = false;
  state.voiceProcessing = true;
  state.voiceUploading = true;
  showVoiceOverlay("processing", "正在发送语音…");
  updateComposerActions();
  let uploaded = false;
  try {
    const conversation = state.active || await createConversation();
    const response = await fetch(
      `/api/conversations/${conversation.id}/voice?durationMs=${Math.max(0, Math.round(durationMs || 0))}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": mimeType || blob.type || "audio/mp4",
        },
        body: blob,
        cache: "no-store",
      },
    );
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      state.token = "";
      showPairing("配对已失效，请重新输入链接或令牌。");
      throw new Error("配对已失效");
    }
    const uploadedData = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(uploadedData.error || `语音上传失败（${response.status}）`);
    uploaded = true;
    const seconds = Math.max(1, Math.round((durationMs || 0) / 1000));
    const prompt = [
      `用户通过口袋发送了一条 ${seconds} 秒的语音消息。`,
      `音频文件位于电脑本地：${uploadedData.path}`,
      "用户选择了直接发送语音，没有要求显示自动转写文字。",
      "如果当前模型或本地工具能够读取音频，请直接处理；否则不要猜测语音内容，明确告知无法直接读取并等待用户补充文字。",
    ].join("\n");
    const sent = await api(`/api/conversations/${conversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify({
        text: prompt,
        displayText: "语音消息",
        hidden: true,
        model: state.selectedModel || undefined,
        approvalPolicy: state.approvalPolicy,
      }),
    });
    clearVoiceSessionUi();
    if (sent.steered) showToast("语音消息已发送，并已引导当前任务");
    else if (sent.queued) {
      setQueuedMessages(sent.queuedMessages || []);
      showToast("语音消息已发送，正等待电脑处理");
    } else {
      showToast("语音消息已发送到电脑");
    }
    schedulePoll(120);
  } catch (error) {
    clearVoiceSessionUi();
    schedulePoll(180);
    showToast(uploaded
      ? `语音已保存到电脑，但发送给 Codex 失败：${error.message}`
      : (error.message || "语音发送失败"));
  } finally {
    state.voiceUploading = false;
    updateComposerActions();
  }
}
async function startNativeRecorderCapture() {
  const bridge = state.nativeVoiceBridge || window.CodexPocketNative;
  const result = String(bridge?.startVoiceRecording?.() || "");
  if (result === "started") {
    state.nativeVoiceActive = true;
    state.nativeVoicePending = false;
    showVoiceOverlay("recording", "按住说话 · 上滑取消或转文字");
    return;
  }
  if (result === "permission") {
    state.nativeVoicePending = true;
    showVoiceOverlay("recording", "请允许麦克风权限，然后重新按住说话");
    return;
  }
  throw new Error(nativeVoiceMessage(result));
}

async function startWebVoiceRecorder() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    throw new Error("当前设备不支持录音");
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
  if (!state.voiceActive) {
    for (const track of stream.getTracks()) track.stop();
    return;
  }
  const mimeType = preferredAudioMimeType();
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  state.voiceStream = stream;
  state.voiceRecorder = recorder;
  state.voiceChunks = [];
  recorder.addEventListener("dataavailable", (event) => {
    if (event.data?.size) state.voiceChunks.push(event.data);
  });
  recorder.addEventListener("error", () => failVoiceSession("录音失败，请重试"));
  recorder.start(250);
  showVoiceOverlay("recording", "按住说话 · 上滑取消或转文字");
}

function stopWebVoiceRecorder() {
  const recorder = state.voiceRecorder;
  const stream = state.voiceStream;
  if (!recorder || recorder.state !== "recording") return Promise.reject(new Error("没有正在进行的录音"));
  return new Promise((resolve, reject) => {
    recorder.addEventListener("stop", () => {
      const type = recorder.mimeType || preferredAudioMimeType() || "audio/webm";
      const blob = new Blob(state.voiceChunks, { type });
      for (const track of stream?.getTracks?.() || []) track.stop();
      state.voiceRecorder = null;
      state.voiceStream = null;
      state.voiceChunks = [];
      if (!blob.size) reject(new Error("没有录到声音，请重试"));
      else resolve(blob);
    }, { once: true });
    recorder.stop();
  });
}

function cancelWebVoiceRecorder() {
  const recorder = state.voiceRecorder;
  if (recorder?.state === "recording") {
    try { recorder.stop(); } catch {}
  }
  for (const track of state.voiceStream?.getTracks?.() || []) track.stop();
  state.voiceRecorder = null;
  state.voiceStream = null;
  state.voiceChunks = [];
}

async function startVoiceSession() {
  if (!state.voiceMode || state.voiceProcessing || state.voiceUploading || state.voiceActive) return;
  state.voiceActive = true;
  state.voiceProcessing = false;
  state.voiceReleased = false;
  state.voiceCancelArmed = false;
  state.voiceTranscribeArmed = false;
  state.voiceFanOpen = false;
  state.voiceFinalTranscript = "";
  state.voicePartialTranscript = "";
  state.voiceSpeechActive = false;
  state.nativeVoiceActive = false;
  state.nativeVoicePending = false;
  applyVoiceLevel(-2);
  startVoiceTicker();
  showVoiceOverlay("recording", "正在启动麦克风…");
  updateComposerActions();
  try {
    if (state.voiceEngine === "native-speech") {
      const bridge = window.CodexPocketNative;
      const result = String(bridge.startSpeechRecognition() || "");
      if (result === "unavailable") {
        state.voiceEngine = "native-recorder";
        showToast("手机语音识别不可用，已切换到电脑识别");
        await startNativeRecorderCapture();
      } else if (result !== "starting") {
        throw new Error(nativeVoiceMessage(result));
      }
    } else if (state.voiceEngine === "native-recorder") {
      await startNativeRecorderCapture();
    } else if (state.voiceEngine === "web-recorder") {
      await startWebVoiceRecorder();
    } else {
      throw new Error("没有可用的语音输入方式");
    }
    if (state.voiceActive) showVoiceOverlay("recording", "按住说话 · 上滑取消或转文字");
  } catch (error) {
    failVoiceSession(error.message);
  }
}

async function finishVoiceSession(gesture = "voice") {
  if (state.voiceReleased || (!state.voiceActive && !state.voiceProcessing)) return;
  state.voiceReleased = true;
  stopVoiceTicker();
  const elapsed = Date.now() - state.voiceTimerStartedAt;
  const cancel = gesture === "cancel";
  const transcribe = gesture === "text";
  state.voiceDurationMs = elapsed;
  const tooShort = elapsed < VOICE_MIN_DURATION_MS;
  if (cancel || tooShort) {
    cancelActiveVoiceSession();
    clearVoiceSessionUi();
    showToast(cancel ? "已取消语音" : "说话时间太短");
    return;
  }

  if (state.voiceEngine === "native-speech") {
    if (!state.voiceSpeechActive && !state.voiceFinalTranscript && !state.voicePartialTranscript) {
      cancelActiveVoiceSession();
      clearVoiceSessionUi();
      showToast("手机语音识别尚未启动，请再试一次");
      return;
    }
    state.voiceActive = false;
    state.voiceProcessing = true;
    showVoiceOverlay("processing", "正在转文字…", state.voicePartialTranscript);
    updateComposerActions();
    if (state.voiceFinalTranscript) {
      await completeVoiceTranscript(state.voiceFinalTranscript);
      return;
    }
    try { window.CodexPocketNative.stopSpeechRecognition(); } catch {}
    clearTimeout(state.voiceReleaseTimer);
    state.voiceReleaseTimer = setTimeout(() => {
      if (state.voiceProcessing) failVoiceSession("手机语音识别超时，请重试");
    }, 12_000);
    return;
  }

  if (state.voiceEngine === "native-recorder") {
    if (!state.nativeVoiceActive) {
      cancelActiveVoiceSession();
      clearVoiceSessionUi();
      showToast(state.nativeVoicePending ? "麦克风权限开启后，请重新按住说话" : "录音尚未启动，请重试");
      return;
    }
    state.voiceActive = false;
    state.voiceProcessing = true;
    showVoiceOverlay("processing", transcribe ? "正在转文字…" : "正在发送语音…");
    updateComposerActions();
    let result;
    try {
      result = JSON.parse(String(window.CodexPocketNative.stopVoiceRecording() || "{}"));
    } catch {
      result = { ok: false, error: "录音文件读取失败" };
    }
    state.nativeVoiceActive = false;
    if (!result.ok) {
      failVoiceSession(result.error || "没有录到声音");
      return;
    }
    try {
      const blob = base64ToBlob(result.data, result.mimeType || "audio/mp4");
      if (!transcribe) {
        await sendDirectVoiceMessage(blob, result.mimeType || "audio/mp4", elapsed);
      } else {
        await processVoiceBlob(blob, result.mimeType || "audio/mp4");
      }
    } catch {
      failVoiceSession("录音文件解析失败");
    }
    return;
  }

  if (state.voiceEngine === "web-recorder") {
    state.voiceActive = false;
    state.voiceProcessing = true;
    showVoiceOverlay("processing", transcribe ? "正在转文字…" : "正在发送语音…");
    updateComposerActions();
    try {
      const blob = await stopWebVoiceRecorder();
      if (!transcribe) {
        await sendDirectVoiceMessage(blob, blob.type, elapsed);
      } else {
        await processVoiceBlob(blob, blob.type);
      }
    } catch (error) {
      failVoiceSession(error.message);
    }
  }
}

function bindVoiceMode() {
  state.nativeVoiceBridge = window.CodexPocketNative;
  elements.micButton.hidden = false;
  updateVoiceModeIcon();
  updateComposerActions();

  window.onNativeSpeechResult = (type, message) => {
    const value = String(message || "");
    if (type === "start") {
      state.voiceSpeechActive = true;
      if (!state.voiceActive) {
        try { window.CodexPocketNative.cancelSpeechRecognition?.(); } catch {}
        return;
      }
      showVoiceOverlay("recording", "按住说话 · 上滑取消或转文字");
      if (value === "on-device") elements.voiceTalkButton.title = "正在使用手机自带离线语音识别";
      else if (value === "system") elements.voiceTalkButton.title = "正在使用手机语音识别服务";
      return;
    }
    if (type === "permission") {
      showVoiceOverlay("recording", "请允许麦克风权限，然后重新按住说话");
      return;
    }
    if (type === "ready") {
      if (state.voiceActive) showVoiceOverlay("recording", "请开始说话");
      return;
    }
    if (type === "permission-ready") {
      if (state.voiceActive || state.voiceReleased) {
        cancelActiveVoiceSession();
        clearVoiceSessionUi();
      }
      showToast(value || "麦克风已就绪，请重新按住说话");
      return;
    }
    if (type === "level") {
      applyVoiceLevel(value);
      return;
    }
    if (type === "partial") {
      state.voicePartialTranscript = value.trim();
      if (elements.voiceLiveText) {
        elements.voiceLiveText.hidden = !state.voicePartialTranscript;
        elements.voiceLiveText.textContent = state.voicePartialTranscript;
      }
      return;
    }
    if (type === "final") {
      clearTimeout(state.voiceReleaseTimer);
      state.voiceReleaseTimer = null;
      if (isGarbledTranscript(value)) {
        failVoiceSession("手机语音识别返回乱码");
        return;
      }
      state.voiceFinalTranscript = value.trim();
      if (!state.voiceActive && !state.voiceProcessing) return;
      if (state.voiceReleased || state.voiceProcessing) completeVoiceTranscript(state.voiceFinalTranscript).catch(() => {});
      else showVoiceOverlay("ready", "识别完成，松手发送", state.voiceFinalTranscript);
      return;
    }
    if (type === "error") {
      if (state.voiceCancelArmed || (!state.voiceActive && !state.voiceProcessing)) return;
      failVoiceSession(value);
      return;
    }
    if (type === "stopping") {
      showVoiceOverlay("processing", "正在转文字…", state.voicePartialTranscript);
      return;
    }
    if (type === "cancelled") {
      if (state.voiceCancelArmed || state.voiceReleased) clearVoiceSessionUi();
    }
  };

  window.onNativeVoiceState = (type, message) => {
    if (type === "started") {
      state.nativeVoiceActive = true;
      state.nativeVoicePending = false;
      if (!state.voiceActive) {
        try { window.CodexPocketNative.cancelVoiceRecording?.(); } catch {}
        return;
      }
      showVoiceOverlay("recording", "按住说话 · 上滑取消或转文字");
      return;
    }
    if (type === "ready") {
      if (state.voiceActive || state.voiceReleased) {
        cancelActiveVoiceSession();
        clearVoiceSessionUi();
      }
      showToast(message || "麦克风已就绪，请重新按住说话");
      return;
    }
    if (type === "cancelled") {
      if (state.voiceCancelArmed || state.voiceReleased) clearVoiceSessionUi();
      return;
    }
    if (type === "error") {
      if (!state.voiceActive && !state.voiceProcessing) {
        showToast(nativeVoiceMessage(message));
        return;
      }
      failVoiceSession(message);
    }
  };



  elements.micButton.addEventListener("click", () => {
    if (state.voiceProcessing || state.voiceUploading) return;
    if (state.voiceActive) {
      showToast("请先松开当前录音");
      return;
    }
    setVoiceMode(!state.voiceMode);
  });

  elements.voiceTalkButton.addEventListener("pointerdown", (event) => {
    if (state.voiceProcessing || state.voiceUploading || state.voiceActive) return;
    event.preventDefault();
    state.voicePressActive = true;
    state.voicePressStartedAt = Date.now();
    state.voiceStartY = event.clientY;
    state.voiceStartX = event.clientX;
    setVoiceFanOpen(false);
    setVoiceGesture("");
    try { elements.voiceTalkButton.setPointerCapture(event.pointerId); } catch {}
    startVoiceSession().catch((error) => failVoiceSession(error.message));
  });

  elements.voiceTalkButton.addEventListener("pointermove", (event) => {
    if (!state.voicePressActive || !state.voiceActive) return;
    const dx = event.clientX - state.voiceStartX;
    const upward = state.voiceStartY - event.clientY;
    if (!state.voiceFanOpen && upward >= VOICE_FAN_OPEN_PX) {
      setVoiceFanOpen(true);
    } else if (state.voiceFanOpen && upward <= VOICE_FAN_CLOSE_PX) {
      setVoiceFanOpen(false);
    }
    if (!state.voiceFanOpen) {
      if (state.voiceCancelArmed || state.voiceTranscribeArmed) setVoiceGesture("");
      return;
    }
    if (state.voiceCancelArmed) {
      if (dx > -VOICE_CANCEL_RESET_PX) setVoiceGesture("");
    } else if (state.voiceTranscribeArmed) {
      if (dx < VOICE_CANCEL_RESET_PX) setVoiceGesture("");
    } else if (dx <= -VOICE_CANCEL_ARM_PX) {
      setVoiceGesture("cancel");
    } else if (dx >= VOICE_CANCEL_ARM_PX) {
      setVoiceGesture("text");
    }
  });

  elements.voiceTalkButton.addEventListener("pointerup", (event) => {
    if (!state.voicePressActive) return;
    event.preventDefault();
    state.voicePressActive = false;
    finishVoiceSession(state.voiceCancelArmed ? "cancel" : state.voiceTranscribeArmed ? "text" : "voice").catch((error) => failVoiceSession(error.message));
  });

  elements.voiceTalkButton.addEventListener("pointercancel", () => {
    if (!state.voicePressActive && !state.voiceActive) return;
    state.voicePressActive = false;
    finishVoiceSession("cancel").catch(() => {});
  });
  elements.voiceTalkButton.addEventListener("contextmenu", (event) => event.preventDefault());
}

async function setupSpeech() {
  const nativeBridge = window.CodexPocketNative;
  let speechEngine = "none";
  try {
    speechEngine = typeof nativeBridge?.getSpeechRecognitionEngine === "function"
      ? String(nativeBridge.getSpeechRecognitionEngine() || "none")
      : nativeBridge?.isSpeechRecognitionAvailable?.() ? "system" : "none";
  } catch {
    speechEngine = "none";
  }

  const hasNativeSpeech = Boolean(
    speechEngine !== "none" &&
    nativeBridge &&
    typeof nativeBridge.startSpeechRecognition === "function" &&
    typeof nativeBridge.stopSpeechRecognition === "function"
  );
  const hasNativeRecorder = Boolean(
    nativeBridge &&
    typeof nativeBridge.startVoiceRecording === "function" &&
    typeof nativeBridge.stopVoiceRecording === "function"
  );
  const hasWebRecorder = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  if (!hasNativeSpeech && !hasNativeRecorder && !hasWebRecorder) return;

  state.voiceRecorderEngine = hasNativeRecorder ? "native-recorder" : hasWebRecorder ? "web-recorder" : "";
  state.voiceTextEngine = hasNativeSpeech ? "native-speech" : state.voiceRecorderEngine;
  state.voiceEngine = state.voiceRecorderEngine || state.voiceTextEngine;
  state.recognition = {
    engine: hasNativeSpeech ? speechEngine : state.voiceTextEngine,
    recorder: state.voiceRecorderEngine,
  };
  bindVoiceMode();
  elements.micButton.title = "长按发语音，上滑展开取消或转文字";
}
function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.installPrompt = event;
    if (!localStorage.getItem(INSTALL_DISMISSED_KEY) && !window.matchMedia("(display-mode: standalone)").matches) {
      elements.installBanner.hidden = false;
    }
  });
  elements.installButton.addEventListener("click", async () => {
    if (!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt = null;
    elements.installBanner.hidden = true;
  });
  elements.dismissInstall.addEventListener("click", () => {
    elements.installBanner.hidden = true;
    localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
  });
}

function closeScanDialog() {
  if (elements.scanDialog?.open) elements.scanDialog.close();
}

function stopQrScanner() {
  if (state.scanTimer) {
    clearTimeout(state.scanTimer);
    state.scanTimer = null;
  }
  if (state.scanStartTimer) {
    clearTimeout(state.scanStartTimer);
    state.scanStartTimer = null;
  }
  state.scanBusy = false;
  if (state.scanStream) {
    for (const track of state.scanStream.getTracks()) track.stop();
    state.scanStream = null;
  }
  if (elements.scanVideo) {
    try { elements.scanVideo.pause(); } catch {}
    elements.scanVideo.srcObject = null;
  }
}

async function claimThreadTicket(ticket) {
  const data = await api(`/api/thread-links/${encodeURIComponent(ticket)}/claim`, { method: "POST" });
  await refreshConversations();
  state.searchQuery = "";
  elements.conversationSearch.value = "";
  setDrawerTab("chats");
  await loadConversation(data.conversation.id);
  closeDrawer();
  showToast(`已关联电脑对话：${data.conversation.title || "新对话"}`);
  return data.conversation;
}

function persistNativeConnectionUrl() {
  if (!state.token) return;
  const url = `${location.origin}/#token=${encodeURIComponent(state.token)}`;
  const computer = currentComputer();
  try {
    window.CodexPocketNative?.saveConnectionUrl?.(url);
    if (computer.id) window.CodexPocketNative?.upsertComputerConnection?.(computer.id, computer.name || "电脑", url);
  } catch {}
  refreshComputerProfiles();
}

async function exchangePendingThreadLink() {
  const ticket = state.pendingThreadTicket;
  if (!ticket) return null;
  const response = await fetch(`/api/thread-links/${encodeURIComponent(ticket)}/exchange`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error || "关联二维码已失效，请在电脑端重新生成", response.status);
  const exchangedToken = String(data.token || "");
  if (!exchangedToken) throw new ApiError("电脑没有返回有效的配对凭证", 502);
  state.token = exchangedToken;
  localStorage.setItem(TOKEN_KEY, exchangedToken);
  state.pendingThreadTicket = "";
  persistNativeConnectionUrl();
  return data.conversation || null;
}
async function claimPendingThreadLink() {
  const ticket = state.pendingThreadTicket;
  state.pendingThreadTicket = "";
  if (!ticket || !state.token) return null;
  try {
    return await claimThreadTicket(ticket);
  } catch (error) {
    if (error.status !== 401) showToast(error.message);
    return null;
  }
}

function migrateScannedPairingOrigin(payload) {
  let scanned;
  try {
    scanned = new URL(String(payload || ""), window.location.href);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(scanned.protocol) || scanned.origin === window.location.origin) return false;
  const target = scanned.href;
  showStartupLoading("正在切换电脑", "二维码已识别，正在打开新的 Codex 连接…");
  try { window.CodexPocketNative?.saveConnectionUrl?.(target); } catch {}
  try { state.eventAbort?.abort(); } catch {}
  try { state.eventSocket?.close(); } catch {}
  setTimeout(() => window.location.replace(target), 40);
  return true;
}

async function acceptScannedPairing(value) {
  let payload = String(value || "").trim();
  if (!payload) return;
  try {
    const parsed = JSON.parse(payload);
    payload = parsed.url || parsed.pairingUrl || parsed.threadUrl || parsed.token || payload;
  } catch {}
  if (migrateScannedPairingOrigin(payload)) return;
  const scannedToken = extractToken(payload);
  if (scannedToken) {
    state.token = scannedToken;
    localStorage.setItem(TOKEN_KEY, scannedToken);
  }
  const threadTicket = extractThreadTicket(payload);
  if (threadTicket) {
    state.pendingThreadTicket = threadTicket;
    elements.scanStatus.textContent = "二维码已识别，正在关联电脑对话…";
    stopQrScanner();
    closeScanDialog();
    showStartupLoading("正在关联电脑对话", "正在验证一次性二维码并获取这台电脑的配对凭证…");
    try {
      if (!state.token) await exchangePendingThreadLink();
      await finishInitialConnection();
    } catch (error) {
      hideStartupLoading();
      if (error.status !== 401) {
        elements.scanStatus.textContent = error.message;
        showToast(error.message);
      }
    }
    return;
  }
  const candidate = extractToken(payload);
  if (!candidate) {
    elements.scanStatus.textContent = "这个二维码不是口袋配对或关联链接。";
    return;
  }
  elements.scanStatus.textContent = "二维码已识别，正在连接电脑…";
  stopQrScanner();
  closeScanDialog();
  elements.pairingInput.value = candidate;
  state.token = candidate;
  localStorage.setItem(TOKEN_KEY, candidate);
  elements.pairingStatus.textContent = "正在连接电脑…";
  showStartupLoading("正在连接新电脑", "正在验证配对、同步电脑身份和对话列表…");
  try {
    if (!state.token) await exchangePendingThreadLink();
    await finishInitialConnection();
  } catch (error) {
    hideStartupLoading();
    if (error.status !== 401) elements.pairingStatus.textContent = "扫码成功，但暂时无法连接电脑。";
  }
}

async function scanQrFrame() {
  if (state.scanBusy || !state.scanStream || elements.scanDialog.open === false) return;
  state.scanBusy = true;
  const video = elements.scanVideo;
  let result = "";
  try {
    if (video.readyState >= 2 && video.videoWidth > 0) {
      if ("BarcodeDetector" in window) {
        const detector = state.barcodeDetector || new window.BarcodeDetector({ formats: ["qr_code"] });
        state.barcodeDetector = detector;
        const codes = await detector.detect(video);
        if (codes.length) result = codes[0].rawValue || "";
      } else if (window.jsQR) {
        const canvas = elements.scanCanvas;
        const maxWidth = 480;
        const scale = Math.min(1, maxWidth / video.videoWidth);
        const width = Math.max(1, Math.round(video.videoWidth * scale));
        const height = Math.max(1, Math.round(video.videoHeight * scale));
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(video, 0, 0, width, height);
        const image = context.getImageData(0, 0, width, height);
        const code = window.jsQR(image.data, width, height, { inversionAttempts: "dontInvert" });
        if (code?.data) result = code.data;
      } else {
        elements.scanStatus.textContent = "当前 WebView 不支持二维码识别，请手动粘贴配对链接。";
        stopQrScanner();
        return;
      }
    }
  } catch (error) {
    elements.scanStatus.textContent = `扫码识别失败：${error.message}`;
  } finally {
    state.scanBusy = false;
  }
  if (result) {
    await acceptScannedPairing(result);
    return;
  }
  if (state.scanStream && elements.scanDialog.open) {
    state.scanTimer = setTimeout(scanQrFrame, 320);
  }
}

async function openQrScanner() {
  const nativeBridge = window.CodexPocketNative;
  if (nativeBridge && typeof nativeBridge.startQrScanner === "function") {
    stopQrScanner();
    closeScanDialog();
    window.onNativeQrScanResult = async (type, value) => {
      if (type === "success") {
        await acceptScannedPairing(value);
        return;
      }
      if (type === "error") {
        const message = String(value || "扫码失败");
        elements.scanStatus.textContent = message;
        showToast(message);
      } else if (type === "cancelled" && !state.token) {
        elements.pairingStatus.textContent = "已取消扫码，也可以手动粘贴配对链接。";
      }
    };
    try {
      nativeBridge.startQrScanner();
      if (!state.token) elements.pairingStatus.textContent = "正在打开原生相机扫码…";
    } catch (error) {
      showToast(`无法打开扫码相机：${error.message || "未知错误"}`);
    }
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    showToast("当前设备不支持相机扫码");
    if (!state.token) elements.pairingStatus.textContent = "当前浏览器不支持相机扫码，请手动粘贴配对链接。";
    return;
  }
  stopQrScanner();
  elements.scanStatus.textContent = "正在打开后置相机…";
  elements.scanDialog.showModal();
  state.scanStartTimer = setTimeout(() => {
    if (!state.scanStream) {
      elements.scanStatus.textContent = "相机启动超时，请关闭后重试。";
      showToast("相机启动超时，请关闭后重试");
      closeScanDialog();
      stopQrScanner();
    }
  }, 12_000);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 15, max: 30 },
      },
    });
    if (!elements.scanDialog.open) {
      for (const track of stream.getTracks()) track.stop();
      return;
    }
    clearTimeout(state.scanStartTimer);
    state.scanStartTimer = null;
    state.scanStream = stream;
    elements.scanVideo.srcObject = stream;
    await elements.scanVideo.play();
    elements.scanStatus.textContent = "将电脑上的配对二维码或对话关联二维码放入取景框";
    scanQrFrame();
  } catch (error) {
    clearTimeout(state.scanStartTimer);
    state.scanStartTimer = null;
    elements.scanStatus.textContent = error.name === "NotAllowedError"
      ? "没有相机权限，请在系统设置中允许口袋使用相机。"
      : error.name === "NotReadableError"
        ? "相机被其他应用占用，请关闭其他相机应用后重试。"
        : `无法打开相机：${error.message}`;
    stopQrScanner();
  }
}
async function bootstrap() {
  setConnection("", "连接中");
  const data = await api("/api/bootstrap");
  applyBootstrapSnapshot(data);
  writeCachedBootstrap(data);
  setConnection("online", "在线");

  const preferred = localStorage.getItem(ACTIVE_KEY);
  const selected = state.conversations.find((item) => item.id === preferred) || state.conversations[0];
  if (selected) {
    try {
      await loadConversation(selected.id);
    } catch (error) {
      const cachedConversation = readCachedConversation(selected.id);
      if (cachedConversation) resetConversationView(cachedConversation);
      else throw error;
    }
  } else {
    resetConversationView(null);
  }
  schedulePoll(4500);
  connectEventStream();
  loadAvailableModels().catch(() => {});
}

async function finishInitialConnection() {
  await bootstrap();
  persistNativeConnectionUrl();
  await claimPendingThreadLink();
  hideStartupLoading();
  state.conversationsStatus = state.conversations.length ? "ready" : (state.conversationsStatus || "ready");
  setTimeout(maybePromptFirstName, 80);
}
function scheduleBootstrapRetry(delay = 3000) {
  clearTimeout(state.bootstrapRetryTimer);
  state.bootstrapRetryTimer = setTimeout(async () => {
    if (!state.token || state.bootstrapRetrying) return;
    state.bootstrapRetrying = true;
    try {
      await finishInitialConnection();
    } catch (error) {
      if (error.status === 401) return;
      setConnection("", "等待重连");
      scheduleBootstrapRetry(Math.min(15_000, Math.max(3000, delay * 2)));
    } finally {
      state.bootstrapRetrying = false;
    }
  }, delay);
}

function bindEvents() {
  elements.pairingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const candidate = extractToken(elements.pairingInput.value);
    if (!candidate) {
      elements.pairingStatus.textContent = "请输入有效的配对链接或令牌。";
      return;
    }
    state.token = candidate;
    localStorage.setItem(TOKEN_KEY, candidate);
    elements.pairingStatus.textContent = "正在连接电脑…";
    showStartupLoading("正在连接电脑", "正在验证配对并同步对话列表…");
    try {
      await finishInitialConnection();
      elements.pairingInput.value = "";
    } catch (error) {
      hideStartupLoading();
      if (error.status !== 401) {
        elements.pairingStatus.textContent = "暂时无法连接。请确认电脑端口袋正在运行，并且链接没有过期。";
        setConnection("", "未连接");
      }
    }
  });

  if (elements.downloadApkLink) {
    elements.downloadApkLink.addEventListener("click", (event) => {
      event.preventDefault();
      openDownloadConfirmation(
        elements.downloadApkLink.href,
        elements.downloadApkLink.getAttribute("download") || "codex-pocket.apk"
      );
    });
    elements.cancelDownloadButton.addEventListener("click", () => elements.downloadConfirmDialog.close());
    elements.confirmDownloadButton.addEventListener("click", async () => {
      const url = state.pendingDownloadUrl || elements.downloadApkLink.href;
      const fileName = state.pendingDownloadName || "codex-pocket.apk";
      elements.downloadConfirmDialog.close();
      await performDownload(url, fileName);
    });
  }
  elements.refreshFilesButton?.addEventListener("click", () => renderConversationFiles().catch(() => {}));
  elements.scanButton.addEventListener("click", openQrScanner);
  elements.drawerScanButton.addEventListener("click", openQrScanner);
  elements.addComputerButton?.addEventListener("click", openQrScanner);
  elements.closeScanButton.addEventListener("click", () => elements.scanDialog.close());
  elements.scanDialog.addEventListener("close", stopQrScanner);
  elements.scanDialog.addEventListener("cancel", stopQrScanner);
  elements.attachButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    elements.attachmentMenu.hidden = !elements.attachmentMenu.hidden;
  });
  elements.pickPhotoButton?.addEventListener("click", () => {
    elements.attachmentMenu.hidden = true;
    elements.photoInput.click();
  });
  elements.takePhotoButton?.addEventListener("click", () => {
    elements.attachmentMenu.hidden = true;
    elements.cameraInput.click();
  });
  elements.pickVideoButton?.addEventListener("click", () => {
    elements.attachmentMenu.hidden = true;
    elements.videoInput.click();
  });
  elements.pickFileButton?.addEventListener("click", () => {
    elements.attachmentMenu.hidden = true;
    elements.fileInput.click();
  });
  elements.photoInput?.addEventListener("change", () => uploadConversationPhoto(elements.photoInput.files?.[0]));
  elements.cameraInput?.addEventListener("change", () => uploadConversationPhoto(elements.cameraInput.files?.[0]));
  elements.videoInput?.addEventListener("change", () => uploadConversationVideo(elements.videoInput.files?.[0]));
  elements.fileInput?.addEventListener("change", () => uploadConversationFile(elements.fileInput.files?.[0]));
  document.addEventListener("pointerdown", (event) => {
    if (!elements.attachmentMenu?.hidden && !event.target.closest("#attachmentMenu, #attachButton")) {
      elements.attachmentMenu.hidden = true;
    }
  });

  elements.composer.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
  });
  elements.messageInput.addEventListener("input", resizeComposer);
  elements.messageInput.addEventListener("focus", () => setTimeout(() => scrollToBottom(), 180));
  elements.stopButton.addEventListener("click", stopCurrentTask);
  elements.openApprovalAlertButton?.addEventListener("click", async () => {
    const conversationId = state.approvalAlertConversationId;
    closeApprovalAlert();
    if (conversationId) await loadConversation(conversationId);
  });
  elements.dismissApprovalAlertButton?.addEventListener("click", closeApprovalAlert);
  elements.laterApprovalAlertButton?.addEventListener("click", closeApprovalAlert);
  elements.approvalAlertDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeApprovalAlert();
  });
  elements.confirmSteerButton?.addEventListener("click", steerQueuedMessage);
  elements.cancelAllQueueButton?.addEventListener("click", cancelAllQueuedMessages);
  elements.cancelSteerButton?.addEventListener("click", closeSteerDialog);
  elements.closeSteerButton?.addEventListener("click", closeSteerDialog);
  elements.steerDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSteerDialog();
  });
  elements.newChatButton.addEventListener("click", () => createConversation().catch((error) => showToast(error.message)));
  elements.drawerNewChat.addEventListener("click", () => createConversation().catch((error) => showToast(error.message)));
  elements.menuButton.addEventListener("click", openDrawer);
  elements.closeDrawerButton.addEventListener("click", closeDrawer);
  elements.drawerBackdrop.addEventListener("click", closeDrawer);
  elements.agentSelect?.addEventListener("change", () => {
    state.selectedAgentId = elements.agentSelect.value || "codex";
    try { localStorage.setItem("codex-pocket-agent", state.selectedAgentId); } catch {}
    if (!state.active || composerAgentId() === state.selectedAgentId) {
      state.models = [];
      state.selectedModel = "";
      updateModelUi();
      loadAvailableModels({ force: true }).catch(() => {});
    }
    showToast(`新对话 Agent：${agentNameById(state.selectedAgentId)}`);
  });
  elements.projectSelect.addEventListener("change", () => {
    state.selectedProjectPath = elements.projectSelect.value;
    localStorage.setItem("codex-pocket-project", state.selectedProjectPath);
    showToast(`新对话项目：${projectBaseName(state.selectedProjectPath)}`);
  });
  elements.importButton.addEventListener("click", openImportDialog);
  elements.closeImportButton.addEventListener("click", () => elements.importDialog.close());
  elements.infoButton.addEventListener("click", openInfo);
  elements.closeInfoButton.addEventListener("click", () => elements.infoDialog.close());
  elements.forgetButton.addEventListener("click", () => {
    state.eventAbort?.abort();
    try { state.eventSocket?.close(); } catch {}
    try { window.CodexPocketNative?.forgetConnection?.(); } catch {}
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    clearCachedAppData();
    location.reload();
  });
  elements.copyPairingButton.addEventListener("click", async () => {
    const pairingUrl = `${location.origin}/#token=${encodeURIComponent(state.token)}`;
    await copyText(pairingUrl);
    showToast("配对链接已复制，请妥善保管");
  });
  elements.quickPrompts.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-prompt]");
    if (!button) return;
    elements.messageInput.value = button.dataset.prompt;
    resizeComposer();
    elements.messageInput.focus();
  });
  window.addEventListener("online", checkHealth);
  window.addEventListener("offline", () => setConnection("", "等待网络"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      writeCachedConversation();
      stopQrScanner();
      if (state.voiceActive) {
        cancelActiveVoiceSession();
        clearVoiceSessionUi();
      }
    }
    if (!document.hidden) {
      checkHealth();
      schedulePoll(200);
    }
  });
  window.addEventListener("resize", resizeComposer);
  window.addEventListener("pagehide", writeCachedConversation);
}

async function main() {
  captureTokenFromLocation();
  setupTheme();
  setupIdentity();
  setupAvatarCrop();
  setupNativeTextInput();
  setupNotificationSettings();
  setupModelPicker();
  setupApprovalPolicy();
  setupComputerProfile();
  setupComputerNamePrompt();
  state.token = localStorage.getItem(TOKEN_KEY) || "";
  bindEvents();
  setupMediaViewer();
  setupDrawerNavigation();
  setupInstallPrompt();
  setupSpeech();
  resizeComposer();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }

  if (!state.token && !state.pendingThreadTicket) {
    showPairing("");
    return;
  }

  const cachedBootstrap = readCachedBootstrap();
  if (cachedBootstrap) {
    applyBootstrapSnapshot(cachedBootstrap.data);
    const preferred = localStorage.getItem(ACTIVE_KEY);
    const selected = cachedBootstrap.data.conversations?.find((item) => item.id === preferred)
      || cachedBootstrap.data.conversations?.[0];
    const cachedConversation = readCachedConversation(selected?.id);
    if (cachedConversation) resetConversationView(cachedConversation);
    setConnection("", "正在连接");
  }

  const linkingFromQr = !state.token && Boolean(state.pendingThreadTicket);
  showStartupLoading(linkingFromQr ? "正在关联电脑对话" : (cachedBootstrap ? "正在恢复连接" : "正在连接电脑"), linkingFromQr ? "正在使用一次性二维码换取这台电脑的配对凭证…" : (cachedBootstrap ? "已显示手机缓存，正在同步电脑上的最新对话…" : "正在验证配对并同步对话列表…"));
  try {
    if (!state.token) await exchangePendingThreadLink();
    await finishInitialConnection();
  } catch (error) {
    hideStartupLoading();
    if (error.status !== 401) {
      if (cachedBootstrap) {
        showApp();
        setConnection("", "等待重连");
        scheduleBootstrapRetry();
      } else {
        showPairing(linkingFromQr ? (error.message || "关联二维码已失效，请在电脑端重新生成") : "暂时无法连接电脑端服务，请稍后重试。");
        setConnection("", "未连接");
      }
    }
  }
  setInterval(checkHealth, 20_000);
  setInterval(() => document.querySelectorAll(".image-countdown").forEach(updateImageCountdown), 1000);
}

main();





































