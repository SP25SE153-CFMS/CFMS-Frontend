import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { ScrollArea } from '../ui/scroll-area';
import { sidebarItems, NavMainItem, NavSubItem } from '@/utils/constants/sidebar.constant';

export function CommandMenu({
    open,
    setOpen,
}: {
    open: boolean;
    // eslint-disable-next-line no-unused-vars
    setOpen: (open: boolean) => void;
}) {
    const router = useRouter();
    const { setTheme } = useTheme();
    // const { open, setOpen } = useSearch();

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false);
            command();
        },
        [setOpen],
    );

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Tìm kiếm..." />
            <CommandList>
                <ScrollArea type="hover" className="h-72 pr-1">
                    <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                    {sidebarItems[0].items.map((group: NavMainItem) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.subItems?.map((navItem: NavSubItem, i: number) => {
                                return (
                                    <CommandItem
                                        key={`${navItem.path}-${i}`}
                                        value={navItem.title}
                                        onSelect={() => {
                                            runCommand(() => router.push(navItem.path));
                                        }}
                                    >
                                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                            <ArrowRight className="size-2 text-muted-foreground/80" />
                                        </div>
                                        {navItem.title}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading="Giao diện">
                        <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                            <Sun className="mr-2 h-4 w-4" /> <span>Sáng</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Tối</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <span>Hệ thống</span>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    );
}
