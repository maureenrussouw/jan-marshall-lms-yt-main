'use client';

import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { enrollInCourseAction } from '../action';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      try {
        const result = await enrollInCourseAction(courseId);

        if (result.status === 'success') {
          toast.success(result.message);
        } else if (result.status === 'error') {
          toast.error(result.message);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          'digest' in error &&
          typeof error.digest === 'string' &&
          error.digest.startsWith('NEXT_REDIRECT')
        ) {
          return;
        }

        toast.error('An unexpected error occurred. Please try again');
      }
    });
  }

  return (
    <Button onClick={onSubmit} disabled={isPending} className="w-full">
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Loading...
        </>
      ) : (
        'Enroll Now'
      )}
    </Button>
  );
}
