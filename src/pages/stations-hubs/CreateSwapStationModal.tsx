import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Image } from "lucide-react"
import { ConfirmModal, Modal, DocUpload, InfoCard, InfoGrid, LocationAutocomplete } from "@/components/max"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CITIES, CITY_COORDINATES, type City } from "@/data/cities"
import {
  STATION_PROVIDERS,
  pickStationAdminName,
  type StationProvider,
  type SwapStation,
} from "@/data/mockStationsData"
import { StationsMap } from "./StationsMap"

const COUNTRIES = ["Nigeria"] as const

const selectTriggerClass =
  "h-12 w-full bg-input-soft [&_svg]:text-gray-700 [&_svg]:opacity-100"

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-gray-600" style={{ fontSize: "13px" }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const emptyForm = {
  name: "",
  address: "",
  country: "",
  city: "",
  latitude: "",
  longitude: "",
  provider: "",
}

interface CreateSwapStationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  station?: SwapStation | null
  onCreate?: (station: SwapStation) => void
  onAddBatteries?: (station: SwapStation) => void
  onSave?: (station: SwapStation) => void
}

function formFromStation(station: SwapStation): typeof emptyForm {
  return {
    name: station.name,
    address: station.address || `${station.name}, ${station.city}`,
    country: station.country || "Nigeria",
    city: station.city,
    latitude: String(station.coordinates.lat),
    longitude: String(station.coordinates.lng),
    provider: station.provider,
  }
}

function stationFromForm(
  form: typeof emptyForm,
  id: string,
  extras?: Partial<SwapStation>
): SwapStation {
  return {
    batteriesAvailable: 0,
    batteriesCapacity: 32,
    averageSoc: 0,
    totalCollections: 0,
    totalSwapsToday: 0,
    ...extras,
    id,
    name: form.name.trim(),
    city: form.city as City,
    provider: form.provider as StationProvider,
    coordinates: {
      lat: Number(form.latitude),
      lng: Number(form.longitude),
    },
    address: form.address.trim(),
    country: form.country,
    photoUrl: extras?.photoUrl,
    adminName: extras?.adminName ?? pickStationAdminName(),
  }
}

