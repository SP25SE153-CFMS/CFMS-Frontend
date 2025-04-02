"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import dayjs from "dayjs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  Package2Icon,
  TagIcon,
  ClipboardListIcon,
  InfoIcon,
  PillIcon,
  Stethoscope,
  Wrench,
  AlertCircle,
  FileText,
  CheckCircle2,
} from "lucide-react"
import { getResourceSuppliersById } from "@/services/supplier.service"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Function để kiểm tra loại resource
const isFood = (resource: any) => resource.foodCode && resource.foodName
const isMedicine = (resource: any) => resource.medicineCode && resource.medicineName
const isEquipment = (resource: any) => resource.equipmentCode && resource.equipmentName

// Function để lấy màu badge dựa vào loại resource
const getResourceBadgeColor = (type: string) => {
  switch (type) {
    case "Thực phẩm":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "Dược phẩm":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "Thiết bị":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function ResourceSuppliers() {
  const { supplierId }: { supplierId: string } = useParams()
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources", supplierId],
    queryFn: () => getResourceSuppliersById(supplierId),
    enabled: !!supplierId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] w-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] w-full text-muted-foreground">
        <ClipboardListIcon className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-lg font-medium">Không có dữ liệu</p>
      </div>
    )
  }

  // Nhóm resources theo loại
  const foodResources = resources.filter((r) => r.resourceType === "Thực phẩm")
  const medicineResources = resources.filter((r) => r.resourceType === "Dược phẩm")
  const equipmentResources = resources.filter((r) => r.resourceType === "Thiết bị")
  const otherResources = resources.filter(
    (r) => r.resourceType !== "Thực phẩm" && r.resourceType !== "Dược phẩm" && r.resourceType !== "Thiết bị",
  )

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
          Thông tin chi tiết
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {resources.length} mục
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full flex-1 flex flex-col">
        <TabsList className="mb-4 w-full grid grid-cols-5 h-auto p-1">
          <TabsTrigger value="all" className="text-sm py-2">
            Tất cả ({resources.length})
          </TabsTrigger>
          {foodResources.length > 0 && (
            <TabsTrigger value="food" className="text-sm py-2">
              Thực phẩm ({foodResources.length})
            </TabsTrigger>
          )}
          {medicineResources.length > 0 && (
            <TabsTrigger value="medicine" className="text-sm py-2">
              Dược phẩm ({medicineResources.length})
            </TabsTrigger>
          )}
          {equipmentResources.length > 0 && (
            <TabsTrigger value="equipment" className="text-sm py-2">
              Thiết bị ({equipmentResources.length})
            </TabsTrigger>
          )}
          {otherResources.length > 0 && (
            <TabsTrigger value="other" className="text-sm py-2">
              Khác ({otherResources.length})
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 flex flex-col">
          <TabsContent value="all" className="mt-0 flex-1 h-full">
            <ResourceList resources={resources} />
          </TabsContent>

          {foodResources.length > 0 && (
            <TabsContent value="food" className="mt-0 flex-1 h-full">
              <ResourceList resources={foodResources} />
            </TabsContent>
          )}

          {medicineResources.length > 0 && (
            <TabsContent value="medicine" className="mt-0 flex-1 h-full">
              <ResourceList resources={medicineResources} />
            </TabsContent>
          )}

          {equipmentResources.length > 0 && (
            <TabsContent value="equipment" className="mt-0 flex-1 h-full">
              <ResourceList resources={equipmentResources} />
            </TabsContent>
          )}

          {otherResources.length > 0 && (
            <TabsContent value="other" className="mt-0 flex-1 h-full">
              <ResourceList resources={otherResources} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}

function ResourceList({ resources }: { resources: any[] }) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] w-full pr-2">
      <div className="space-y-6 pb-6">
        {resources.map((resource, index) => (
          <Card
            key={index}
            className="border border-border/40 transition-all duration-200 hover:border-primary/30 hover:shadow-md overflow-hidden w-full"
          >
            <CardContent className="p-0">
              <div className="bg-muted/30 px-6 py-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {resource.resourceType === "Thực phẩm" && <Package2Icon className="w-5 h-5 text-green-600" />}
                    {resource.resourceType === "Dược phẩm" && <PillIcon className="w-5 h-5 text-blue-600" />}
                    {resource.resourceType === "Thiết bị" && <Wrench className="w-5 h-5 text-amber-600" />}
                    <span className="font-medium text-base">
                      {resource.resourceType === "Thực phẩm" && (resource as any).foodName}
                      {resource.resourceType === "Dược phẩm" && (resource as any).medicineName}
                      {resource.resourceType === "Thiết bị" && (resource as any).equipmentName}
                      {!["Thực phẩm", "Dược phẩm", "Thiết bị"].includes(resource.resourceType) && "Tài nguyên khác"}
                    </span>
                  </div>
                  <Badge className={`font-normal ${getResourceBadgeColor(resource.resourceType)}`}>
                    {resource.resourceType}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cột 1 - Thông tin chung + thông tin đặc trưng */}
                  <div className="space-y-4">
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TagIcon className="w-4 h-4" />
                        Thông tin cơ bản
                      </h4>
                      <div className="space-y-3">
                        {/* Thông tin đặc trưng theo loại */}
                        {resource.resourceType === "Thực phẩm" && (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium min-w-28">Mã thức ăn:</span>
                              <span className="text-sm">{(resource as any).foodCode}</span>
                            </div>
                          </>
                        )}

                        {resource.resourceType === "Dược phẩm" && (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium min-w-28">Mã thuốc:</span>
                              <span className="text-sm">{(resource as any).medicineCode}</span>
                            </div>
                          </>
                        )}

                        {resource.resourceType === "Thiết bị" && (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium min-w-28">Mã thiết bị:</span>
                              <span className="text-sm">{(resource as any).equipmentCode}</span>
                            </div>
                          </>
                        )}

                        {/* Đơn vị */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium min-w-28">Đơn vị:</span>
                          <span className="text-sm">{resource.unitSpecification || "Không có"}</span>
                        </div>

                        {/* Giá */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium min-w-28">Giá:</span>
                          <span className="text-sm font-medium text-primary">
                            {resource.price?.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin đặc trưng theo loại */}
                    {resource.resourceType === "Dược phẩm" && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-700">
                          <Stethoscope className="w-4 h-4" />
                          Thông tin thuốc
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-28">Cách dùng:</span>
                            <span className="text-sm">{(resource as any).usage || "Không có"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-28">Liều lượng:</span>
                            <span className="text-sm">{(resource as any).dosageForm || "Không có"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {resource.resourceType === "Thiết bị" && (
                      <div className="bg-amber-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-amber-700">
                          <Wrench className="w-4 h-4" />
                          Thông tin thiết bị
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-28">Chất liệu:</span>
                            <span className="text-sm">{(resource as any).material || "Không có"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-28">Bảo hành:</span>
                            <span className="text-sm">
                              {(resource as any).warranty ? `${(resource as any).warranty} tháng` : "Không có"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cột 2 - Thông tin về thời gian + mô tả */}
                  <div className="space-y-4">
                    {/* Thông tin thời gian */}
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Thông tin thời gian
                      </h4>
                      <div className="space-y-3">
                        {resource.productionDate && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-28">Ngày sản xuất:</span>
                            <span className="text-sm">
                              {dayjs(new Date(resource.productionDate)).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        )}

                        {resource.expiryDate && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-28">Hạn sử dụng:</span>
                            <span className="text-sm">{dayjs(new Date(resource.expiryDate)).format("DD/MM/YYYY")}</span>
                          </div>
                        )}

                        {resource.purchaseDate && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-28">Ngày mua:</span>
                            <span className="text-sm">
                              {dayjs(new Date(resource.purchaseDate)).format("DD/MM/YYYY")}
                            </span>
                          </div>
                        )}

                        {!resource.productionDate && !resource.expiryDate && !resource.purchaseDate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Không có thông tin thời gian</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Mô tả chi tiết
                      </h4>
                      <div className="space-y-3">
                        {resource.description ? (
                          <p className="text-sm whitespace-pre-line">{resource.description}</p>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <InfoIcon className="w-4 h-4" />
                            <span className="text-sm">Không có mô tả</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ghi chú (chỉ cho thực phẩm) */}
                    {isFood(resource) && (resource as any).note && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="w-4 h-4" />
                          Ghi chú
                        </h4>
                        <p className="text-sm whitespace-pre-line">{(resource as any).note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

