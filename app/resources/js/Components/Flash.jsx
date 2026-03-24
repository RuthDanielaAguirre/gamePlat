import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Flash() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 3500);
            return () => clearTimeout(t);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    const isError = !!flash.error;
    return (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all
            ${isError ? 'bg-red-500/90 text-white' : 'bg-[#7c6af7] text-white'}`}>
            {flash.success || flash.error}
        </div>
    );
}