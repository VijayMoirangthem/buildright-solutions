import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/contexts/NavigationContext';

interface BackButtonProps {
  className?: string;
  label?: string;
}

export function BackButton({ className, label }: BackButtonProps) {
  const { goBack, canGoBack } = useNavigation();

  if (!canGoBack) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={goBack}
      className={className}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
      {label && <span className="ml-2">{label}</span>}
    </Button>
  );
}
