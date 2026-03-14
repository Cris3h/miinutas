'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { PageTransition } from '@/components/layout/PageTransition';

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
    </PageTransition>
  );
}
