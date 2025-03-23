import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import translate from 'translate';
import { useEffect, useState } from 'react';

function AutoFormLabel({
    label,
    isRequired,
    className,
}: {
    label: string;
    isRequired: boolean;
    className?: string;
}) {
    const [translatedLabel, setTranslatedLabel] = useState(label);

    useEffect(() => {
        async function translateLabel() {
            try {
                const result = await translate(label, { to: 'vi' });
                setTranslatedLabel(result);
            } catch (error) {
                console.error('Translation error:', error);
                setTranslatedLabel(label); // Fallback to the original label
            }
        }

        translateLabel();
    }, [label]);

    return (
        <>
            <FormLabel className={cn(className)}>
                {translatedLabel}
                {isRequired && <span className="text-destructive"> *</span>}
            </FormLabel>
        </>
    );
}

export default AutoFormLabel;
