'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle, CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
    AssignmentSchema,
    CreateAssignmentSchema,
    type Assignment,
} from '@/utils/schemas/assignment.schema';
import { createAssignment, updateAssignment } from '@/services/assignment.service';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTasksByFarmId } from '@/services/task.service';
import { getEmployeesByFarmId } from '@/services/farm.service';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { Textarea } from '../ui/textarea';
import { TaskStatus } from '@/utils/enum/status.enum';
import { vi } from 'date-fns/locale';
import { formatDate } from '@/utils/functions';
import MultipleSelector from '../ui/multiselect';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { onError } from '@/utils/functions/form.function';
import { useParams } from 'next/navigation';

interface AssignmentFormProps {
    defaultValues?: Partial<Assignment>;
    closeDialog: () => void;
}

// Define the structure for assigned team members with roles
interface AssignedMember {
    assignedToId: string;
    status: number;
    name?: string; // For display purposes only
}

export default function AssignmentForm({ defaultValues, closeDialog }: AssignmentFormProps) {
    const { taskId }: { taskId: string } = useParams();
    // Initialize form
    const form = useForm<Assignment>({
        resolver: zodResolver(defaultValues ? AssignmentSchema : CreateAssignmentSchema),
        defaultValues: {
            assignmentId: '',
            taskId: taskId || '',
            assignedToId: '',
            assignedDate: new Date().toISOString(),
            // status: AssignmentStatus.ASSIGNED,
            note: '',
            ...defaultValues,
        },
    });

    const farmId = getCookie(config.cookies.farmId) ?? '';

    const { data: tasks, isLoading: isTaskLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const tasks = await getTasksByFarmId(farmId);
            return tasks.filter((task) => task.status === TaskStatus.PENDING);
        },
    });

    const { data: farmEmployees, isLoading: isEmployeesLoading } = useQuery({
        queryKey: ['farmEmployees'],
        queryFn: () => getEmployeesByFarmId(getCookie(config.cookies.farmId) ?? ''),
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateAssignment : createAssignment,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            toast.success(
                defaultValues ? 'Cập nhật phân công thành công' : 'Tạo phân công thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // State for selected team members with their roles
    const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const [teamLeaderError, setTeamLeaderError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(true);

    // Validate team leader count
    useEffect(() => {
        const teamLeaderCount = assignedMembers.filter((member) => member.status === 0).length;

        // if (assignedMembers.length > 0 && teamLeaderCount === 0) {
        //     setTeamLeaderError('Vui lòng chỉ định một Đội trưởng cho nhóm');
        //     setIsFormValid(false);
        // } else
        if (teamLeaderCount > 1) {
            setTeamLeaderError('Chỉ được phép có một Đội trưởng trong nhóm');
            setIsFormValid(false);
        } else {
            setTeamLeaderError(null);
            setIsFormValid(true);
        }
    }, [assignedMembers]);

    // Form submit handler
    async function onSubmit(values: any) {
        // Validate team leader count before submission
        const teamLeaderCount = assignedMembers.filter((member) => member.status === 0).length;

        if (teamLeaderCount !== 1) {
            if (teamLeaderCount === 0) {
                toast('Vui lòng chỉ định một Đội trưởng cho nhóm', { icon: '⚠️' });
            } else {
                toast('Chỉ được phép có một Đội trưởng trong nhóm', { icon: '⚠️' });
            }
            return;
        }

        // Format the request according to the new structure
        const formattedValues = {
            ...values,
            assignedTos: assignedMembers.map((member) => ({
                assignedToId: member.assignedToId,
                status: member.status,
            })),
            assignedDate: dayjs(values.assignedDate).format('YYYY-MM-DD'),
        };

        mutation.mutate(formattedValues);
    }

    // Handle adding a member to the assigned list
    const handleAddMember = (options: any[]) => {
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
                    status: 1, // Default to "Nhân viên" (Employee)
                    name: employee?.user.fullName || 'Unknown',
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
    };

    // Handle changing a member's role
    const handleChangeRole = (memberId: string, newRole: number) => {
        // If changing to Team Leader (status 0), first reset all other members to Employee (status 1)
        if (newRole === 0) {
            setAssignedMembers((prev) =>
                prev.map((member) => ({
                    ...member,
                    status: member.assignedToId === memberId ? 0 : 1,
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

    if (isTaskLoading || isEmployeesLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    <div className="flex flex-col justify-between gap-4">
                        {/* Task ID */}
                        <FormField
                            control={form.control}
                            name="taskId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Công việc</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn công việc" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tasks?.map((task) => (
                                                    <SelectItem
                                                        key={task.taskId}
                                                        value={task.taskId}
                                                    >
                                                        {task.taskName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                    )}
                                                >
                                                    {formatDate(field.value)}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent align="start">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    field.value ? new Date(field.value) : new Date()
                                                }
                                                onSelect={(date) =>
                                                    field.onChange(date?.toISOString())
                                                }
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
                    </div>

                    <div>
                        {/* Assigned To ID */}
                        <FormField
                            control={form.control}
                            name="assignedToId"
                            render={() => {
                                return (
                                    <FormItem>
                                        <FormLabel>Người được phân công</FormLabel>
                                        <FormControl>
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
                                                placeholder="Chọn người được phân công"
                                                hideClearAllButton
                                                hidePlaceholderWhenSelected
                                            />
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
                                        {assignedMembers.filter((m) => m.status === 0).length} / 1
                                        Đội trưởng
                                    </Badge>
                                </div>

                                {teamLeaderError && (
                                    <Alert variant="destructive" className="py-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Lỗi</AlertTitle>
                                        <AlertDescription>{teamLeaderError}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    {assignedMembers.map((member) => (
                                        <div
                                            key={member.assignedToId}
                                            className="flex items-center justify-between bg-background p-2 rounded-md"
                                        >
                                            <span className="text-sm font-medium">
                                                {member.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        member.status === 0 ? 'default' : 'outline'
                                                    }
                                                    className={cn(
                                                        'cursor-pointer hover:bg-primary/90',
                                                        member.status === 0
                                                            ? 'bg-primary'
                                                            : 'bg-muted hover:text-primary-foreground',
                                                    )}
                                                    onClick={() =>
                                                        handleChangeRole(member.assignedToId, 0)
                                                    }
                                                >
                                                    Đội trưởng
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        member.status === 1 ? 'default' : 'outline'
                                                    }
                                                    className={cn(
                                                        'cursor-pointer hover:bg-primary/90',
                                                        member.status === 1
                                                            ? 'bg-primary'
                                                            : 'bg-muted hover:text-primary-foreground',
                                                    )}
                                                    onClick={() =>
                                                        handleChangeRole(member.assignedToId, 1)
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
                </div>
                <Button
                    type="submit"
                    className="mx-auto mt-6 w-60"
                    disabled={mutation.isPending || assignedMembers.length === 0 || !isFormValid}
                >
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Giao việc
                </Button>
            </form>
        </Form>
    );
}
