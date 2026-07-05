import QRCode from "qrcode";

export function createQrCodeDataUrl(shortUrl: string) {
  return QRCode.toDataURL(shortUrl, { margin: 1, width: 320 });
}
