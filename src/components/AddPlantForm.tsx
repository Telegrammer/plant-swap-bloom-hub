
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// Создаем схему валидации
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Название растения должно быть не менее 3 символов",
  }),
  description: z.string().min(10, {
    message: "Описание должно содержать не менее 10 символов",
  }),
  imageUrl: z.string().url({
    message: "Пожалуйста, введите корректный URL изображения",
  }),
  waterDemand: z.number().min(1).max(3),
  sunDemand: z.number().min(1).max(3),
  size: z.enum(["small", "medium", "large"]),
  isIndoor: z.boolean(),
  types: z.array(z.string()).nonempty({
    message: "Выберите хотя бы один тип растения",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPlantFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const plantTypes = [
  { id: "flowering", label: "Цветущее" },
  { id: "succulent", label: "Суккулент" },
  { id: "herb", label: "Травянистое" },
  { id: "tropical", label: "Тропическое" },
  { id: "cactus", label: "Кактус" },
  { id: "foliage", label: "Декоративно-лиственное" },
];

const AddPlantForm = ({ onSubmit, onCancel }: AddPlantFormProps) => {
  const { toast } = useToast();
  const [waterValue, setWaterValue] = useState([2]);
  const [sunValue, setSunValue] = useState([2]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      waterDemand: 2,
      sunDemand: 2,
      size: "medium",
      isIndoor: true,
      types: [],
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
    toast({
      title: "Растение добавлено",
      description: "Ваше растение успешно добавлено в коллекцию",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название растения</FormLabel>
              <FormControl>
                <Input placeholder="Введите название растения" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите ваше растение"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL изображения</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waterDemand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Потребность в воде</FormLabel>
              <FormControl>
                <div className="pt-2">
                  <Slider
                    value={waterValue}
                    min={1}
                    max={3}
                    step={1}
                    onValueChange={(value) => {
                      setWaterValue(value);
                      field.onChange(value[0]);
                    }}
                  />
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>Низкая</span>
                    <span>Средняя</span>
                    <span>Высокая</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sunDemand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Потребность в свете</FormLabel>
              <FormControl>
                <div className="pt-2">
                  <Slider
                    value={sunValue}
                    min={1}
                    max={3}
                    step={1}
                    onValueChange={(value) => {
                      setSunValue(value);
                      field.onChange(value[0]);
                    }}
                  />
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>Слабый</span>
                    <span>Средний</span>
                    <span>Яркий</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Размер растения</FormLabel>
              <div className="flex gap-4 pt-2">
                <Button 
                  type="button" 
                  variant={field.value === "small" ? "default" : "outline"}
                  onClick={() => field.onChange("small")}
                  className="flex-1"
                >
                  Маленькое
                </Button>
                <Button 
                  type="button" 
                  variant={field.value === "medium" ? "default" : "outline"}
                  onClick={() => field.onChange("medium")}
                  className="flex-1"
                >
                  Среднее
                </Button>
                <Button 
                  type="button" 
                  variant={field.value === "large" ? "default" : "outline"}
                  onClick={() => field.onChange("large")}
                  className="flex-1"
                >
                  Большое
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isIndoor"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Комнатное растение</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Типы растения</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {plantTypes.map((type) => (
                  <FormField
                    key={type.id}
                    control={form.control}
                    name="types"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, type.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== type.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {type.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">Добавить растение</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPlantForm;
