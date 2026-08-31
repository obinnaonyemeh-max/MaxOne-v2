import { useEffect, useMemo, useState, type ReactNode } from "react"
import { MapPin } from "lucide-react"
import { toast } from "sonner"
import { Modal } from "@/components/max"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EXPIRY_OPTIONS = [
  { value: "15m", label: "15 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
] as const

type ExpiryValue = (typeof EXPIRY_OPTIONS)[number]["value"]

interface ShareLiveLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plateNumber: string
  address: string
  latitude: number
  longitude: number
}

export function getLiveShareLink(plateNumber: string, expiry: string): string {
  const token = btoa(`${plateNumber}:${expiry}`)
    .replace(/=+$/, "")
    .replace(/[+\/]/g, "")
    .padEnd(8, "A")
    .slice(0, 7)
  const slug = plateNumber.replace(/\s+/g, "")
  return `https://falcon.max.ng/live/${slug}?t=${token}`
}

export function ShareLiveLocationModal({
  open,
  onOpenChange,
  plateNumber,
  address,
  latitude,
  longitude,
}: ShareLiveLocationModalProps) {
  const [copied, setCopied] = useState(false)
  const [expiry, setExpiry] = useState<ExpiryValue>("1h")
  const shareLink = useMemo(
    () => getLiveShareLink(plateNumber, expiry),
    [plateNumber, expiry]
  )
  const shareMessage = `Follow ${plateNumber} live: ${shareLink}`

  useEffect(() => {
    if (!open) {
      setCopied(false)
      setExpiry("1h")
    }
  }, [open])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      toast.success("Link copied", {
        description: "Live location link copied to clipboard",
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy link")
    }
  }

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Share live location"
      className="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#DCFCE7" }}
          >
            <MapPin className="h-5 w-5" fill="#EF4444" stroke="#EF4444" />
          </div>
          <div className="min-w-0 flex flex-col gap-1 pt-0.5">
            <p
              className="text-sidebar-item-active font-semibold"
              style={{ fontSize: "16px" }}
            >
              {address}
            </p>
            <p className="text-breadcrumb-root" style={{ fontSize: "13px" }}>
              Lat {latitude.toFixed(6)}, Long {longitude.toFixed(6)}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-success shrink-0" />
              <span className="text-success font-medium" style={{ fontSize: "13px" }}>
                Updating in real time
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        <div className="flex flex-col gap-2">
          <label className="text-gray-600 font-medium" style={{ fontSize: "13px" }}>
            Link expires after
          </label>
          <Select value={expiry} onValueChange={(value) => setExpiry(value as ExpiryValue)}>
            <SelectTrigger className="h-12 w-full bg-white border border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPIRY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-gray-400" style={{ fontSize: "12px" }}>
            Anyone with this link can follow the vehicle live — no Falcon login needed
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3">
          <p
            className="min-w-0 flex-1 truncate text-gray-500"
            style={{ fontSize: "13px" }}
          >
            {shareLink}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 font-semibold text-sidebar-item-active hover:opacity-80 transition-opacity"
            style={{ fontSize: "12px" }}
          >
            {copied ? "COPIED" : "COPY LINK"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ShareChannelButton
            label="WhatsApp"
            onClick={() =>
              openShare(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`)
            }
          >
            <WhatsAppIcon />
          </ShareChannelButton>
          <ShareChannelButton
            label="Gmail"
            onClick={() =>
              openShare(
                `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(`Live location — ${plateNumber}`)}&body=${encodeURIComponent(shareMessage)}`
              )
            }
          >
            <GmailIcon />
          </ShareChannelButton>
          <ShareChannelButton
            label="Google Chat"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareMessage)
                toast.success("Link copied", {
                  description: "Paste it into Google Chat to share",
                })
              } catch {
                toast.error("Could not copy link")
              }
              openShare("https://chat.google.com")
            }}
          >
            <GoogleChatIcon />
          </ShareChannelButton>
        </div>
      </div>
    </Modal>
  )
}

function ShareChannelButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-4 hover:bg-gray-50 transition-colors"
    >
      {children}
      <span className="text-sidebar-item-active font-medium" style={{ fontSize: "13px" }}>
        {label}
      </span>
    </button>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#25D366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  )
}

function GmailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M2 6.5v11A1.5 1.5 0 0 0 3.5 19H6V9.25L12 13.5l6-4.25V19h2.5A1.5 1.5 0 0 0 22 17.5v-11c0-.5-.25-.96-.66-1.23L12 11.25 2.66 5.27A1.5 1.5 0 0 0 2 6.5Z" />
      <path fill="#FBBC04" d="M2 6.5c0-.5.25-.96.66-1.23L6 7.4V9.25L2 6.5Z" />
      <path fill="#34A853" d="M18 9.25V7.4l3.34-2.13c.41.27.66.73.66 1.23L18 9.25Z" />
      <path fill="#4285F4" d="M6 9.25V19H3.5A1.5 1.5 0 0 1 2 17.5V6.5L6 9.25Z" />
      <path fill="#C5221F" d="M22 6.5v11a1.5 1.5 0 0 1-1.5 1.5H18V9.25L22 6.5Z" />
    </svg>
  )
}

function GoogleChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#00AC47"
        d="M6.5 3A3.5 3.5 0 0 0 3 6.5v7A3.5 3.5 0 0 0 6.5 17H8v3.2c0 .5.58.77.97.45L13.2 17H17.5A3.5 3.5 0 0 0 21 13.5v-7A3.5 3.5 0 0 0 17.5 3h-11Z"
      />
      <path
        fill="#fff"
        d="M8.4 8.2h1.5v5.1H8.4V8.2Zm2.7 0h.9l1.7 2.55 1.7-2.55h.9v5.1h-1.45v-2.85l-1.15 1.7h-.1l-1.15-1.7v2.85H11.1V8.2Z"
      />
    </svg>
  )
}
