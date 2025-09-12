export default function Spinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="w-16 h-16 border-12 border-green-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}