import { Button } from "@/components/ui/button"

interface QRCodeCardProps {
  batteryId: string
}

export function QRCodeCard({ batteryId }: QRCodeCardProps) {
  const handleDownload = () => {
    // Placeholder for QR code download functionality
    console.log(`Downloading QR code for battery: ${batteryId}`)
  }

  return (
    <div className="bg-content-card border border-border rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-sidebar-item-active">QR Code</h3>
        <p className="text-sm text-breadcrumb-root mt-1">
          Scan or download the QR code containing the battery details
        </p>
      </div>

      {/* QR Code Display */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Scanner frame corners */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-border rounded-tl" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-border rounded-tr" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-border rounded-bl" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-border rounded-br" />
          
          {/* QR Code placeholder - using a simple SVG pattern */}
          <div className="w-40 h-40 bg-white p-2">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
            >
              {/* QR code pattern - simplified representation */}
              <rect x="0" y="0" width="30" height="30" fill="black" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" fill="black" />
              
              <rect x="70" y="0" width="30" height="30" fill="black" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="black" />
              
              <rect x="0" y="70" width="30" height="30" fill="black" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="black" />
              
              {/* Data pattern */}
              <rect x="35" y="0" width="5" height="5" fill="black" />
              <rect x="45" y="0" width="5" height="5" fill="black" />
              <rect x="55" y="0" width="5" height="5" fill="black" />
              <rect x="35" y="10" width="5" height="5" fill="black" />
              <rect x="50" y="10" width="5" height="5" fill="black" />
              <rect x="60" y="10" width="5" height="5" fill="black" />
              <rect x="40" y="20" width="5" height="5" fill="black" />
              <rect x="55" y="20" width="5" height="5" fill="black" />
              
              <rect x="0" y="35" width="5" height="5" fill="black" />
              <rect x="10" y="35" width="5" height="5" fill="black" />
              <rect x="20" y="40" width="5" height="5" fill="black" />
              <rect x="0" y="45" width="5" height="5" fill="black" />
              <rect x="15" y="50" width="5" height="5" fill="black" />
              <rect x="0" y="55" width="5" height="5" fill="black" />
              <rect x="10" y="60" width="5" height="5" fill="black" />
              <rect x="25" y="55" width="5" height="5" fill="black" />
              
              <rect x="35" y="35" width="10" height="10" fill="black" />
              <rect x="50" y="35" width="5" height="5" fill="black" />
              <rect x="60" y="40" width="5" height="5" fill="black" />
              <rect x="35" y="50" width="5" height="5" fill="black" />
              <rect x="45" y="55" width="5" height="5" fill="black" />
              <rect x="55" y="50" width="5" height="5" fill="black" />
              <rect x="40" y="60" width="5" height="5" fill="black" />
              <rect x="60" y="60" width="5" height="5" fill="black" />
              
              <rect x="75" y="35" width="5" height="5" fill="black" />
              <rect x="85" y="40" width="5" height="5" fill="black" />
              <rect x="95" y="35" width="5" height="5" fill="black" />
              <rect x="70" y="45" width="5" height="5" fill="black" />
              <rect x="80" y="50" width="5" height="5" fill="black" />
              <rect x="90" y="55" width="5" height="5" fill="black" />
              <rect x="75" y="60" width="5" height="5" fill="black" />
              
              <rect x="35" y="75" width="5" height="5" fill="black" />
              <rect x="45" y="70" width="5" height="5" fill="black" />
              <rect x="55" y="75" width="5" height="5" fill="black" />
              <rect x="40" y="80" width="5" height="5" fill="black" />
              <rect x="50" y="85" width="5" height="5" fill="black" />
              <rect x="60" y="80" width="5" height="5" fill="black" />
              <rect x="35" y="90" width="5" height="5" fill="black" />
              <rect x="50" y="95" width="5" height="5" fill="black" />
              
              <rect x="70" y="70" width="5" height="5" fill="black" />
              <rect x="80" y="75" width="5" height="5" fill="black" />
              <rect x="90" y="70" width="5" height="5" fill="black" />
              <rect x="75" y="85" width="5" height="5" fill="black" />
              <rect x="85" y="80" width="5" height="5" fill="black" />
              <rect x="95" y="85" width="5" height="5" fill="black" />
              <rect x="70" y="95" width="5" height="5" fill="black" />
              <rect x="85" y="95" width="5" height="5" fill="black" />
              <rect x="95" y="95" width="5" height="5" fill="black" />
            </svg>
          </div>
          
          {/* Scanner line animation */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent top-1/2 animate-pulse" />
        </div>
      </div>

      {/* Divider with OR */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-breadcrumb-root font-medium">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Download Button */}
      <Button
        onClick={handleDownload}
        className="w-full"
      >
        Download the QR Code
      </Button>
    </div>
  )
}
