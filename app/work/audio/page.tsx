import { WorkPage } from '@/components/work/work-page';

export const metadata = { title: 'Audio / GH Creative' };

export default function Audio() {
  return <WorkPage
    title="Audio."
    number="05"
    description="Sound design and original audio shaped around the feeling of a project."
    examples={[]}
    pendingMessage="Audio samples are being prepared. Check back to listen to selected sound design and music work."
  />;
}
