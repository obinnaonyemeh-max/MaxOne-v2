export function getVehicleIcon(assetType: string) {
  if (assetType.includes("2")) return "/images/2_wheeler.svg"
  if (assetType.includes("3")) return "/images/3_wheeler.svg"
  if (assetType.includes("4")) return "/images/4_wheeler.svg"
  return "/images/2_wheeler.svg"
}

export function VehicleIcon({ assetType }: { assetType: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
      <img src={getVehicleIcon(assetType)} alt={assetType} className="h-5 w-5" />
    </div>
  )
}
