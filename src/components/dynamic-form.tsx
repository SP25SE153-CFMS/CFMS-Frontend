// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';

// interface DynamicFormProps<T extends z.ZodType<any, any>> {
//     schema: T;
//     onSubmit: (data: z.infer<T>) => void;
// }

// export function DynamicForm<T extends z.ZodType<any, any>>({
//     schema,
//     onSubmit,
// }: DynamicFormProps<T>) {
//     const form = useForm({ resolver: zodResolver(schema) });

//     return (
//         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
//                 {Object.entries(schema.shape).map(([key, fieldSchema]) => {
//                     const fieldType = getFieldType(fieldSchema);
//                     return (
//                         <FormField
//                             key={key}
//                             control={form.control}
//                             name={key as any}
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>{key}</FormLabel>
//                                     <FormControl>
//                                         {fieldType === 'select' ? (
//                                             <Select
//                                                 onValueChange={field.onChange}
//                                                 defaultValue={field.value}
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder={`Chọn ${key}`} />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {(fieldSchema as z.ZodEnum<any>).options.map(
//                                                         (option: string) => (
//                                                             <SelectItem key={option} value={option}>
//                                                                 {option}
//                                                             </SelectItem>
//                                                         ),
//                                                     )}
//                                                 </SelectContent>
//                                             </Select>
//                                         ) : (
//                                             <Input
//                                                 type={fieldType}
//                                                 placeholder={`Nhập ${key}`}
//                                                 {...field}
//                                             />
//                                         )}
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                     );
//                 })}
//             </div>
//             <Button type="submit" className="mx-auto w-60">
//                 Gửi
//             </Button>
//         </form>
//     );
// }

// function getFieldType(schema: any): string {
//     if (schema instanceof z.ZodString) {
//         return schema._def.checks.some((check: any) => check.kind === 'uuid') ? 'text' : 'text';
//     } else if (schema instanceof z.ZodNumber) {
//         return 'number';
//     } else if (schema instanceof z.ZodEnum) {
//         return 'select';
//     }
//     return 'text';
// }
