'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { vi } from 'date-fns/locale';

import { UpdateTask, UpdateTaskSchema } from '@/utils/schemas/task.schema';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

import {
    CalendarIcon,
    Loader2,
    Clock,
    MapPin,
    CalendarPlus2Icon as CalendarIcon2,
    Type,
    FileText,
    CheckSquare,
    Package,
    ChevronDown,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryType } from '@/utils/enum/category.enum';
import { getSubCategoryByCategoryType, getTaskType } from '@/utils/functions/category.function';
import { ResourceResponse } from '@/utils/types/custom.type';
import { getShifts } from '@/services/shift.service';
import { getBreedingAreasByFarmId } from '@/services/breeding-area.service';
import { getWareByFarmId, getWarestockResourceByFarm } from '@/services/warehouse.service';
import config from '@/configs';
import { updateTask } from '@/services/task.service';
import { formatDate } from '@/utils/functions';
import dayjs from 'dayjs';
import { AssignmentRoleStatus, TaskStatus } from '@/utils/enum/status.enum';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '../ui/badge';
import { getEmployeesByFarmId } from '@/services/farm.service';
import MultipleSelector from '../ui/multiselect';

interface AssignedMember {
    assignedToId: string;
    status: number;
    assignedTo: string; // For display purposes only
}

