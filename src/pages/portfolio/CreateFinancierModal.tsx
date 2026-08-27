import { useEffect, useState } from "react"
import { format } from "date-fns"

import { Modal, DatePickerField } from "@/components/max"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from "@/pages/vehicles/FormControls"
import {
  FINANCING_PARTNERS,
  COLLECTION_DENOMINATIONS,
  type CollectionDenomination,
} from "@/data/mockFinanciers"

export interface CreateFinancierInput {
  financierName: string
  financingPartner: string
  numberOfVehicles: number
  vehicleCost: number
  dateOfPurchase: string
  collectionDenomination: CollectionDenomination
  tenorInMonths: number
  moratoriumInMonths: number
  interestRate: number
  transactionFees: number
  loanAmount: number
  financierContributionPercent: number
  equityContributionPercent: number
}

interface CreateFinancierModalProps {
  open: boolean
  onClose: () => void
  onCreate: (input: CreateFinancierInput) => void
}

function formatCalculated(value: number): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function CreateFinancierModal({ open, onClose, onCreate }: CreateFinancierModalProps) {
  const [financierName, setFinancierName] = useState("")
  const [financingPartner, setFinancingPartner] = useState("")
  const [numberOfVehicles, setNumberOfVehicles] = useState(0)
  const [vehicleCost, setVehicleCost] = useState(0)
  const [dateOfPurchase, setDateOfPurchase] = useState<Date | undefined>(undefined)
  const [collectionDenomination, setCollectionDenomination] = useState<CollectionDenomination>("NGN")
  const [tenorInMonths, setTenorInMonths] = useState(0)
  const [moratoriumInMonths, setMoratoriumInMonths] = useState(0)
  const [interestRate, setInterestRate] = useState(0)
  const [transactionFees, setTransactionFees] = useState(0)
  const [loanAmount, setLoanAmount] = useState(0)
  const [financierContributionPercent, setFinancierContributionPercent] = useState(0)
  const [equityContributionPercent, setEquityContributionPercent] = useState(0)

  useEffect(() => {
    if (!open) {
      setFinancierName("")
      setFinancingPartner("")
      setNumberOfVehicles(0)
      setVehicleCost(0)
      setDateOfPurchase(undefined)
      setCollectionDenomination("NGN")
      setTenorInMonths(0)
      setMoratoriumInMonths(0)
      setInterestRate(0)
      setTransactionFees(0)
      setLoanAmount(0)
      setFinancierContributionPercent(0)
      setEquityContributionPercent(0)
    }
  }, [open])

  const totalVehicleCost = numberOfVehicles * vehicleCost
  const equity = loanAmount * (equityContributionPercent / 100)

  const isValid = financierName.trim().length > 0 && financingPartner.length > 0

  const handleCreate = () => {
    if (!isValid) return
    onCreate({
      financierName: financierName.trim(),
      financingPartner,
      numberOfVehicles,
      vehicleCost,
      dateOfPurchase: dateOfPurchase ? format(dateOfPurchase, "dd/MM/yyyy") : "",
      collectionDenomination,
      tenorInMonths,
      moratoriumInMonths,
      interestRate,
      transactionFees,
      loanAmount,
      financierContributionPercent,
      equityContributionPercent,
    })
  }

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Add Financier"
      subtitle="Register a financing partner and the loan terms for a vehicle batch"
      className="max-w-2xl"
      primaryAction={{
        label: "Add Financier",
        onClick: handleCreate,
        disabled: !isValid,
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-4">
        <FormField label="Financier Name *">
          <Input
            value={financierName}
            onChange={(e) => setFinancierName(e.target.value)}
            placeholder="Enter financier name here"
            className="h-9 bg-input-soft"
          />
        </FormField>

        <FormField label="Financing Partner *">
          <Select value={financingPartner} onValueChange={setFinancingPartner}>
            <SelectTrigger className="h-9 w-full bg-input-soft">
              <SelectValue placeholder="Select financing partner" />
            </SelectTrigger>
            <SelectContent>
              {FINANCING_PARTNERS.map((partner) => (
                <SelectItem key={partner} value={partner}>
                  {partner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Number of Vehicles">
            <Input
              type="number"
              value={numberOfVehicles}
              onChange={(e) => setNumberOfVehicles(Number(e.target.value) || 0)}
              className="h-9 bg-input-soft"
            />
          </FormField>
          <FormField label="Vehicle Cost">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                ₦
              </span>
              <Input
                type="number"
                value={vehicleCost}
                onChange={(e) => setVehicleCost(Number(e.target.value) || 0)}
                className="h-9 bg-input-soft pl-7"
              />
            </div>
          </FormField>
        </div>
        <p className="-mt-2 text-xs font-medium text-breadcrumb-root">
          * Total Vehicle Cost = {formatCalculated(totalVehicleCost)}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of Purchase">
            <DatePickerField
              value={dateOfPurchase}
              onChange={setDateOfPurchase}
              placeholder="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              triggerClassName="bg-input-soft"
            />
          </FormField>
          <FormField label="Collection Denomination">
            <Select
              value={collectionDenomination}
              onValueChange={(v) => setCollectionDenomination(v as CollectionDenomination)}
            >
              <SelectTrigger className="h-9 w-full bg-input-soft">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLLECTION_DENOMINATIONS.map((denom) => (
                  <SelectItem key={denom} value={denom}>
                    {denom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tenor (Months)">
            <Input
              type="number"
              value={tenorInMonths}
              onChange={(e) => setTenorInMonths(Number(e.target.value) || 0)}
              className="h-9 bg-input-soft"
            />
          </FormField>
          <FormField label="Moratorium (Months)">
            <Input
              type="number"
              value={moratoriumInMonths}
              onChange={(e) => setMoratoriumInMonths(Number(e.target.value) || 0)}
              className="h-9 bg-input-soft"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Interest Rate">
            <div className="relative">
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="h-9 bg-input-soft pr-7"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                %
              </span>
            </div>
          </FormField>
          <FormField label="Transaction Fees">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                ₦
              </span>
              <Input
                type="number"
                value={transactionFees}
                onChange={(e) => setTransactionFees(Number(e.target.value) || 0)}
                className="h-9 bg-input-soft pl-7"
              />
            </div>
          </FormField>
        </div>

        <FormField label="Loan Amount">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
              ₦
            </span>
            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
              className="h-9 bg-input-soft pl-7"
            />
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Financier Contribution">
            <div className="relative">
              <Input
                type="number"
                value={financierContributionPercent}
                onChange={(e) => setFinancierContributionPercent(Number(e.target.value) || 0)}
                className="h-9 bg-input-soft pr-7"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                %
              </span>
            </div>
          </FormField>
          <FormField label="Equity Contribution">
            <div className="relative">
              <Input
                type="number"
                value={equityContributionPercent}
                onChange={(e) => setEquityContributionPercent(Number(e.target.value) || 0)}
                className="h-9 bg-input-soft pr-7"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-medium text-gray-400" style={{ fontSize: "13px" }}>
                %
              </span>
            </div>
          </FormField>
        </div>
        <p className="-mt-2 text-xs font-medium text-breadcrumb-root">
          * Equity = {formatCalculated(equity)}
        </p>
      </div>
    </Modal>
  )
}
