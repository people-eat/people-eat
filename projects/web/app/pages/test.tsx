export default function TestPage() {
    return (
        <div className="absolute inset-0 flex flex-col">
            <div className="bg-red-400">Header</div>
            <div className="bg-red-400">Header 2</div>

            <div className="flex flex-1 overflow-hidden">
                <div className="bg-yellow-400 overflow-y-auto">
                    {[
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    ].map((_, i) => (
                        <div key={i}>sidebar</div>
                    ))}
                </div>
                <div className="flex-1 flex">
                    <div className="bg-blue-400 flex-1 overflow-y-auto">
                        {[
                            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                        ].map((_, i) => (
                            <div key={i}>details</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
