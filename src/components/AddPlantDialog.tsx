
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddPlantForm from "./AddPlantForm";

interface AddPlantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plantData: any) => void;
}

export function AddPlantDialog({ isOpen, onClose, onAddPlant }: AddPlantDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить новое растение</DialogTitle>
        </DialogHeader>
        <AddPlantForm
          onSubmit={onAddPlant}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
