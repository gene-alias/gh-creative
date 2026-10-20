import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Marketing / GH Creative' };

export default function Marketing() {
  return <WorkPage
    title="Marketing."
    number="04"
    description="Campaign ideas, content and messaging designed to connect across channels."
    examples={[]}
    pendingMessage="Marketing case studies are being prepared. Check back for selected campaigns and creative work."
  />;
}
