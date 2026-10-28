import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function normalizeName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 48);
}

function defaultName(id) {
  const suffix = String(id || "").replace(/[^0-9a-f]/gi, "").slice(-4).toUpperCase();
  return suffix ? `电脑 ${suffix}` : "电脑";
}

function writeIdentity(identityPath, computer) {
  fs.writeFileSync(identityPath, `${JSON.stringify(computer, null, 2)}\n`, "utf8");
}

export function ensureComputerIdentity(config) {
  const identityPath = path.join(config.dataDir, "computer.json");
  try {
    const parsed = JSON.parse(fs.readFileSync(identityPath, "utf8"));
    if (/^[0-9a-f-]{36}$/i.test(parsed.id || "")) {
      const fallbackName = defaultName(parsed.id);
      const customName = normalizeName(parsed.customName);
      const computer = {
        id: parsed.id,
        name: customName || fallbackName,
        defaultName: fallbackName,
        customName,
        createdAt: parsed.createdAt || new Date().toISOString(),
      };
      if (
        parsed.name !== computer.name
        || parsed.defaultName !== computer.defaultName
        || parsed.customName !== computer.customName
      ) {
        writeIdentity(identityPath, computer);
      }
      return computer;
    }
  } catch {}

  const id = crypto.randomUUID();
  const fallbackName = defaultName(id);
  const computer = {
    id,
    name: fallbackName,
    defaultName: fallbackName,
    customName: "",
    createdAt: new Date().toISOString(),
  };
  writeIdentity(identityPath, computer);
  return computer;
}

export function setComputerName(config, name) {
  const value = normalizeName(name);
  if (/[\u0000-\u001f\u007f]/.test(String(name || ""))) {
    const error = new Error("电脑名称包含无效字符");
    error.statusCode = 400;
    throw error;
  }
  const computer = ensureComputerIdentity(config);
  computer.customName = value;
  computer.name = value || computer.defaultName;
  writeIdentity(path.join(config.dataDir, "computer.json"), computer);
  return computer;
}
