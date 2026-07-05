export function QRCodePanel({ dataUrl }: { dataUrl: string }) {
  if (!dataUrl) return null;
  return <section className="panel qr-panel"><h3>QR code</h3><img src={dataUrl} alt="QR code for short link" /></section>;
}
