const params = new URLSearchParams(location.hash.replace(/^#/, ""));
const pairingUrl = params.get("pair") || "";
const qrElement = document.getElementById("qr");
const linkElement = document.getElementById("pairLink");
const errorElement = document.getElementById("pairError");

if (!pairingUrl) {
  errorElement.textContent = "缺少配对链接。请从电脑端 Codex Pocket 启动页打开二维码页面。";
} else {
  linkElement.href = pairingUrl;
  linkElement.textContent = pairingUrl;
  try {
    const qr = qrcode(0, "M");
    qr.addData(pairingUrl);
    qr.make();
    qrElement.innerHTML = qr.createSvgTag({ cellSize: 5, margin: 3, scalable: true });
  } catch (error) {
    errorElement.textContent = `二维码生成失败：${error.message}`;
  }
}
