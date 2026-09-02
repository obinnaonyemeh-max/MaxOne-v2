import { useMemo, useState } from "react"
import { Target } from "lucide-react"
import { toast } from "sonner"

import { TopBar, PageHeader, ConfirmModal } from "@/components/max"
import { Button } from "@/components/ui/button"
import {
  mockRetailScorecardAttributes,
  mockPriorityMarkThresholds,
  getAttributeMarks,
  type ScorecardAttribute,
  type PriorityMarkThreshold,
} from "@/data/mockRetailScorecardAttributes"
import { CreateAttributeCard } from "./CreateAttributeCard"
import { AttributeScorecardCard } from "./AttributeScorecardCard"
import { CreateAttributeModal, type CreateAttributeInput } from "./CreateAttributeModal"
import { SetPriorityMarkModal } from "./SetPriorityMarkModal"

let nextAttributeSeq = mockRetailScorecardAttributes.length + 1
let nextOptionSeq = 1000

export default function RetailScorecardConfigPage() {
  const [attributes, setAttributes] = useState<ScorecardAttribute[]>(mockRetailScorecardAttributes)
  const [thresholds, setThresholds] = useState<PriorityMarkThreshold[]>(mockPriorityMarkThresholds)

  const [showCreate, setShowCreate] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState<ScorecardAttribute | null>(null)
  const [deletingAttribute, setDeletingAttribute] = useState<ScorecardAttribute | null>(null)
  const [showPriorityMark, setShowPriorityMark] = useState(false)

  const totalMarks = useMemo(
    () => attributes.reduce((sum, attribute) => sum + getAttributeMarks(attribute), 0),
    [attributes]
  )

  const handleSaveAttribute = (input: CreateAttributeInput) => {
    if (editingAttribute) {
      setAttributes((prev) =>
        prev.map((a) =>
          a.id === editingAttribute.id
            ? { ...a, name: input.name, options: input.options.map((o) => ({ ...o, id: `opt-${nextOptionSeq++}` })) }
            : a
        )
      )
      toast.success("Attribute updated", { description: `${input.name} has been updated.` })
      setEditingAttribute(null)
    } else {
      const newAttribute: ScorecardAttribute = {
        id: `attribute-${nextAttributeSeq++}`,
        name: input.name,
        createdAt: new Date().toISOString().slice(0, 10),
        options: input.options.map((o) => ({ ...o, id: `opt-${nextOptionSeq++}` })),
      }
      setAttributes((prev) => [newAttribute, ...prev])
      toast.success("Attribute created", { description: `${newAttribute.name} has been added to the scorecard.` })
    }
    setShowCreate(false)
  }

  const handleDeleteAttribute = () => {
    if (!deletingAttribute) return
    setAttributes((prev) => prev.filter((a) => a.id !== deletingAttribute.id))
    toast.success("Attribute deleted", { description: `${deletingAttribute.name} has been removed.` })
    setDeletingAttribute(null)
  }

  return (
    <>
      <TopBar
        breadcrumbs={[
          { label: "Portfolio" },
          { label: "Credit & Underwriting" },
          { label: "Retail Scorecard Configurations" },
        ]}
      />

      <div className="px-6 flex items-start justify-between">
        <PageHeader
          title="Retail Scorecard Configurations"
          subtitle="Manage credit scoring attributes, weighting marks, and option categories for champion retail underwriting"
          className="px-0"
        />
        <div className="flex items-center gap-2 py-6">
          <Button
            className="h-10 gap-2 bg-brand-dark text-white hover:bg-brand-dark/90"
            onClick={() => setShowPriorityMark(true)}
          >
            <Target className="h-4 w-4" />
            Set Priority Mark
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateAttributeCard onClick={() => setShowCreate(true)} />
          {attributes.map((attribute) => (
            <AttributeScorecardCard
              key={attribute.id}
              attribute={attribute}
              onEdit={() => setEditingAttribute(attribute)}
              onDelete={() => setDeletingAttribute(attribute)}
            />
          ))}
        </div>
      </div>

      <CreateAttributeModal
        open={showCreate || editingAttribute !== null}
        attribute={editingAttribute}
        onClose={() => {
          setShowCreate(false)
          setEditingAttribute(null)
        }}
        onSave={handleSaveAttribute}
      />

      <SetPriorityMarkModal
        open={showPriorityMark}
        onClose={() => setShowPriorityMark(false)}
        thresholds={thresholds}
        totalMarks={totalMarks}
        onSave={(next) => {
          setThresholds(next)
          setShowPriorityMark(false)
          toast.success("Priority marks updated", { description: "The priority scoring thresholds have been saved." })
        }}
      />

      <ConfirmModal
        open={deletingAttribute !== null}
        onOpenChange={(open) => !open && setDeletingAttribute(null)}
        title="Delete Attribute?"
        subtitle={`"${deletingAttribute?.name}" and its option categories will be permanently removed from the scorecard.`}
        variant="destructive"
        primaryAction={{ label: "Delete Attribute", onClick: handleDeleteAttribute }}
        secondaryAction={{ label: "Cancel", onClick: () => setDeletingAttribute(null) }}
      />
    </>
  )
}