export function UpdateTaskForm({ defaultValues }: { defaultValues?: UpdateTask }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationType, setLocationType] = useState<string>(defaultValues?.locationType || '');
    const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>(
        (defaultValues?.assignedTos as AssignedMember[]) || [],
    );
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
        assignedMembers.map((member) => member.assignedToId),
    );

    const { data: shifts } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => getShifts(),
    });

    const { data: breedingAreas } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: () => getBreedingAreasByFarmId(getCookie(config.cookies.farmId) || ''),
    });

    const { data: warehouses } = useQuery({
        queryKey: ['warehouses'],
        queryFn: () => getWareByFarmId(getCookie(config.cookies.farmId) || ''),
    });

    const RESOURCE_TYPE_NAME = 'all';
    const { data: resources } = useQuery({
        queryKey: ['resources'],
        queryFn: () => getWarestockResourceByFarm(RESOURCE_TYPE_NAME),
    });

    const { data: farmEmployees } = useQuery({
        queryKey: ['farmEmployees'],
        queryFn: () => getEmployeesByFarmId(getCookie(config.cookies.farmId) ?? ''),
    });

    useEffect(() => {
        if (shifts) {
            const currentShift = shifts.find(
                (shift) => shift.shiftName === defaultValues?.shiftName,
            );

            if (currentShift) {
                form.setValue('shiftId', currentShift.shiftId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shifts]);

    const resourceOptions = useMemo(() => {
        if (!resources) return [];
        // const filteredResources = resources.filter(
        //     (resource) => Number(resource.specQuantity?.split(' ')?.[0]) > 0,
        // );
        // return filteredResources?.map((resource) => ({
        return resources?.map((resource) => ({
            value:
                // resource.equipmentId ||
                // resource.medicineId ||
                // resource.foodId ||
                // resource.harvestProductId ||
                // resource.chickenId,
                resource.resourceId,
            label:
                resource.equipmentName ||
                resource.medicineName ||
                resource.foodName ||
                resource.harvestProductName ||
                resource.chickenName,
            specQuantity: resource.specQuantity,
            unitSpecification: resource.unitSpecification,
        }));
    }, [resources]);

    const form = useForm<UpdateTask>({
        resolver: zodResolver(UpdateTaskSchema),
        defaultValues: {
            taskName: '',
            taskTypeId: '',
            description: '',
            status: TaskStatus.PENDING,
            startWorkDate: new Date(),
            endWorkDate: new Date(),
            shiftId: '',
            locationType: '',
            locationId: '',
            taskResources: [],
            assignedTos: [],
            assignedDate: new Date(),
            note: '',
            ...defaultValues,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'taskResources',
    });

    async function onSubmit(values: any) {
        setIsSubmitting(true);
        try {
            values.startWorkDate = dayjs(values.startWorkDate).format('YYYY-MM-DD');
            values.endWorkDate = dayjs(values.endWorkDate).format('YYYY-MM-DD');
            values.assignedDate = dayjs(values.assignedDate).format('YYYY-MM-DD');
            values.isHavest = values.isHavest ? 1 : 0;
            values.farmId = getCookie(config.cookies.farmId) ?? '';
            values.assignedTos = assignedMembers.map((member) => ({
                assignedToId: member.assignedToId,
                status: member.status,
            }));
            await updateTask(values);
            router.push(`${config.routes.task}/${values.taskId}`);
        } catch (error: any) {
            console.error('Không thể cập nhật công việc:', error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        } finally {
            setIsSubmitting(false);
        }
    }

    function onError(error: any) {
        console.log(error);
    }

    const getCoopName = useCallback(
        (coopId: string) => {
            if (!breedingAreas) return 'Chọn chuồng nuôi';

            for (const area of breedingAreas) {
                const coop = area.chickenCoops.find((c) => c.chickenCoopId === coopId);
                if (coop) return coop.chickenCoopName;
            }

            return 'Chọn chuồng nuôi';
        },
        [breedingAreas],
    );

    // eslint-disable-next-line no-unused-vars
    const getResourceName = useCallback((resource?: ResourceResponse) => {
        if (!resource) return '';
        if (resource.equipment) return resource.equipment.equipmentName;
        if (resource.medicine) return resource.medicine.medicineName;
        if (resource.food) return resource.food.foodName;
        return '';
    }, []);

    // Handle adding a member to the assigned list
    const handleAddMember = useCallback(
        (options: any[]) => {
            const newMemberIds = options.map((option) => option.value);

            // Find newly added members
            const addedMemberIds = newMemberIds.filter((id) => !selectedMemberIds.includes(id));

            // Find members that were removed
            const removedMemberIds = selectedMemberIds.filter((id) => !newMemberIds.includes(id));

            // Update the assigned members list
            if (addedMemberIds.length > 0) {
                const newMembers = addedMemberIds.map((id) => {
                    const employee = farmEmployees?.find((emp) => emp.userId === id);
                    return {
                        assignedToId: id,
                        status: AssignmentRoleStatus.EMPLOYEE, // Default to "Nhân viên" (Employee)
                        assignedTo: employee?.user.fullName || '',
                    };
                });

                setAssignedMembers((prev) => [...prev, ...newMembers]);
            }

            // Remove members that were unselected
            if (removedMemberIds.length > 0) {
                setAssignedMembers((prev) =>
                    prev.filter((member) => !removedMemberIds.includes(member.assignedToId)),
                );
            }

            setSelectedMemberIds(newMemberIds);
        },
        [farmEmployees, selectedMemberIds],
    );

    // Handle changing a member's role
    const handleChangeRole = (memberId: string, newRole: AssignmentRoleStatus) => {
        // If changing to Team Leader (status 1), first reset all other members to Employee (status 0)
        if (newRole === AssignmentRoleStatus.TEAM_LEADER) {
            setAssignedMembers((prev) =>
                prev.map((member) => ({
                    ...member,
                    status:
                        member.assignedToId === memberId
                            ? AssignmentRoleStatus.TEAM_LEADER
                            : AssignmentRoleStatus.EMPLOYEE,
                })),
            );
        } else {
            // If changing to Employee, just update this member
            setAssignedMembers((prev) =>
                prev.map((member) =>
                    member.assignedToId === memberId ? { ...member, status: newRole } : member,
                ),
            );
        }
    };

    const renderBasicInfoSection = useMemo(
        () => (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="taskName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Tên công việc <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập tên công việc"
                                        {...field}
                                        className="h-10"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="taskTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Loại công việc <span className="text-destructive">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Chọn loại công việc" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {getSubCategoryByCategoryType(CategoryType.TASK_TYPE).map(
                                            (type) => (
                                                <SelectItem
                                                    key={type.subCategoryId}
                                                    value={type.subCategoryId}
                                                >
                                                    {type.description}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                Mô tả
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Nhập mô tả chi tiết về công việc này..."
                                    className="resize-none min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="isHavest"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Là công việc thu hoạch</FormLabel>
                                    <FormDescription>
                                        Đánh dấu nếu công việc này liên quan đến thu hoạch.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1">
                                    <BarChart3 className="h-4 w-4" />
                                    Trạng thái
                                </FormLabel>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(Number.parseInt(value))
                                    }
                                    defaultValue={field.value.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {mapEnumToValues(AssignmentStatus).map((status) => (
                                            <SelectItem value={status} key={status}>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={assignmentBadge[status]}
                                                    >
                                                        {assignmentStatusLabels[status]}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div> */}
            </div>
        ),
        [form.control],
    );

    const renderScheduleSection = useMemo(
        () => (
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Lịch trình</h3>
                </div>
                <Separator />

                <FormField
                    control={form.control}
                    name="startWorkDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>
                                Ngày bắt đầu <span className="text-destructive">*</span>
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'w-full pl-3 text-left font-normal h-10',
                                                !field.value && 'text-muted-foreground',
                                            )}
                                        >
                                            {formatDate(field.value)}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shiftId"
                    render={({ field }) => (
                        <FormItem className="border rounded-lg p-4">
                            <div className="mb-4">
                                <FormLabel className="text-base flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Ca làm việc <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormDescription>
                                    Chọn các ca làm việc cho công việc này.
                                </FormDescription>
                            </div>
                            <div>
                                {shifts && (
                                    <RadioGroup
                                        defaultValue={
                                            shifts?.find(
                                                (shift) =>
                                                    shift.shiftName === defaultValues?.shiftName,
                                            )?.shiftId
                                        }
                                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                    >
                                        {shifts?.map((shift) => (
                                            <div
                                                key={shift.shiftId}
                                                className="flex items-center space-x-2"
                                            >
                                                <RadioGroupItem
                                                    value={shift.shiftId}
                                                    id={shift.shiftId}
                                                />
                                                <Label htmlFor={shift.shiftId}>
                                                    {shift.shiftName} ({shift.startTime} -{' '}
                                                    {shift.endTime})
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}
                            </div>
                            <FormMessage className="mt-2" />
                        </FormItem>
                    )}
                />
            </div>
        ),
        [defaultValues?.shiftName, form.control, shifts],
    );

    const renderLocationSection = useMemo(() => {
        return (
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Địa điểm</h3>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="locationType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Loại địa điểm <span className="text-destructive">*</span>
                                </FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setLocationType(value);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Chọn loại địa điểm" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* {LOCATION_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))} */}
                                        <SelectItem key="COOP" value="COOP">
                                            Chuồng nuôi
                                        </SelectItem>
                                        {(getTaskType(form.getValues('taskTypeId'))?.includes(
                                            'dọn dẹp',
                                        ) ||
                                            getTaskType(form.getValues('taskTypeId'))?.includes(
                                                'khác',
                                            )) && (
                                            <SelectItem key="WARE" value="WARE">
                                                Nhà kho
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                            <FormItem
                                className={locationType ? '' : 'opacity-50 pointer-events-none'}
                            >
                                <FormLabel>
                                    Vị Trí <span className="text-destructive">*</span>
                                </FormLabel>
                                {locationType === 'COOP' && (
                                    <FormControl>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between h-10"
                                                >
                                                    {field.value
                                                        ? getCoopName(field.value)
                                                        : 'Chọn chuồng nuôi'}
                                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuGroup>
                                                    {breedingAreas?.map((area) => (
                                                        <DropdownMenuSub key={area.breedingAreaId}>
                                                            <DropdownMenuSubTrigger>
                                                                {area.breedingAreaName}
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    {area.chickenCoops.map(
                                                                        (coop) => (
                                                                            <DropdownMenuItem
                                                                                key={
                                                                                    coop.chickenCoopId
                                                                                }
                                                                                onClick={() => {
                                                                                    field.onChange(
                                                                                        coop.chickenCoopId,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {
                                                                                    coop.chickenCoopName
                                                                                }
                                                                            </DropdownMenuItem>
                                                                        ),
                                                                    )}
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                    ))}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FormControl>
                                )}
                                {locationType === 'WARE' && (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Chọn kho" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {warehouses?.map((warehouse) => (
                                                <SelectItem
                                                    key={warehouse.wareId}
                                                    value={warehouse.wareId}
                                                >
                                                    {warehouse.warehouseName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breedingAreas, form, form.watch('taskTypeId'), getCoopName, locationType, warehouses]);

    const renderResourcesSection = useMemo(
        () => (
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Vật phẩm</h3>
                </div>
                <Separator />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <FormLabel className="text-base">Vật phẩm cần thiết</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                append({
                                    resourceId: '',
                                    supplierId: '',
                                    suppliedQuantity: 0,
                                    consumedQuantity: 0,
                                })
                            }
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            Thêm vật phẩm
                        </Button>
                    </div>

                    <FormDescription>
                        Thêm các vật phẩm cần thiết cho công việc này và chọn đơn vị tính.
                    </FormDescription>

                    {fields.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="p-6 text-center text-muted-foreground">
                                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Chưa có vật phẩm nào được thêm</p>
                                <p className="text-sm mt-1">
                                    Nhấn &quot;Thêm vật phẩm&quot; để bắt đầu
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {fields.map((resource, index) => (
                                <div
                                    key={resource.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start border rounded-md p-3"
                                >
                                    <div className="md:col-span-8">
                                        <FormField
                                            control={form.control}
                                            name={`taskResources.${index}.resourceId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm">
                                                        Vật phẩm
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-auto mt-1">
                                                                <SelectValue placeholder="Chọn vật phẩm" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {resourceOptions?.map((res) => (
                                                                <SelectItem
                                                                    key={res.value}
                                                                    value={res.value}
                                                                >
                                                                    <div className="flex flex-col items-start justify-between">
                                                                        {/* {getResourceName(res)} */}
                                                                        <strong>{res.label}</strong>
                                                                        <div className="text-sm text-muted-foreground mt-1">
                                                                            <p className="text-left">
                                                                                Tồn kho:{' '}
                                                                                {res.specQuantity}
                                                                            </p>
                                                                            <p className="text-left">
                                                                                Quy cách:{' '}
                                                                                {
                                                                                    res.unitSpecification
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                            {resourceOptions?.length === 0 && (
                                                                <Link
                                                                    href={config.routes.ware}
                                                                    className="text-sm font-medium flex items-center p-2"
                                                                >
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    Nhấn vào đây để thêm vật phẩm
                                                                    trong kho
                                                                </Link>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="md:col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`taskResources.${index}.suppliedQuantity`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm">
                                                        Số lượng
                                                    </FormLabel>
                                                    <Input
                                                        type="number"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        min={0}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {fields.length > 0 && (
                                        <div className="flex justify-end items-end h-full pb-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        ),
        [fields, append, form.control, resourceOptions, remove],
    );

    const renderAssignmentsSection = useMemo(
        () => (
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Phân công</h3>
                </div>
                <Separator />

                {/* Assigned Date */}
                <FormField
                    control={form.control}
                    name="assignedDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ngày phân công</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-full pl-3 text-left font-normal')}
                                        >
                                            {formatDate(field.value)}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : new Date()}
                                        onSelect={field.onChange}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Note */}
                <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập ghi chú" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="assignedTos"
                    render={() => {
                        return (
                            <FormItem>
                                <FormLabel>Người được phân công</FormLabel>
                                <FormControl>
                                    {farmEmployees && (
                                        <MultipleSelector
                                            commandProps={{
                                                label: 'Chọn người được phân công',
                                            }}
                                            onChange={(value) => {
                                                handleAddMember(value);
                                            }}
                                            defaultOptions={farmEmployees?.map((employee) => ({
                                                value: employee.userId,
                                                label: employee.user.fullName,
                                            }))}
                                            value={assignedMembers?.map((member) => ({
                                                value: member.assignedToId,
                                                label: member.assignedTo || '',
                                            }))}
                                            placeholder="Chọn người được phân công"
                                            hideClearAllButton
                                            hidePlaceholderWhenSelected
                                        />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                {/* Team Member Roles */}
                {assignedMembers.length > 0 && (
                    <div className="space-y-3 border rounded-md p-3 bg-muted/20 mt-2">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Vai trò trong nhóm</h3>
                            <Badge variant="outline" className="bg-muted text-xs">
                                {
                                    assignedMembers.filter(
                                        (m) => m.status === AssignmentRoleStatus.TEAM_LEADER,
                                    ).length
                                }{' '}
                                / 1 Đội trưởng
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            {assignedMembers.map((member) => (
                                <div
                                    key={member.assignedToId}
                                    className="flex items-center justify-between bg-background p-2 rounded-md"
                                >
                                    <span className="text-sm font-medium">{member.assignedTo}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                member.status === AssignmentRoleStatus.TEAM_LEADER
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={cn(
                                                'cursor-pointer hover:bg-primary/90',
                                                member.status === AssignmentRoleStatus.TEAM_LEADER
                                                    ? 'bg-primary'
                                                    : 'bg-muted hover:text-primary-foreground',
                                            )}
                                            onClick={() =>
                                                handleChangeRole(
                                                    member.assignedToId,
                                                    AssignmentRoleStatus.TEAM_LEADER,
                                                )
                                            }
                                        >
                                            Đội trưởng
                                        </Badge>
                                        <Badge
                                            variant={
                                                member.status === AssignmentRoleStatus.EMPLOYEE
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={cn(
                                                'cursor-pointer hover:bg-primary/90',
                                                member.status === AssignmentRoleStatus.EMPLOYEE
                                                    ? 'bg-primary'
                                                    : 'bg-muted hover:text-primary-foreground',
                                            )}
                                            onClick={() =>
                                                handleChangeRole(
                                                    member.assignedToId,
                                                    AssignmentRoleStatus.EMPLOYEE,
                                                )
                                            }
                                        >
                                            Nhân viên
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ),
        [assignedMembers, farmEmployees, form.control, handleAddMember],
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                {renderBasicInfoSection}
                {renderScheduleSection}
                {renderLocationSection}
                {renderResourcesSection}
                {renderAssignmentsSection}
                <div className="pt-6 border-t flex justify-end gap-3">
                    <Button type="button" variant="outline">
                        Hủy Bỏ
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang Gửi...
                            </>
                        ) : (
                            <>
                                <CheckSquare className="mr-2 h-4 w-4" />
                                Cập Nhật Công Việc
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
