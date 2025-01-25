import { Footer } from "./footer";
import { Header } from "./header";

export function Loader() {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
            <Footer />
        </div>
    );
}