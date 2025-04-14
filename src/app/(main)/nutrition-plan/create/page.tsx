import { Utensils } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NutritionPlanForm from '@/components/forms/nutrition-plan-form';

export default function CreateNutritionPlanPage() {
    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                        <Utensils className="mr-2" />
                        Tạo chế độ dinh dưỡng
                    </CardTitle>
                    <CardDescription>Điền thông tin chi tiết cho chế độ dinh dưỡng</CardDescription>
                </CardHeader>
                <CardContent>
                    <NutritionPlanForm />
                </CardContent>
            </Card>
        </div>
    );
}
