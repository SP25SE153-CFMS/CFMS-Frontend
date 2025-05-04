'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTask, CreateTaskSchema } from '@/utils/schemas/task.schema';

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
import { Checkbox } from '@/components/ui/checkbox';
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
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { CategoryType } from '@/utils/enum/category.enum';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { ResourceResponse } from '@/utils/types/custom.type';
import { getShifts } from '@/services/shift.service';
import { getBreedingAreasByFarmId } from '@/services/breeding-area.service';
import { getWareByFarmId, getWarestockResourceByFarm } from '@/services/warehouse.service';
import config from '@/configs';
import { createTask } from '@/services/task.service';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { formatDate } from '@/utils/functions';
import dayjs from 'dayjs';
import { TaskStatus } from '@/utils/enum/status.enum';
import { LOCATION_TYPES } from '@/utils/enum/location-type.enum';
import toast from 'react-hot-toast';
import Link from 'next/link';

export function CreateTaskForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationType, setLocationType] = useState<string>('');
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    const { data: shifts } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => getShifts(),
    });

    const { data: breedingAreas } = useQuery({
        queryKey: ['breeding-areas'],
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

    const form = useForm<CreateTask>({
        resolver: zodResolver(CreateTaskSchema),
        defaultValues: {
            taskName: '',
            taskTypeId: '',
            description: '',
            isHavest: false,
            status: TaskStatus.PENDING,
            frequency: 0,
            timeUnitId:
                getSubCategoryByCategoryType(CategoryType.TIME_UNIT)?.[0]?.subCategoryId || '',
            startWorkDate: new Date(),
            endWorkDate: new Date(),
            shiftIds: [],
            locationType: '',
            locationId: '',
            taskResources: [
                {
                    resourceId: '',
                    quantity: 0,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'taskResources',
    });

    const calculateWorkDates = useCallback(() => {
        const startDate = form.getValues('startWorkDate');
        const endDate = form.getValues('endWorkDate');
        const frequency = form.getValues('frequency');
        const timeUnitId = form.getValues('timeUnitId');
        const timeUnit = getSubCategoryByCategoryType(CategoryType.TIME_UNIT).find(
            (unit) => unit.subCategoryId === timeUnitId,
        );

        if (!startDate || !endDate || !frequency || !timeUnitId) return [];

        const dates: Date[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));

            switch (timeUnit?.subCategoryName.toLowerCase()) {
                case 'ngày':
                    currentDate = addDays(currentDate, frequency);
                    break;
                case 'tuần':
                    currentDate = addDays(currentDate, frequency * 7);
                    break;
                case 'tháng':
                    currentDate = addDays(currentDate, frequency * 30);
                    break;
                case 'năm':
                    currentDate = addDays(currentDate, frequency * 365);
                    break;
                default:
                    setSelectedDates([]);
                    return [];
            }
        }

        return dates;
    }, [form]);

    // Watch only relevant fields for date calculation
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            const relevantFields: (keyof CreateTask)[] = [
                'startWorkDate',
                'endWorkDate',
                'frequency',
                'timeUnitId',
            ];
            if (relevantFields.includes(name as keyof CreateTask)) {
                const dates = calculateWorkDates();
                setSelectedDates(dates);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, calculateWorkDates]);

    // Initial date calculation
    useEffect(() => {
        const dates = calculateWorkDates();
        setSelectedDates(dates);
    }, [calculateWorkDates]);

    // const mutation = useMutation({
    //     mutationFn: (values: CreateTask) => createTask(values),
    //     onSuccess: () => {
    //         toast.success('Tạo công việc thành công');
    //         router.push(config.routes.task);
    //         router.refresh();
    //     },
    //     onError: (error: any) => {
    //         console.error('Không thể tạo công việc:', error);
    //         toast(error?.response?.data?.message, { icon: '⚠️' });
    //     },
    // })

    async function onSubmit(values: any) {
        setIsSubmitting(true);
        try {
            values.startWorkDate = isFrequencyAssigned
                ? calculateWorkDates().map((d) => dayjs(d).format('YYYY-MM-DD'))
                : [dayjs(values.startWorkDate).format('YYYY-MM-DD')];
            values.endWorkDate = dayjs(values.endWorkDate).format('YYYY-MM-DD');
            values.isHavest = values.isHavest ? 1 : 0;
            values.farmId = getCookie(config.cookies.farmId) ?? '';
            await createTask(values);
            router.push(config.routes.task);
            router.refresh();
        } catch (error: any) {
            console.error('Không thể tạo công việc:', error);
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

    const [isFrequencyAssigned, setIsFrequencyAssigned] = useState(false);
    const renderScheduleSection = useMemo(
        () => (
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Lịch trình</h3>
                </div>
                <Separator />

                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox
                            checked={isFrequencyAssigned}
                            onCheckedChange={(checked: boolean) => setIsFrequencyAssigned(checked)}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Giao tuần tự</FormLabel>
                        <FormDescription>
                            Đánh dấu nếu công việc này liên quan đến giao tuần tự.
                        </FormDescription>
                    </div>
                </FormItem>

                {isFrequencyAssigned && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="frequency"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            Tần suất
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Nhập tần suất"
                                                className="h-10"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number.parseInt(e.target.value) || 0,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Số lần thực hiện trong một đơn vị thời gian
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="timeUnitId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Đơn vị thời gian{' '}
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Chọn đơn vị thời gian" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getSubCategoryByCategoryType(
                                                    CategoryType.TIME_UNIT,
                                                ).map((unit) => (
                                                    <SelectItem
                                                        key={unit.subCategoryId}
                                                        value={unit.subCategoryId}
                                                    >
                                                        {unit.subCategoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Đơn vị thời gian được sử dụng để tính toán tần suất công
                                            việc.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                name="endWorkDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            Ngày kết thúc{' '}
                                            <span className="text-destructive">*</span>
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
                        </div>

                        <CalendarComponent
                            mode="multiple"
                            selected={selectedDates}
                            pagedNavigation
                            numberOfMonths={3}
                            locale={vi}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border p-2 flex py-6 [&>div]:mx-auto"
                        />
                    </>
                )}

                {!isFrequencyAssigned && (
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
                )}

                <FormField
                    control={form.control}
                    name="shiftIds"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {shifts?.map((shift) => (
                                    <div
                                        key={shift.shiftId}
                                        className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent transition-colors"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(shift.shiftId)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([
                                                              ...field.value,
                                                              shift.shiftId,
                                                          ])
                                                        : field.onChange(
                                                              field.value?.filter(
                                                                  (value) =>
                                                                      value !== shift.shiftId,
                                                              ),
                                                          );
                                                }}
                                            />
                                        </FormControl>
                                        <label className="font-normal cursor-pointer flex-1 text-sm">
                                            {shift.shiftName} ({shift.startTime} - {shift.endTime})
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <FormMessage className="mt-2" />
                        </FormItem>
                    )}
                />
            </div>
        ),
        [form.control, shifts, selectedDates, isFrequencyAssigned],
    );

    const renderLocationSection = useMemo(
        () => (
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
                                        {LOCATION_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
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
        ),
        [breedingAreas, form.control, getCoopName, locationType, warehouses],
    );

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
                                    quantity: 0,
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
                                                            <SelectTrigger className="h-9 mt-1">
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
                                            name={`taskResources.${index}.quantity`}
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                {renderBasicInfoSection}
                {renderScheduleSection}
                {renderLocationSection}
                {renderResourcesSection}
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
                                Tạo Công Việc
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
