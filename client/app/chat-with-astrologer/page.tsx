"use client";
import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader } from '@/components/loader';
import AstrologerCard from '@/components/ui/AstrologerCard';
import { AstrologerData } from '@/types/astrologer'; 

export default function Home() {
  const [astrologers, setAstrologers] = useState<AstrologerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/astrologers/list`);
        if (!response.ok) {
          throw new Error('Failed to fetch astrologers');
        }
        const data = await response.json();
        setAstrologers(data as AstrologerData[]);
      } catch (err) {
        console.error("Error fetching astrologers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers.map((astrologer) => (
              <AstrologerCard key={astrologer._id} astrologer={astrologer} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </Suspense>
  );
}
