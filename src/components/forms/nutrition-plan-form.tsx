'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    CreateNutritionPlanSchema,
    NutritionPlan,
    NutritionPlanSchema,
} from '@/utils/schemas/nutrition-plan.schema';
import { createNutritionPlan, updateNutritionPlan } from '@/services/nutrition-plan.service';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertCircle,
    Apple,
    ArrowRight,
    Calendar,
    Clock,
    Info,
    Leaf,
    Plus,
    ReceiptText,
    Salad,
    StickyNote,
    Tag,
    Trash2,
    Weight,
} from 'lucide-react';
import { useState } from 'react';
import type { CreateNutritionPlanDetail } from '@/utils/schemas/nutrition-plan-detail.schema';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import { CreateFSWithoutNutriPlan } from '@/utils/schemas/feed-session.schema';
import { TimePicker } from '../ui/time-picker';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { getWarestockResourceByFarm } from '@/services/warehouse.service';
import { getCookie } from 'cookies-next';
import { onError } from '@/utils/functions/form.function';
import Link from 'next/link';

interface NutritionPlanFormProps {
    defaultValues?: Partial<NutritionPlan>;
}

export default function NutritionPlanForm({ defaultValues }: NutritionPlanFormProps) {
    const router = useRouter();

    // Get all foods
    // const { data: foods, isLoading: foodsLoading } = useQuery({
    //     queryKey: ['foods'],
    //     queryFn: () => getFoods(),
    // });
    const RESOURCE_TYPE_NAME = 'food';
    const { data: foods, isLoading: foodsLoading } = useQuery({
        queryKey: ['foods'],
        queryFn: () => getWarestockResourceByFarm(RESOURCE_TYPE_NAME),
    });

    const [nutritionPlanDetails, setNutriPlanDetails] = useState<CreateNutritionPlanDetail[]>(
        defaultValues?.nutritionPlanDetails?.length
            ? defaultValues.nutritionPlanDetails
            : [
                  {
                      foodId: foods?.[0]?.foodId ?? '',
                      foodWeight: 0,
                      unitId: '',
                  },
              ],
    );

    const [feedSessions, setFeedSessions] = useState<CreateFSWithoutNutriPlan[]>(
        defaultValues?.feedSessions?.length
            ? defaultValues.feedSessions
            : [
                  {
                      startTime: '',
                      endTime: '',
                      feedAmount: 0,
                      unitId: '',
                      note: '',
                  },
              ],
    );

    // Initialize form
    const form = useForm<NutritionPlan>({
        resolver: zodResolver(defaultValues ? NutritionPlanSchema : CreateNutritionPlanSchema),
        defaultValues: {
            name: '',
            description: '',
            nutritionPlanDetails,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateNutritionPlan : createNutritionPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nutritionPlans'] });
            toast.success(
                defaultValues
                    ? 'Cập nhật chế độ dinh dưỡng thành công'
                    : 'Tạo chế độ dinh dưỡng thành công',
            );
            router.push(config.routes.nutritionPlan);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: NutritionPlan) {
        const newValues = {
            ...values,
            nutritionPlanDetails,
            feedSessions,
            farmId: getCookie(config.cookies.farmId) ?? '',
        };
        mutation.mutate(newValues);
    }

    const addNutriPlanDetail = () => {
        setNutriPlanDetails([
            ...nutritionPlanDetails,
            {
                foodId: foods?.[0]?.foodId ?? '',
                foodWeight: 0,
                unitId: '',
            },
        ]);
    };

    const removeNutriPlanDetail = (index: number) => {
        const newNutriPlanDetails = nutritionPlanDetails.filter((_, i) => i !== index);
        setNutriPlanDetails(newNutriPlanDetails);
    };

    const updateNutriPlanDetail = <K extends keyof CreateNutritionPlanDetail>(
        index: number,
        field: K,
        value: CreateNutritionPlanDetail[K],
    ) => {
        const newNutriPlanDetails = [...nutritionPlanDetails];
        newNutriPlanDetails[index][field] = value;
        setNutriPlanDetails(newNutriPlanDetails);
    };

    const addFeedSession = () => {
        setFeedSessions([
            ...feedSessions,
            {
                startTime: '',
                endTime: '',
                feedAmount: 0,
                unitId: '',
                note: '',
            },
        ]);
    };

    const removeFeedSession = (index: number) => {
        const newFeedSessions = feedSessions.filter((_, i) => i !== index);
        setFeedSessions(newFeedSessions);
    };

    const updateFeedSession = <K extends keyof CreateFSWithoutNutriPlan>(
        index: number,
        field: K,
        value: CreateFSWithoutNutriPlan[K],
    ) => {
        const newFeedSessions = [...feedSessions];
        newFeedSessions[index][field] = value;
        setFeedSessions(newFeedSessions);
    };

    if (foodsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                id="nutrition-plan-form"
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-bold flex items-center">
                                <Info className="mr-2 h-5 w-5 text-primary" />
                                Thông tin chế độ dinh dưỡng
                            </CardTitle>
                            <CardDescription>
                                Điền thông tin chi tiết về giai đoạn phát triển của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base flex items-center">
                                                <Tag className="mr-1 h-4 w-4 text-primary" />
                                                Tên chế độ
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập tên chế độ"
                                                    required
                                                    className="h-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base flex items-center">
                                                <ReceiptText className="mr-1 h-4 w-4 text-primary" />
                                                Mô tả
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Nhập mô tả chi tiết về giai đoạn phát triển này"
                                                    className="min-h-[100px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Nutrition Plan Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold flex items-center">
                                        <Salad className="mr-2 h-5 w-5 text-primary" />
                                        Danh sách thức ăn
                                    </CardTitle>
                                    <CardDescription>
                                        Thêm các loại thức ăn vào giai đoạn phát triển
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addNutriPlanDetail}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {nutritionPlanDetails.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Chưa có thức ăn</AlertTitle>
                                    <AlertDescription>
                                        Vui lòng thêm ít nhất một loại thức ăn vào chế độ dinh dưỡng
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                nutritionPlanDetails.map((item, index) => (
                                    <Card key={index} className="border border-muted">
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-4">
                                                    {/* Food Selection */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`nutritionPlanDetails.${index}.foodId`}
                                                        render={() => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center">
                                                                    <Apple className="mr-1 h-4 w-4 text-primary" />
                                                                    Sản phẩm
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        value={item.foodId}
                                                                        onValueChange={(value) =>
                                                                            updateNutriPlanDetail(
                                                                                index,
                                                                                'foodId',
                                                                                value,
                                                                            )
                                                                        }
                                                                        required
                                                                    >
                                                                        <SelectTrigger className="h-10">
                                                                            <SelectValue placeholder="Chọn sản phẩm" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {foods?.map((food) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        food.foodId
                                                                                    }
                                                                                    value={
                                                                                        food.foodId ??
                                                                                        ''
                                                                                    }
                                                                                >
                                                                                    {food.foodName}
                                                                                </SelectItem>
                                                                            ))}
                                                                            {foods?.length ===
                                                                                0 && (
                                                                                <Link
                                                                                    href={
                                                                                        config
                                                                                            .routes
                                                                                            .ware
                                                                                    }
                                                                                    className="text-sm font-medium flex items-center p-2"
                                                                                >
                                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                                    Nhấn vào đây để
                                                                                    tạo thức ăn
                                                                                </Link>
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Weight and Unit Selection */}
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Leaf className="mr-1 h-4 w-4 text-primary" />
                                                            Khối lượng
                                                        </FormLabel>
                                                        <div className="flex rounded-md shadow-sm">
                                                            <FormField
                                                                control={form.control}
                                                                name={`nutritionPlanDetails.${index}.foodWeight`}
                                                                render={() => (
                                                                    <FormControl>
                                                                        <Input
                                                                            className="rounded-e-none h-10"
                                                                            placeholder="Nhập số lượng"
                                                                            type="number"
                                                                            min={0}
                                                                            value={item.foodWeight}
                                                                            onChange={(e) =>
                                                                                updateNutriPlanDetail(
                                                                                    index,
                                                                                    'foodWeight',
                                                                                    Number(
                                                                                        e.target
                                                                                            .value,
                                                                                    ),
                                                                                )
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name={`nutritionPlanDetails.${index}.unitId`}
                                                                render={() => (
                                                                    <FormControl>
                                                                        <SelectNative
                                                                            className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-muted/50"
                                                                            value={item.unitId}
                                                                            onChange={(e) =>
                                                                                updateNutriPlanDetail(
                                                                                    index,
                                                                                    'unitId',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value=""
                                                                                disabled
                                                                                selected
                                                                                hidden
                                                                            >
                                                                                Đơn vị
                                                                            </option>
                                                                            {getSubCategoryByCategoryType(
                                                                                CategoryType.WEIGHT_UNIT,
                                                                            )?.map((unit) => (
                                                                                <option
                                                                                    key={
                                                                                        unit.subCategoryId
                                                                                    }
                                                                                    value={
                                                                                        unit.subCategoryId
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        unit.subCategoryName
                                                                                    }
                                                                                </option>
                                                                            ))}
                                                                        </SelectNative>
                                                                    </FormControl>
                                                                )}
                                                            />
                                                        </div>
                                                    </FormItem>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            {nutritionPlanDetails.length > 1 && (
                                                <div className="flex justify-end mt-4">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeNutriPlanDetail(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Xóa thức ăn
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Feed Sessions */}
                    <Card className="col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold flex items-center">
                                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                                        Lịch cho ăn
                                    </CardTitle>
                                    <CardDescription>
                                        Thêm các lịch cho ăn vào chế độ dinh dưỡng
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addFeedSession}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {feedSessions.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Chưa có lịch cho ăn</AlertTitle>
                                    <AlertDescription>
                                        Vui lòng thêm ít nhất một lịch cho ăn vào chế độ dinh dưỡng
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                feedSessions.map((item, index) => (
                                    <Card key={index} className="border border-muted">
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div className="space-y-4">
                                                    {/* Start Time Selection */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`feedSessions.${index}.startTime`}
                                                        render={() => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center">
                                                                    <Clock className="mr-1 h-4 w-4 text-primary" />
                                                                    Thời gian bắt đầu
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <TimePicker
                                                                        value={item.startTime}
                                                                        onChange={(value) =>
                                                                            updateFeedSession(
                                                                                index,
                                                                                'startTime',
                                                                                value,
                                                                            )
                                                                        }
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    {/* End Time Selection */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`feedSessions.${index}.endTime`}
                                                        render={() => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center">
                                                                    <Clock className="mr-1 h-4 w-4 text-primary" />
                                                                    Thời gian kết thúc
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <TimePicker
                                                                        value={item.endTime}
                                                                        onChange={(value) =>
                                                                            updateFeedSession(
                                                                                index,
                                                                                'endTime',
                                                                                value,
                                                                            )
                                                                        }
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Feed Amount Selection */}
                                                    <FormItem>
                                                        <FormLabel className="flex items-center">
                                                            <Weight className="mr-1 h-4 w-4 text-primary" />
                                                            Lượng cho ăn
                                                        </FormLabel>
                                                        <div className="flex rounded-md shadow-sm">
                                                            <FormField
                                                                control={form.control}
                                                                name={`feedSessions.${index}.feedAmount`}
                                                                render={() => (
                                                                    <FormControl>
                                                                        <Input
                                                                            className="rounded-e-none h-10"
                                                                            placeholder="Nhập số lượng"
                                                                            type="number"
                                                                            min={0}
                                                                            value={item.feedAmount}
                                                                            onChange={(e) =>
                                                                                updateFeedSession(
                                                                                    index,
                                                                                    'feedAmount',
                                                                                    Number(
                                                                                        e.target
                                                                                            .value,
                                                                                    ),
                                                                                )
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name={`feedSessions.${index}.unitId`}
                                                                render={() => (
                                                                    <FormControl>
                                                                        <SelectNative
                                                                            className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-muted/50"
                                                                            value={item.unitId}
                                                                            onChange={(e) =>
                                                                                updateFeedSession(
                                                                                    index,
                                                                                    'unitId',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value=""
                                                                                disabled
                                                                                selected
                                                                                hidden
                                                                            >
                                                                                Đơn vị
                                                                            </option>
                                                                            {getSubCategoryByCategoryType(
                                                                                CategoryType.WEIGHT_UNIT,
                                                                            )?.map((unit) => (
                                                                                <option
                                                                                    key={
                                                                                        unit.subCategoryId
                                                                                    }
                                                                                    value={
                                                                                        unit.subCategoryId
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        unit.subCategoryName
                                                                                    }
                                                                                </option>
                                                                            ))}
                                                                        </SelectNative>
                                                                    </FormControl>
                                                                )}
                                                            />
                                                        </div>
                                                    </FormItem>
                                                </div>

                                                <div className="space-y-4 col-span-2">
                                                    {/* Note */}
                                                    <FormField
                                                        control={form.control}
                                                        name={`feedSessions.${index}.note`}
                                                        render={() => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center">
                                                                    <StickyNote className="mr-1 h-4 w-4 text-primary" />
                                                                    Ghi chú
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        value={item.note}
                                                                        onChange={(e) =>
                                                                            updateFeedSession(
                                                                                index,
                                                                                'note',
                                                                                e.target.value,
                                                                            )
                                                                        }
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            {feedSessions.length > 1 && (
                                                <div className="flex justify-end mt-4">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeFeedSession(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Xóa lịch cho ăn
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center pt-4">
                    <Button
                        type="submit"
                        className="w-full max-w-xs h-11 font-medium"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <span className="flex items-center">
                                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></span>
                                Đang xử lý...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                {defaultValues ? 'Cập nhật' : 'Tạo chế độ'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
