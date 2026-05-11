import { Modal } from "./Modal"

export interface LoaderModalProps {
  open: boolean
  message?: string
}

export function LoaderModal({ open, message = "Processing..." }: LoaderModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={() => {}}
      hideHeader
      className="max-w-[280px]"
    >
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 10V20" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            <path d="M40 60V70" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            <path d="M70 40H60" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            <path d="M20 40H10" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            <path d="M61.21 18.79L54.14 25.86" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            <path d="M25.86 54.14L18.79 61.21" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            <path d="M61.21 61.21L54.14 54.14" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
            <path d="M25.86 25.86L18.79 18.79" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="mt-6 font-semibold text-sidebar-item-active" style={{ fontSize: "18px" }}>
          {message}
        </p>
      </div>
    </Modal>
  )
}
