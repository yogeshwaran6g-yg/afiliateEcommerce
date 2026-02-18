import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeCard = ({ referralLink }) => {
  const handleDownload = () => {
    const canvas = document.getElementById("qr-code-canvas");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "referral-qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">QR Code</h2>
          <p className="text-sm text-slate-500 mt-1">
            Scan to join.
          </p>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
          <span className="material-symbols-outlined text-xl">qr_code</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <QRCodeCanvas
            id="qr-code-canvas"
            value={referralLink}
            size={140}
            level="H"
            includeMargin={false}
            className="rounded-lg relative z-10"
          />
        </div>
      </div>

      <div 
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer group"
      >
        <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
          download
        </span>
        Download QR
      </div>
    </div>
  );
};

export default QRCodeCard;
