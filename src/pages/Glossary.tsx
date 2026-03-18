import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconSearch, IconBook, IconFilter, IconLoader2, IconX } from '@tabler/icons-react';
import { GlossaryIndex } from '@/components/glossary/GlossaryIndex';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
    category: string;
    related_chapter_ids: string;
}

const CATEGORIES = ['person', 'place', 'event', 'concept', 'date'];

export default function Glossary() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || 'all';

    const [localSearch, setLocalSearch] = useState(searchTerm);

    const { data: terms, isLoading, isError } = useQuery<GlossaryTerm[]>({
        queryKey: ['glossary'],
        queryFn: async () => {
            const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
            const res = await fetch(`${apiUrl}/api/glossary`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch glossary');
            return res.json();
        }
    });

    const filteredTerms = useMemo(() => {
        if (!terms) return [];
        let filtered = terms;

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(t =>
                t.term.toLowerCase().includes(lowerSearch) ||
                t.definition.toLowerCase().includes(lowerSearch)
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        return filtered;
    }, [terms, searchTerm, categoryFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams(prev => {
            if (localSearch) prev.set('search', localSearch);
            else prev.delete('search');
            return prev;
        });
    };

    const handleCategoryChange = (value: string) => {
        setSearchParams(prev => {
            if (value !== 'all') prev.set('category', value);
            else prev.delete('category');
            return prev;
        });
    };

    const clearFilters = () => {
        setLocalSearch('');
        setSearchParams({});
    };

    return (
        <main className="flex-1 w-full overflow-y-auto">
            <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                            <IconBook className="h-8 w-8 text-primary" />
                            Glossary
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                            Explore key historical figures, places, events, and concepts from the curriculum.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                         <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search terms..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="pl-9 pr-4"
                            />
                        </form>
                        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <SelectValue placeholder="Category" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(searchTerm || categoryFilter !== 'all') && (
                            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Loading glossary terms...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-destructive bg-destructive/10 rounded-xl">
                        Failed to load glossary. Please try again.
                    </div>
                ) : (
                    <GlossaryIndex terms={filteredTerms} />
                )}
            </div>
        </main>
    );
}
