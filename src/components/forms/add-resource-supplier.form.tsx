"use client"

import { type CreateResourceSupplier, CreateResourceSupplierSchema } from "@/utils/schemas/resource-supplier.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getWarestockResourceByFarm } from "@/services/warehouse.service"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { addResourceSupplier } from "@/services/supplier.service"
import toast from "react-hot-toast"
import { BanknoteIcon, Loader2, PackageIcon, ScrollTextIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

interface CreateResourceProps {
  closeModal: () => void
  supplierId: string
}

export default function AddResourceSupplier({ closeModal, supplierId }: CreateResourceProps) {
  const form = useForm<CreateResourceSupplier>({
    resolver: zodResolver(CreateResourceSupplierSchema),
    defaultValues: {
      description: "",
      supplierId: supplierId,
      resourceId: "",
      price: 0,
    },
  })

  // Get resource id
  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: () => getWarestockResourceByFarm("all"),
  })

  const resourceOptions = resources?.map((resource) => ({
    value: resource.resourceId,
    label: resource.equipmentName || resource.medicineName || resource.foodName || resource.chickenName,
  }))

  // Query client
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addResourceSupplier,
    onSuccess: () => {
      closeModal()
      queryClient.invalidateQueries({ queryKey: ["resources", supplierId] })
      toast.success("Đã thêm sản phẩm vào nhà cung cấp.")
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra")
    },
  })

  const onSubmit = async (values: CreateResourceSupplier) => {
    const formattedData = {
      ...values,
      price: Number(values.price),
      supplierId: supplierId,
    }
    await mutation.mutateAsync(formattedData)
  }

  const onError = (error: any) => {
    console.error(error)
  }

  return (
    <Card className="w-full shadow-sm border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Thêm sản phẩm mới</CardTitle>
        <CardDescription>Thêm sản phẩm vào danh sách của nhà cung cấp này</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <PackageIcon className="h-4 w-4" />
                      <span>Tài nguyên</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={resourcesLoading ? "Đang tải..." : "Chọn tài nguyên"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resourceOptions?.map((res) => (
                          <SelectItem key={res.value} value={res.value}>
                            {res.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <BanknoteIcon className="h-4 w-4" />
                      <span>Giá</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập giá sản phẩm"
                        min={0}
                        className="h-10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <ScrollTextIcon className="h-4 w-4" />
                      <span>Mô tả</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Nhập mô tả sản phẩm (tuỳ chọn)" className="h-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-between px-0 pt-2">
              <Button type="button" variant="outline" onClick={closeModal} disabled={mutation.isPending}>
                Huỷ bỏ
              </Button>
              <Button type="submit" className="min-w-[120px]" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Thêm sản phẩm"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