export function CreateSwapStationModal({
  open,
  onOpenChange,
  station,
  onCreate,
  onAddBatteries,
  onSave,
}: CreateSwapStationModalProps) {
  const isEdit = Boolean(station)
  const [step, setStep] = useState<"form" | "preview" | "created">("form")
  const [form, setForm] = useState(emptyForm)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [createdStation, setCreatedStation] = useState<SwapStation | null>(null)

  useEffect(() => {
    if (!open) {
      setStep("form")
      setForm(emptyForm)
      setPhoto(null)
      setCreatedStation(null)
      setPhotoUrl(null)
      return
    }
    if (station) {
      setForm(formFromStation(station))
      setPhotoUrl(station.photoUrl ?? null)
    }
  }, [open, station])

  useEffect(() => {
    if (!photo) return
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  const isValid =
    form.name.trim().length > 0 &&
    form.address.trim().length > 0 &&
    form.country.length > 0 &&
    form.city.length > 0 &&
    Number.isFinite(Number(form.latitude)) &&
    form.latitude.trim().length > 0 &&
    Number.isFinite(Number(form.longitude)) &&
    form.longitude.trim().length > 0 &&
    form.provider.length > 0

  const previewStation = useMemo(
    () =>
      isValid
        ? stationFromForm(
            form,
            station?.id ?? "STN-PREVIEW",
            station
              ? { ...station, photoUrl: photoUrl ?? station.photoUrl }
              : { photoUrl }
          )
        : null,
    [form, isValid, station, photoUrl]
  )

  const handleCityChange = (city: string) => {
    const coords = CITY_COORDINATES[city as City]
    setForm((prev) => ({
      ...prev,
      city,
      latitude: prev.latitude || (coords ? String(coords.lat) : prev.latitude),
      longitude: prev.longitude || (coords ? String(coords.lng) : prev.longitude),
    }))
  }

  const handleSubmit = () => {
    if (!isValid || !previewStation) return

    if (isEdit && station) {
      const updated = stationFromForm(form, station.id, {
        ...station,
        photoUrl: photoUrl ?? station.photoUrl,
        address: form.address.trim(),
        country: form.country,
      })
      setCreatedStation(updated)
      onSave?.(updated)
      setStep("created")
      return
    }

    const created = stationFromForm(form, `STN-${Date.now().toString().slice(-6)}`, {
      photoUrl,
    })
    setCreatedStation(created)
    onCreate?.(created)
    setStep("created")
  }

  const handleLater = () => {
    onOpenChange(false)
  }

  const handleAddBatteries = () => {
    if (!createdStation) return
    onAddBatteries?.(createdStation)
    onOpenChange(false)
  }

  const isPreview = step === "preview"
  const isCreated = step === "created"

  return (
    <>
    <Modal
      open={open && !isCreated}
      onOpenChange={onOpenChange}
      title={
        isPreview
          ? "Preview Swap Station"
          : isEdit
            ? "Edit Swap Station Details"
            : "Create a Swap Station"
      }
      subtitle={
        isPreview
          ? isEdit
            ? "Review the updated station details before saving."
            : "Review how this station will appear before creating it."
          : undefined
      }
      maxHeight="85vh"
      className="max-w-lg"
      showBackButton={isPreview}
      onBack={() => setStep("form")}
      secondaryAction={{
        label: "Cancel",
        onClick: () => onOpenChange(false),
      }}
      primaryAction={
        isPreview
          ? {
              label: isEdit ? "Save Changes" : "Create Station",
              onClick: handleSubmit,
            }
          : {
              label: "Continue",
              onClick: () => {
                if (!isValid) return
                setStep("preview")
              },
              disabled: !isValid,
            }
      }
    >
      {isPreview && previewStation ? (
        <div className="space-y-5">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={form.name.trim() || "Swap station"}
              className="h-40 w-full rounded-xl object-cover"
            />
          )}

          <InfoCard title="Station Details">
            <InfoGrid
              columns={2}
              showDividers
              items={[
                { label: "Station Name", value: form.name.trim() },
                { label: "Provider", value: form.provider },
                { label: "Address", value: form.address.trim() },
                { label: "Country", value: form.country },
                { label: "City", value: form.city },
                { label: "Coordinates", value: `${form.latitude}, ${form.longitude}` },
              ]}
            />
          </InfoCard>

          <div>
            <p className="mb-2 text-xs font-medium text-breadcrumb-root">Location</p>
            <StationsMap
              stations={[previewStation]}
              selectedStationId={previewStation.id}
              onSelectStation={() => {}}
              className="h-44 w-full overflow-hidden rounded-lg border border-gray-200"
            />
          </div>
        </div>
      ) : (
      <div className="space-y-4">
        <FormField label="Swap Station Name">
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter a swap station name"
            className="h-12"
          />
        </FormField>

        <FormField label="Enter Address">
          <LocationAutocomplete
            value={form.address}
            onChange={(address) => setForm((prev) => ({ ...prev, address }))}
            placeholder="Enter Address"
            inputClassName="h-12"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Select Country">
            <Select
              value={form.country || undefined}
              onValueChange={(country) => setForm((prev) => ({ ...prev, country }))}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="- Select Country -" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Select City">
            <Select
              value={form.city || undefined}
              onValueChange={handleCityChange}
              disabled={!form.country}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="- Select City -" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Latitude">
            <Input
              value={form.latitude}
              onChange={(e) => setForm((prev) => ({ ...prev, latitude: e.target.value }))}
              placeholder="Enter location's latitude"
              className="h-12"
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Longitude">
            <Input
              value={form.longitude}
              onChange={(e) => setForm((prev) => ({ ...prev, longitude: e.target.value }))}
              placeholder="Enter location's longitude"
              className="h-12"
              inputMode="decimal"
            />
          </FormField>
        </div>

        <FormField label="Select Provider">
          <Select
            value={form.provider || undefined}
            onValueChange={(provider) => setForm((prev) => ({ ...prev, provider }))}
          >
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="- Select Provider -" />
            </SelectTrigger>
            <SelectContent>
              {STATION_PROVIDERS.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Upload a picture of the swap station">
          {isEdit && photoUrl && !photo && (
            <img
              src={photoUrl}
              alt={form.name.trim() || "Swap station"}
              className="mb-2 h-28 w-full rounded-xl object-cover"
            />
          )}
          <DocUpload
            uploadedFile={photo}
            onFileSelect={setPhoto}
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            maxSizeLabel="Maximum of 10MB and should be jpg, png or jpeg"
            showClickHint={false}
            minHeightClass="min-h-[128px]"
            icon={<Image className="mx-auto mb-2 h-7 w-7 text-gray-400" />}
            label={
              <>
                Drag and drop or{" "}
                <span className="font-semibold text-gray-700">choose file</span>{" "}
                to upload
              </>
            }
          />
        </FormField>
      </div>
      )}
    </Modal>

    <ConfirmModal
      open={open && isCreated}
      onOpenChange={(next) => {
        if (!next) handleLater()
      }}
      variant="success"
      title={isEdit ? "Swap station updated" : "Swap station created"}
      subtitle={
        isEdit
          ? createdStation
            ? `${createdStation.name} has been updated.`
            : "The swap station has been updated."
          : createdStation
            ? `${createdStation.name} has been added. You can add batteries now, or do this later.`
            : "You can add batteries now, or do this later."
      }
      primaryAction={
        isEdit
          ? {
              label: "Done",
              onClick: handleLater,
            }
          : {
              label: "Add batteries",
              onClick: handleAddBatteries,
            }
      }
      secondaryAction={
        isEdit
          ? undefined
          : {
              label: "I'll do this later",
              onClick: handleLater,
            }
      }
      className="max-w-md"
    />
    </>
  )
}
